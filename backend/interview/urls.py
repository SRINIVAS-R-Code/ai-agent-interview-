from django.urls import path
from .views import GenerateQuestionsView, ScoreAnswerView, FinalEvaluationView, SessionDetailView

urlpatterns = [
    path('questions/', GenerateQuestionsView.as_view(), name='interview-questions'),
    path('score/', ScoreAnswerView.as_view(), name='interview-score'),
    path('evaluate/', FinalEvaluationView.as_view(), name='interview-evaluate'),
    path('session/<int:pk>/', SessionDetailView.as_view(), name='interview-session'),
]
