from django.urls import path
from . import views

urlpatterns = [
    path('', views.getData),
    path('process/', views.processResumeInfo),
    path('test/', views.testData),
    path('transcriptions/', views.processTranscriptions)
]