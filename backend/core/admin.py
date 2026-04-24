from django.contrib import admin
from .models import Resume, JobApplication

@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display = ['user', 'uploaded_at']

@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    list_display = ['job_title', 'company_name', 'user', 'status', 'applied_date']
    list_filter = ['status']
