from django import forms
from .models import JobApplication


class ResumeUploadForm(forms.Form):
    file = forms.FileField(
        label='Select your PDF resume',
        widget=forms.ClearableFileInput(attrs={'accept': '.pdf', 'class': 'form-control'})
    )


class JobDescriptionForm(forms.Form):
    company_name = forms.CharField(
        max_length=200,
        required=False,
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'e.g. Dvilite Technology'})
    )
    job_title = forms.CharField(
        max_length=200,
        required=False,
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'e.g. Python Full Stack Developer'})
    )
    job_description = forms.CharField(
        widget=forms.Textarea(attrs={
            'class': 'form-control',
            'placeholder': 'Paste the full job description here...',
            'rows': 7
        })
    )


class JobApplicationForm(forms.ModelForm):
    class Meta:
        model = JobApplication
        fields = ['company_name', 'job_title', 'job_url', 'job_description', 'notes', 'status']
        widgets = {
            'company_name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'e.g. Dvilite Technology'}),
            'job_title': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'e.g. Python Developer'}),
            'job_url': forms.URLInput(attrs={'class': 'form-control', 'placeholder': 'https://...'}),
            'job_description': forms.Textarea(attrs={'class': 'form-control', 'rows': 4, 'placeholder': 'Paste JD here...'}),
            'notes': forms.Textarea(attrs={'class': 'form-control', 'rows': 2, 'placeholder': 'Any notes...'}),
            'status': forms.Select(attrs={'class': 'form-control'}),
        }
