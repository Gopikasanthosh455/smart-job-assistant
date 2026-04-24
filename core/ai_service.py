# import json
# import re
# import google.generativeai as genai
# from django.conf import settings
#
# genai.configure(api_key=settings.GEMINI_API_KEY)
# model = genai.GenerativeModel('gemini-2.0-flash')
#
#
# def extract_text_from_pdf(file_path):
#     """Extract text from uploaded PDF resume using PyMuPDF"""
#     try:
#         import fitz  # PyMuPDF
#         doc = fitz.open(file_path)
#         text = ""
#         for page in doc:
#             text += page.get_text()
#         doc.close()
#         return text.strip()
#     except Exception as e:
#         return f"Could not extract text: {str(e)}"
#
#
# def generate_cover_letter(resume_text, job_description, company_name, job_title):
#     """Generate tailored cover letter using Gemini"""
#     prompt = f"""
# You are an expert career coach. Write a professional cover letter.
#
# Job Title: {job_title}
# Company: {company_name}
#
# Job Description:
# {job_description}
#
# Candidate Resume:
# {resume_text}
#
# Instructions:
# - Write 3 clear paragraphs
# - Match candidate skills to job requirements
# - Be specific, not generic
# - Keep under 300 words
# - End with: Sincerely, [Candidate Name]
# """
#     response = model.generate_content(prompt)
#     return response.text
#
#
# def analyse_skill_match(resume_text, job_description):
#     """Analyse resume vs job description and return JSON result"""
#     prompt = f"""
# You are an ATS expert. Analyse the resume against the job description.
#
# Job Description:
# {job_description}
#
# Resume:
# {resume_text}
#
# Respond ONLY in this exact JSON format, no extra text, no markdown:
# {{
#   "match_percentage": 72,
#   "matched_skills": ["Python", "Django", "REST APIs"],
#   "missing_skills": ["Docker", "Scikit-learn", "AWS"],
#   "strengths": ["Strong backend experience", "Multiple full-stack projects"],
#   "suggestions": ["Learn Docker basics", "Add an ML project to portfolio"]
# }}
# """
#     response = model.generate_content(prompt)
#     text = response.text.strip()
#     text = re.sub(r'```json|```', '', text).strip()
#     return json.loads(text)
#
#
# def generate_interview_questions(job_description, job_title):
#     """Generate role-specific interview questions"""
#     prompt = f"""
# You are a senior technical interviewer. Generate interview questions for this role.
#
# Job Title: {job_title}
# Job Description:
# {job_description}
#
# Respond ONLY in this exact JSON format, no extra text, no markdown:
# {{
#   "technical": [
#     {{"question": "Explain how Django REST Framework handles authentication?", "tip": "Mention JWT, session auth, token auth"}},
#     {{"question": "What is the difference between SQL and NoSQL?", "tip": "Give examples of when to use each"}},
#     {{"question": "How does Django ORM work?", "tip": "Explain models, querysets, migrations"}},
#     {{"question": "What is a REST API?", "tip": "Explain HTTP methods GET POST PUT DELETE"}},
#     {{"question": "Explain Python decorators.", "tip": "Give a simple real-world example"}}
#   ],
#   "behavioural": [
#     {{"question": "Tell me about a challenging bug you fixed.", "tip": "Use STAR method: Situation Task Action Result"}},
#     {{"question": "How do you handle tight deadlines?", "tip": "Show you can prioritise and communicate"}},
#     {{"question": "Describe a project you are most proud of.", "tip": "Talk about your best GitHub project"}}
#   ],
#   "project": [
#     {{"question": "Walk me through one of your projects end to end.", "tip": "2 minute story: problem, stack, challenges, result"}},
#     {{"question": "What was the hardest technical decision you made in a project?", "tip": "Be specific, show problem-solving"}}
#   ]
# }}
# """
#     response = model.generate_content(prompt)
#     text = response.text.strip()
#     text = re.sub(r'```json|```', '', text).strip()
#     return json.loads(text)



import json
import re
from groq import Groq
from django.conf import settings


client = Groq(api_key=settings.GROQ_API_KEY)


def call_ai(prompt):
    """Send prompt to Groq and return response text"""
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content


def extract_text_from_pdf(file_path):
    """Extract text from uploaded PDF resume using PyMuPDF"""
    try:
        import fitz
        doc = fitz.open(file_path)
        text = ""
        for page in doc:
            text += page.get_text()
        doc.close()
        return text.strip()
    except Exception as e:
        return f"Could not extract text: {str(e)}"


def generate_cover_letter(resume_text, job_description, company_name, job_title):
    """Generate tailored cover letter using Groq"""
    prompt = f"""
You are an expert career coach. Write a professional cover letter.

Job Title: {job_title}
Company: {company_name}

Job Description:
{job_description}

Candidate Resume:
{resume_text}

Instructions:
- Write 3 clear paragraphs
- Match candidate skills to job requirements
- Be specific, not generic
- Keep under 300 words
- End with: Sincerely, [Candidate Name]
"""
    return call_ai(prompt)


def analyse_skill_match(resume_text, job_description):
    """Analyse resume vs job description and return JSON result"""
    prompt = f"""
You are an ATS expert. Analyse the resume against the job description.

Job Description:
{job_description}

Resume:
{resume_text}

Respond ONLY in this exact JSON format, no extra text, no markdown:
{{
  "match_percentage": 72,
  "matched_skills": ["Python", "Django", "REST APIs"],
  "missing_skills": ["Docker", "Scikit-learn", "AWS"],
  "strengths": ["Strong backend experience", "Multiple full-stack projects"],
  "suggestions": ["Learn Docker basics", "Add an ML project to portfolio"]
}}
"""
    text = call_ai(prompt)
    text = re.sub(r'```json|```', '', text).strip()
    return json.loads(text)


def generate_interview_questions(job_description, job_title):
    """Generate role-specific interview questions"""
    prompt = f"""
You are a senior technical interviewer. Generate interview questions for this role.

Job Title: {job_title}
Job Description:
{job_description}

Respond ONLY in this exact JSON format, no extra text, no markdown:
{{
  "technical": [
    {{"question": "Explain how Django REST Framework handles authentication?", "tip": "Mention JWT, session auth, token auth"}},
    {{"question": "What is the difference between SQL and NoSQL?", "tip": "Give examples of when to use each"}},
    {{"question": "How does Django ORM work?", "tip": "Explain models, querysets, migrations"}},
    {{"question": "What is a REST API?", "tip": "Explain HTTP methods GET POST PUT DELETE"}},
    {{"question": "Explain Python decorators.", "tip": "Give a simple real-world example"}}
  ],
  "behavioural": [
    {{"question": "Tell me about a challenging bug you fixed.", "tip": "Use STAR method: Situation Task Action Result"}},
    {{"question": "How do you handle tight deadlines?", "tip": "Show you can prioritise and communicate"}},
    {{"question": "Describe a project you are most proud of.", "tip": "Talk about your best GitHub project"}}
  ],
  "project": [
    {{"question": "Walk me through one of your projects end to end.", "tip": "2 minute story: problem, stack, challenges, result"}},
    {{"question": "What was the hardest technical decision you made in a project?", "tip": "Be specific, show problem-solving"}}
  ]
}}
"""
    text = call_ai(prompt)
    text = re.sub(r'```json|```', '', text).strip()
    return json.loads(text)