from django.urls import path
from .views import AnalyzeResumeView, ScreeningHistoryView

urlpatterns = [
    path('analyze/', AnalyzeResumeView.as_view(), name='screening-analyze'),
    path('history/', ScreeningHistoryView.as_view(), name='screening-history'),
]
