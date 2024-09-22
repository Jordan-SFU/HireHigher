from django.db import models

# Create your models here.

class Item(models.Model):
    name = models.CharField(max_length=200)
    created = models.DateTimeField(auto_now_add=True)

class ResumeInfo(models.Model):
    jobTitle = models.CharField(max_length=200)
    additionalInfo = models.TextField()
    linkedinProfile = models.URLField()
    resume = models.FileField(upload_to='resumes/') # CHANGE THIS TO A TEXT 