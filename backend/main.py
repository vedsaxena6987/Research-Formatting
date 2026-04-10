import os
import shutil
import tempfile
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import pypandoc

# Automatically download pandoc if not available
try:
    pypandoc.get_pandoc_version()
except OSError:
    pypandoc.download_pandoc()

app = FastAPI(title="Formatting API")

# Enable CORS for local dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/format")
async def format_document(
    content_file: UploadFile = File(...),
    template_file: UploadFile = File(...),
    output_format: str = Form("docx")
):
    # Determine input extension
    def get_ext(filename):
        if not filename or '.' not in filename:
            return ""
        return filename.split('.')[-1].lower()

    content_ext = get_ext(content_file.filename) or "txt"
    template_ext = get_ext(template_file.filename) or "docx"

    with tempfile.TemporaryDirectory() as tmpdir:
        content_path = os.path.join(tmpdir, f"content.{content_ext}")
        template_path = os.path.join(tmpdir, f"template.{template_ext}")
        
        # We need mapping for pandoc format extensions
        ext_to_fmt = {
            'md': 'markdown',
            'docx': 'docx',
            'tex': 'latex',
            'latex': 'latex',
            'html': 'html',
            'txt': 'plain'
        }
        
        in_format = ext_to_fmt.get(content_ext, content_ext)
        out_format = ext_to_fmt.get(output_format.lower(), 'docx')

        # PDF generation requires an engine. If not available, fallback to DOCX
        if out_format == 'pdf':
            # Actually for pdf, pandoc usually needs pdflatex. We'll generate a pdf if requested.
            out_format = 'pdf'
        
        output_filename = f"formatted_output.{output_format.lower()}"
        output_path = os.path.join(tmpdir, output_filename)

        with open(content_path, "wb") as buffer:
            shutil.copyfileobj(content_file.file, buffer)
            
        with open(template_path, "wb") as buffer:
            shutil.copyfileobj(template_file.file, buffer)
            
        extra_args = []
        if ext_to_fmt.get(template_ext) == 'docx' and out_format == 'docx':
            extra_args.append(f"--reference-doc={template_path}")
        elif ext_to_fmt.get(template_ext) == 'latex' and out_format in ('latex', 'pdf'):
            extra_args.append(f"--template={template_path}")
        else:
            # Fallback for templates might not be supported directly by pandoc without specific formats
            pass
            
        try:
            pypandoc.convert_file(
                content_path,
                out_format,
                format=in_format,
                outputfile=output_path,
                extra_args=extra_args
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Conversion error: {str(e)}")

        # To return the file, we need a permanent temp location or stream it
        # Since tempdir gets deleted, let's copy to a safe place over writing to response directly,
        # or use a persistent temporary file that gets cleaned up later.
        
        # Create a stable output file path in the system tmp
        final_output_path = os.path.join(tempfile.gettempdir(), output_filename)
        shutil.copyfile(output_path, final_output_path)
        
    return FileResponse(path=final_output_path, filename=output_filename)

# Mount frontend build if it exists
frontend_dist = os.path.join(os.path.dirname(__file__), "../frontend/dist")
if os.path.exists(frontend_dist):
    app.mount("/", StaticFiles(directory=frontend_dist, html=True), name="frontend")
