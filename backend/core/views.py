from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Resume, JobApplication
from .serializers import ResumeSerializer, JobApplicationSerializer, JobApplicationListSerializer
from .ai_service import (
    generate_cover_letter,
    analyse_skill_match,
    generate_interview_questions,
    extract_text_from_pdf
)


# ─── Resume Views ────────────────────────────────────────────────

class ResumeUploadView(APIView):
    """Upload a PDF resume and auto-extract text"""
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        file = request.FILES.get('file')
        if not file:
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)
        if not file.name.endswith('.pdf'):
            return Response({'error': 'Only PDF files are supported'}, status=status.HTTP_400_BAD_REQUEST)

        resume = Resume.objects.create(user=request.user, file=file)

        # Extract text from the uploaded PDF
        extracted = extract_text_from_pdf(resume.file.path)
        resume.extracted_text = extracted
        resume.save()

        return Response(ResumeSerializer(resume).data, status=status.HTTP_201_CREATED)

    def get(self, request):
        """Get user's latest resume"""
        resume = Resume.objects.filter(user=request.user).first()
        if not resume:
            return Response({'error': 'No resume uploaded yet'}, status=status.HTTP_404_NOT_FOUND)
        return Response(ResumeSerializer(resume).data)


# ─── AI Feature Views ─────────────────────────────────────────────

class CoverLetterView(APIView):
    """Generate a tailored cover letter using AI"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        job_description = request.data.get('job_description', '')
        company_name = request.data.get('company_name', '')
        job_title = request.data.get('job_title', '')
        application_id = request.data.get('application_id')

        if not job_description:
            return Response({'error': 'job_description is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Get resume text
        resume = Resume.objects.filter(user=request.user).first()
        if not resume or not resume.extracted_text:
            return Response({'error': 'Please upload your resume first'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            letter = generate_cover_letter(
                resume_text=resume.extracted_text,
                job_description=job_description,
                company_name=company_name,
                job_title=job_title
            )

            # Save to application if ID provided
            if application_id:
                app = JobApplication.objects.filter(id=application_id, user=request.user).first()
                if app:
                    app.cover_letter = letter
                    app.save()

            return Response({'cover_letter': letter})

        except Exception as e:
            return Response({'error': f'AI generation failed: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SkillMatchView(APIView):
    """Analyse resume vs job description match"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        job_description = request.data.get('job_description', '')
        application_id = request.data.get('application_id')

        if not job_description:
            return Response({'error': 'job_description is required'}, status=status.HTTP_400_BAD_REQUEST)

        resume = Resume.objects.filter(user=request.user).first()
        if not resume or not resume.extracted_text:
            return Response({'error': 'Please upload your resume first'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            result = analyse_skill_match(
                resume_text=resume.extracted_text,
                job_description=job_description
            )

            if application_id:
                app = JobApplication.objects.filter(id=application_id, user=request.user).first()
                if app:
                    app.skill_match_result = result
                    app.save()

            return Response(result)

        except Exception as e:
            return Response({'error': f'Analysis failed: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class InterviewQuestionsView(APIView):
    """Generate interview questions for a role"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        job_description = request.data.get('job_description', '')
        job_title = request.data.get('job_title', '')
        application_id = request.data.get('application_id')

        if not job_description:
            return Response({'error': 'job_description is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            questions = generate_interview_questions(
                job_description=job_description,
                job_title=job_title
            )

            if application_id:
                app = JobApplication.objects.filter(id=application_id, user=request.user).first()
                if app:
                    app.interview_questions = questions
                    app.save()

            return Response(questions)

        except Exception as e:
            return Response({'error': f'Generation failed: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ─── Job Application (Kanban) Views ───────────────────────────────

class JobApplicationListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return JobApplicationListSerializer
        return JobApplicationSerializer

    def get_queryset(self):
        queryset = JobApplication.objects.filter(user=self.request.user)
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class JobApplicationDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = JobApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return JobApplication.objects.filter(user=self.request.user)


class KanbanView(APIView):
    """Returns applications grouped by status for kanban board"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        applications = JobApplication.objects.filter(user=request.user)
        statuses = ['applied', 'interview', 'offer', 'rejected']
        board = {}
        for s in statuses:
            apps = applications.filter(status=s)
            board[s] = JobApplicationListSerializer(apps, many=True).data
        return Response(board)
