# 🤖 Smart Job Application Assistant

An AI-powered full-stack web app built with **Django REST Framework + React.js + Google Gemini API**.

Upload your resume → Paste any job description → Get an AI-generated cover letter, skill match analysis, and interview questions. Track all your applications in a Kanban board.

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Python 3.11, Django 4.2, Django REST Framework |
| Auth | JWT (SimpleJWT) |
| AI | Google Gemini API (gemini-1.5-flash) |
| PDF Parsing | PyMuPDF (fitz) |
| Frontend | React.js 18, React Router v6, Axios |
| Database | SQLite (dev) / PostgreSQL (production) |
| Deployment | Docker, Render (backend), Vercel (frontend) |

---

## 🚀 Local Setup (Step by Step)

### Step 1 — Get your free Gemini API key

1. Go to [https://aistudio.google.com](https://aistudio.google.com)
2. Sign in with Google
3. Click **"Get API Key"** → **"Create API Key"**
4. Copy the key — you'll need it in Step 3

---

### Step 2 — Clone and set up the project

```bash
git clone https://github.com/YOUR_USERNAME/smart-job-assistant.git
cd smart-job-assistant
```

---

### Step 3 — Backend setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate        # Mac/Linux
venv\Scripts\activate           # Windows

# Install dependencies
pip install -r requirements.txt


```

Edit `.env`:
```
GEMINI_API_KEY=paste_your_key_here
```

```bash
# Run migrations
python manage.py migrate

# Create admin user (optional)
python manage.py createsuperuser

# Start backend server
python manage.py runserver
```

Backend runs at: **http://localhost:8000**
Admin panel: **http://localhost:8000/admin**

---

### Step 4 — Frontend setup

Open a new terminal:

```bash
cd frontend
npm install
npm start
```

Frontend runs at: **http://localhost:3000**

---

### Step 5 — Start using the app

1. Go to http://localhost:3000
2. Register a new account
3. Upload your PDF resume (Resume page)
4. Go to Skill Match → paste any job description → see your match %
5. Go to Cover Letter → fill in company + JD → get your letter
6. Go to Interview Prep → generate questions
7. Add the job to your Kanban tracker

---

## 📁 Project Structure

```
smart-job-assistant/
├── backend/
│   ├── jobassistant/          # Django project settings & URLs
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── accounts/              # User auth (register, login, JWT)
│   │   ├── models.py          # Custom User model
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── core/                  # Main app logic
│   │   ├── models.py          # Resume, JobApplication models
│   │   ├── serializers.py
│   │   ├── views.py           # All API endpoints
│   │   ├── urls.py
│   │   └── ai_service.py      # ⭐ Gemini API integration
│   ├── requirements.txt
│   ├── manage.py
│   └── Dockerfile
├── frontend/
│   └── src/
│       ├── pages/
│       │   ├── DashboardPage.js
│       │   ├── ResumePage.js       # PDF upload
│       │   ├── SkillMatchPage.js   # AI skill match
│       │   ├── CoverLetterPage.js  # AI cover letter
│       │   ├── InterviewPrepPage.js# AI interview Qs
│       │   ├── KanbanPage.js       # Job tracker
│       │   ├── LoginPage.js
│       │   └── RegisterPage.js
│       ├── components/
│       │   └── Navbar/Navbar.js
│       ├── services/
│       │   └── api.js              # All Axios API calls
│       ├── context/
│       │   └── AuthContext.js      # Global auth state
│       └── App.js
├── docker-compose.yml
└── .gitignore
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/` | Register new user |
| POST | `/api/auth/login/` | Login, get JWT tokens |
| GET/PATCH | `/api/auth/profile/` | Get or update profile |
| POST | `/api/resume/` | Upload PDF resume |
| GET | `/api/resume/` | Get current resume + extracted text |
| POST | `/api/ai/cover-letter/` | Generate cover letter |
| POST | `/api/ai/skill-match/` | Analyse JD vs resume match |
| POST | `/api/ai/interview-questions/` | Generate interview questions |
| GET/POST | `/api/applications/` | List or create job applications |
| GET/PATCH/DELETE | `/api/applications/<id>/` | Manage single application |
| GET | `/api/applications/kanban/` | Get board grouped by status |

---


```

---

## ☁️ Deploy to Render (free)

1. Push your code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your GitHub repo
4. Set root directory: `backend`
5. Build command: `pip install -r requirements.txt`
6. Start command: `gunicorn jobassistant.wsgi:application`
7. Add environment variable: `GEMINI_API_KEY = your_key_here`
8. Deploy!

For frontend, deploy the `frontend` folder to [Vercel](https://vercel.com) (free).

---

## 📝 Resume Bullet Points (copy this to your resume)

- Built a full-stack AI-powered Job Application Assistant using Django REST Framework, React.js, and Google Gemini API
- Integrated Gemini LLM API to auto-generate cover letters, skill-match analysis, and interview questions from job descriptions
- Implemented PDF text extraction using PyMuPDF, JWT authentication, and a Kanban-style job tracker with full CRUD operations
- Containerized the application with Docker and deployed backend on Render with PostgreSQL

---

## 👩‍💻 Built by Gopika PS
- GitHub: [github.com/Gopikasanthosh455](https://github.com/Gopikasanthosh455)
- LinkedIn: [linkedin.com/in/gopika-santhosh455](https://linkedin.com/in/gopika-santhosh455)
