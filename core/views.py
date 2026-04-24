from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .models import Resume, JobApplication
from .forms import ResumeUploadForm, JobDescriptionForm, JobApplicationForm
from .ai_service import (
    extract_text_from_pdf,
    generate_cover_letter,
    analyse_skill_match,
    generate_interview_questions,
)


# ── Dashboard ─────────────────────────────────────────────────────

@login_required
def dashboard(request):
    resume = Resume.objects.filter(user=request.user).first()
    total_apps = JobApplication.objects.filter(user=request.user).count()
    interview_count = JobApplication.objects.filter(user=request.user, status='interview').count()
    offer_count = JobApplication.objects.filter(user=request.user, status='offer').count()
    recent_apps = JobApplication.objects.filter(user=request.user)[:5]
    context = {
        'resume': resume,
        'total_apps': total_apps,
        'interview_count': interview_count,
        'offer_count': offer_count,
        'recent_apps': recent_apps,
    }
    return render(request, 'core/dashboard.html', context)


# ── Resume ────────────────────────────────────────────────────────

@login_required
def resume_view(request):
    resume = Resume.objects.filter(user=request.user).first()
    form = ResumeUploadForm()

    if request.method == 'POST':
        form = ResumeUploadForm(request.POST, request.FILES)
        if form.is_valid():
            file = request.FILES['file']
            if not file.name.endswith('.pdf'):
                messages.error(request, 'Only PDF files are supported.')
                return render(request, 'core/resume.html', {'form': form, 'resume': resume})

            # Delete old resume if exists
            if resume:
                resume.file.delete(save=False)
                resume.file = file
                resume.save()
            else:
                resume = Resume.objects.create(user=request.user, file=file)

            # Extract text from PDF
            extracted = extract_text_from_pdf(resume.file.path)
            resume.extracted_text = extracted
            resume.save()
            messages.success(request, 'Resume uploaded and text extracted successfully!')
            return redirect('resume')

    return render(request, 'core/resume.html', {'form': form, 'resume': resume})


# ── Skill Match ───────────────────────────────────────────────────

@login_required
def skill_match_view(request):
    resume = Resume.objects.filter(user=request.user).first()
    form = JobDescriptionForm()
    result = None

    if request.method == 'POST':
        form = JobDescriptionForm(request.POST)
        if form.is_valid():
            if not resume or not resume.extracted_text:
                messages.error(request, 'Please upload your resume first.')
                return redirect('resume')
            try:
                result = analyse_skill_match(
                    resume_text=resume.extracted_text,
                    job_description=form.cleaned_data['job_description']
                )
            except Exception as e:
                messages.error(request, f'AI analysis failed: {str(e)}. Check your Gemini API key.')

    return render(request, 'core/skill_match.html', {'form': form, 'result': result, 'resume': resume})


# ── Cover Letter ──────────────────────────────────────────────────

@login_required
def cover_letter_view(request):
    resume = Resume.objects.filter(user=request.user).first()
    form = JobDescriptionForm()
    letter = None

    if request.method == 'POST':
        form = JobDescriptionForm(request.POST)
        if form.is_valid():
            if not resume or not resume.extracted_text:
                messages.error(request, 'Please upload your resume first.')
                return redirect('resume')
            try:
                letter = generate_cover_letter(
                    resume_text=resume.extracted_text,
                    job_description=form.cleaned_data['job_description'],
                    company_name=form.cleaned_data.get('company_name', ''),
                    job_title=form.cleaned_data.get('job_title', ''),
                )
            except Exception as e:
                messages.error(request, f'AI generation failed: {str(e)}. Check your Gemini API key.')

    return render(request, 'core/cover_letter.html', {'form': form, 'letter': letter, 'resume': resume})


# ── Interview Prep ────────────────────────────────────────────────

@login_required
def interview_prep_view(request):
    form = JobDescriptionForm()
    questions = None

    if request.method == 'POST':
        form = JobDescriptionForm(request.POST)
        if form.is_valid():
            try:
                questions = generate_interview_questions(
                    job_description=form.cleaned_data['job_description'],
                    job_title=form.cleaned_data.get('job_title', 'Developer'),
                )
            except Exception as e:
                messages.error(request, f'AI generation failed: {str(e)}. Check your Gemini API key.')

    return render(request, 'core/interview_prep.html', {'form': form, 'questions': questions})


# ── Kanban Job Tracker ────────────────────────────────────────────

@login_required
def kanban_view(request):
    applications = JobApplication.objects.filter(user=request.user)
    board = {
        'applied': applications.filter(status='applied'),
        'interview': applications.filter(status='interview'),
        'offer': applications.filter(status='offer'),
        'rejected': applications.filter(status='rejected'),
    }
    form = JobApplicationForm()
    return render(request, 'core/kanban.html', {'board': board, 'form': form})


@login_required
def add_application(request):
    if request.method == 'POST':
        form = JobApplicationForm(request.POST)
        if form.is_valid():
            app = form.save(commit=False)
            app.user = request.user
            app.save()
            messages.success(request, 'Application added successfully!')
    return redirect('kanban')


@login_required
def update_status(request, pk):
    app = get_object_or_404(JobApplication, pk=pk, user=request.user)
    new_status = request.POST.get('status')
    if new_status in dict(JobApplication.STATUS_CHOICES):
        app.status = new_status
        app.save()
    return redirect('kanban')


@login_required
def delete_application(request, pk):
    app = get_object_or_404(JobApplication, pk=pk, user=request.user)
    app.delete()
    messages.success(request, 'Application deleted.')
    return redirect('kanban')
