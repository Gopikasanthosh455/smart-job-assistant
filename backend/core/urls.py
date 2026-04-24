from django.urls import path
from .views import (
    ResumeUploadView,
    CoverLetterView,
    SkillMatchView,
    InterviewQuestionsView,
    JobApplicationListCreateView,
    JobApplicationDetailView,
    KanbanView,
)

urlpatterns = [
    # Resume
    path('resume/', ResumeUploadView.as_view(), name='resume'),

    # AI features
    path('ai/cover-letter/', CoverLetterView.as_view(), name='cover-letter'),
    path('ai/skill-match/', SkillMatchView.as_view(), name='skill-match'),
    path('ai/interview-questions/', InterviewQuestionsView.as_view(), name='interview-questions'),

    # Job applications (Kanban)
    path('applications/', JobApplicationListCreateView.as_view(), name='applications'),
    path('applications/<int:pk>/', JobApplicationDetailView.as_view(), name='application-detail'),
    path('applications/kanban/', KanbanView.as_view(), name='kanban'),
]
