from rest_framework import serializers
from .models import Resume, JobApplication

class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = ['id', 'file', 'extracted_text', 'uploaded_at']
        read_only_fields = ['extracted_text', 'uploaded_at']

class JobApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobApplication
        fields = [
            'id', 'company_name', 'job_title', 'job_description',
            'status', 'applied_date', 'notes', 'job_url',
            'cover_letter', 'skill_match_result', 'interview_questions',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['applied_date', 'created_at', 'updated_at']

class JobApplicationListSerializer(serializers.ModelSerializer):
    """Lighter serializer for list views — no heavy AI fields"""
    class Meta:
        model = JobApplication
        fields = ['id', 'company_name', 'job_title', 'status', 'applied_date', 'job_url']
