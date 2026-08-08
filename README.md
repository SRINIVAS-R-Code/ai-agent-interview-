# AI Interview Agent

> End-to-end AI-powered **Resume Screening + Interview Simulation** platform.  
> Upload a resume, match it against a job description with NLP similarity, then run a live AI interview with real-time scoring and a comprehensive final evaluation.

[![Python](https://img.shields.io/badge/Python-3.9+-blue)](https://python.org)
[![Django](https://img.shields.io/badge/Django-4.2-green)](https://djangoproject.com)
[![React](https://img.shields.io/badge/React-18-61dafb)](https://react.dev)
[![Groq](https://img.shields.io/badge/LLM-Groq%20LLaMA%203.3%2070B-orange)](https://groq.com)

---

## Features

| Feature | Detail |
|---|---|
| Resume Screening | Upload PDF/DOCX/TXT → NLP similarity against JD |
| NLP Engine | SBERT `all-MiniLM-L6-v2` + TF-IDF cosine similarity |
| Skill Gap Analysis | Matched / missing skills from curated taxonomy |
| AI Interview | Groq LLaMA 3.3 70B generates role-specific questions |
| JD-Tailored Questions | Questions guided by the actual job description |
| Real-Time Scoring | Per-answer score (1-10) + justification |
| Final Evaluation | Grade, hire recommendation, strengths, gaps |
| Persistent Storage | SQLite (Django ORM) — zero setup |
| REST API | Django REST Framework — clean, documented endpoints |

---

## Architecture

```
┌──────────────────────────────┐     ┌─────────────────────────────┐
│   React + Vite (port 3000)   │────▶│  Django DRF (port 8000)     │
│                              │     │                             │
│  1. Landing                  │     │  POST /api/screening/analyze│
│  2. Resume Screening         │     │  POST /api/interview/questions│
│  3. Interview Session        │     │  POST /api/interview/score/ │
│  4. Results Dashboard        │     │  POST /api/interview/evaluate│
└──────────────────────────────┘     │                             │
                                     │  ┌───────────┐ ┌─────────┐ │
                                     │  │NLP Engine │ │  Groq   │ │
                                     │  │SBERT+TFIDF│ │LLaMA 3.3│ │
                                     │  └───────────┘ └─────────┘ │
                                     │       SQLite (dev)          │
                                     └─────────────────────────────┘
```

---

## NLP Approach

The resume scoring engine uses a **weighted hybrid** of two methods:

```
final_score = 0.7 × SBERT_score + 0.3 × TF-IDF_score
```

### Primary: Sentence-BERT (SBERT)
- Model: `all-MiniLM-L6-v2` (90MB, fast inference)
- Encodes both resume and job description into 384-dimensional semantic embeddings
- Computes cosine similarity → captures *meaning*, not just keyword overlap
- Handles synonyms: "software engineer" ≈ "developer" ≈ "programmer"

### Fallback: TF-IDF + Cosine Similarity
- `sklearn.TfidfVectorizer` with unigrams + bigrams
- Activates automatically if SBERT/torch is unavailable
- Lightweight, zero extra dependencies

### Skill Extraction
- Curated taxonomy of 70+ skills across languages, frameworks, tools, and concepts
- Word-boundary regex matching on lowercased text
- Returns matched skills (✅) and missing skills (🎯) with counts

---

## Quickstart

### Prerequisites
- Python 3.9+
- Node.js 18+
- Git

### 1. Clone
```bash
git clone https://github.com/SRINIVAS-R-Code/-ai-interview.git
cd -ai-interview
```

### 2. Backend Setup
```bash
# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS/Linux

# Install dependencies
pip install -r backend/requirements.txt

# Configure environment
copy backend\.env.example backend\.env   # Windows
# cp backend/.env.example backend/.env  # macOS/Linux

# Edit backend/.env and set your GROQ_API_KEY
# Get a free key at: https://console.groq.com

# Run migrations and start server
cd backend
python manage.py migrate
python manage.py runserver 8000
```

### 3. Frontend Setup (new terminal)
```bash
cd frontend
npm install
npm run dev
```

### 4. Open the app
Navigate to **http://localhost:3000**

---

## Environment Variables

Copy `backend/.env.example` to `backend/.env`:

```env
GROQ_API_KEY=your_groq_api_key_here   # Required — get free at console.groq.com
SECRET_KEY=django-insecure-change-me  # Change in production
DEBUG=True
```

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/screening/analyze/` | Upload resume + JD → NLP score |
| `GET`  | `/api/screening/history/` | Last 20 screening results |
| `POST` | `/api/interview/questions/` | Generate interview questions |
| `POST` | `/api/interview/score/` | Score a single answer |
| `POST` | `/api/interview/evaluate/` | Final holistic evaluation |
| `GET`  | `/api/interview/session/<id>/` | Retrieve session + answers |

### Example: Resume Screening
```bash
curl -X POST http://localhost:8000/api/screening/analyze/ \
  -F "resume=@sample_data/sample_resume.txt" \
  -F "jd_text=$(cat sample_data/sample_jd.txt)" \
  -F "role=Backend Software Engineer"
```

### Example: Generate Questions
```bash
curl -X POST http://localhost:8000/api/interview/questions/ \
  -H "Content-Type: application/json" \
  -d '{"role": "Backend Software Engineer", "n": 5}'
```

---

## Project Structure

```
ai-interview/
├── backend/                    # Django project
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env.example
│   ├── ai_interview/           # Project settings, urls
│   ├── screening/              # Resume screening app
│   │   ├── nlp_engine.py       # SBERT + TF-IDF engine
│   │   ├── models.py           # ScreeningResult model
│   │   └── views.py            # Upload & analyze API
│   └── interview/              # Interview session app
│       ├── question_gen.py     # Groq question generation
│       ├── evaluator.py        # Groq answer scoring
│       ├── models.py           # Session & Answer models
│       └── views.py            # All interview APIs
├── frontend/                   # React + Vite
│   └── src/components/
│       ├── LandingPage.jsx
│       ├── ResumeScreening.jsx
│       ├── InterviewSession.jsx
│       └── EvaluationDashboard.jsx
├── sample_data/
│   ├── sample_resume.txt       # Use this to test screening
│   └── sample_jd.txt           # Paste this as the JD
└── TRADEOFFS.md
```

---

## Sample Data

To quickly test without your own resume:
1. Open the app → **Screen + Interview**
2. Upload `sample_data/sample_resume.txt`
3. Paste the contents of `sample_data/sample_jd.txt` as the job description
4. Expected match score: **~72-80%** (SBERT + TF-IDF combined)

---

## Known Limitations

- **SBERT first-run**: Downloads a ~90MB model on first startup; subsequent runs use the local cache
- **No authentication**: This is a dev/demo build; add Django's auth system for production
- **SQLite**: Suitable for development and single-user demos; switch to PostgreSQL for multi-user production
- **Answer scoring**: LLM evaluation can vary; for production, consider a calibration layer

See [TRADEOFFS.md](./TRADEOFFS.md) for detailed design reasoning.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend Framework | Django 4.2 + Django REST Framework |
| LLM Provider | Groq (LLaMA 3.3 70B Versatile) |
| Semantic NLP | Sentence-Transformers `all-MiniLM-L6-v2` |
| Keyword NLP | scikit-learn TF-IDF |
| PDF Parsing | pdfplumber |
| DOCX Parsing | python-docx |
| Database | SQLite (Django ORM) |
| Frontend | React 18 + Vite |
| Styling | Vanilla CSS (design system tokens) |
