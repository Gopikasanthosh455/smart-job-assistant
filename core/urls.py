from django.urls import path
from . import views

urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    path('resume/', views.resume_view, name='resume'),
    path('skill-match/', views.skill_match_view, name='skill_match'),
    path('cover-letter/', views.cover_letter_view, name='cover_letter'),
    path('interview-prep/', views.interview_prep_view, name='interview_prep'),
    path('kanban/', views.kanban_view, name='kanban'),
    path('kanban/add/', views.add_application, name='add_application'),
    path('kanban/update/<int:pk>/', views.update_status, name='update_status'),
    path('kanban/delete/<int:pk>/', views.delete_application, name='delete_application'),
]
