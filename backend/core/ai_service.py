import google.generativeai as genai
from django.conf import settings

genai.configure(api_key=settings.GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')  # free tier model

def generate_cover_letter(resume_text: str, job_description: str, company_name: str, job_title: str) -> str:
    """Generate a tailored cover letter using Gemini API"""
    prompt = f"""
You are an expert career coach. Write a professional, tailored cover letter.

Job Title: {job_title}
Company: {company_name}

Job Description:
{job_description}

Candidate's Resume:
{resume_text}

Instructions:
- Write a compelling 3-paragraph cover letter
- Match the candidate's skills to the job requirements
- Be specific, not generic
- Professional but warm tone
- Do NOT include placeholders like [Your Name] — end with "Sincerely, [Candidate Name]"
- Keep it under 300 words
"""
    response = model.generate_content(prompt)
    return response.text


def analyse_skill_match(resume_text: str, job_description: str) -> dict:
    """Analyse how well the resume matches the job description"""
    prompt = f"""
You are an ATS (Applicant Tracking System) expert. Analyse the resume against the job description.

Job Description:
{job_description}

Resume:
{resume_text}

Respond ONLY in this exact JSON format (no markdown, no extra text):
{{
  "match_percentage": 72,
  "matched_skills": ["Python", "Django", "REST APIs"],
  "missing_skills": ["Docker", "Scikit-learn", "AWS"],
  "strengths": ["Strong backend experience", "Multiple full-stack projects"],
  "suggestions": ["Learn Docker basics", "Add ML project to portfolio"]
}}
"""
    response = model.generate_content(prompt)
    import json, re
    text = response.text.strip()
    # Clean up if model wraps in markdown
    text = re.sub(r'```json|```', '', text).strip()
    return json.loads(text)


def generate_interview_questions(job_description: str, job_title: str) -> list:
    """Generate role-specific interview questions"""
    prompt = f"""
You are a senior technical interviewer. Generate 10 interview questions for this role.

Job Title: {job_title}
Job Description:
{job_description}

Respond ONLY in this exact JSON format (no markdown, no extra text):
{{
  "technical": [
    {{"question": "Explain how Django REST Framework handles authentication?", "tip": "Mention JWT, session auth, and token auth options"}},
    {{"question": "What is the difference between SQL and NoSQL databases?", "tip": "Give examples of when to use each"}}
  ],
  "behavioural": [
    {{"question": "Tell me about a challenging bug you fixed.", "tip": "Use the STAR method: Situation, Task, Action, Result"}},
    {{"question": "How do you handle tight deadlines?", "tip": "Show you can prioritise and communicate"}}
  ],
  "project": [
    {{"question": "Walk me through one of your projects end to end.", "tip": "Prepare a 2-minute story: problem, tech stack, challenges, outcome"}}
  ]
}}

Generate 5 technical, 3 behavioural, 2 project questions. Keep it relevant to the role.
"""
    response = model.generate_content(prompt)
    import json, re
    text = response.text.strip()
    text = re.sub(r'```json|```', '', text).strip()
    return json.loads(text)


def extract_text_from_pdf(file_path: str) -> str:
    """Extract text from uploaded PDF resume"""
    try:
        import fitz  # PyMuPDF
        doc = fitz.open(file_path)
        text = ""
        for page in doc:
            text += page.get_text()
        doc.close()
        return text.strip()
    except Exception as e:
        return f"Could not extract text: {str(e)}"
