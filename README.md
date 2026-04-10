# AutoFormat: Aesthetic Document Transformer ✨

**AutoFormat** is an advanced, fully decoupled web-based tool designed to automate document formatting. By supplying a standard **Content Document** alongside a structural **Template Document**, the backend intelligently rips the typographic and paginated rules completely out of the template and seamlessly applies them to the content document.

## 🚀 Key Features

- **Decoupled Architecture:** Utilizes a highly reactive `Vite + React` frontend and an immensely powerful `Python FastAPI` backend.
- **Intelligent Formatting Engine:** Powered by `Pandoc`, extracting complex variables like font weights, text margins, and header cascades dynamically.
- **Support for Industry Formats:** Natively handles `DOCX`, `LaTeX`, and `PDF` inputs and transformations seamlessly.
- **Premium Glassmorphism UI:** Adheres to state-of-the-art modern visual aesthetic using frosted components, dark mode color grading, and ambient shape animations.
- **Live Output Rendering:** Supports in-browser `PDF` preview directly for immediate result validation. 

---

## 🛠 Tech Stack

- **Frontend:** React, Vite JS, Vanilla CSS Variables & Micro-animations
- **Backend:** Python (FastAPI), Uvicorn, PyPandoc
- **Server:** Node (v22+), Python (v3.10+)

---

## 💻 Running Locally

Because the frontend and backend are thoroughly decoupled, they must be run concurrently on separate local ports.

### 1. Initialize the Python Backend
First, activate the server environment handling the heavy document composition:

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt # (or fastApi/uvicorn/pypandoc)
uvicorn main:app --reload
```
*Your backend will be running live on: http://localhost:8000*

### 2. Initialize the React Frontend
Open a **new, separate terminal instance** and start the UI:

```bash
cd frontend
npm install
npm run dev
```
*Your frontend UI will be running live on: http://localhost:5173* (or similar port).

---

## 🧠 How The Document Template Works

To perfectly transplant a document, rule matching is essential.
If your Output Format is **DOCX**, your uploaded template *must* be `.docx` format. 
If your Output Format is **LaTeX or PDF**, your template *must* be `.tex` format. 

* The underlying FastAPI engine analyzes your formatting template and injects semantic tags mapped from your plain content document perfectly matching variables, letting you instantly build submission-ready publications!

---
*Created automatically with Gemini.*
