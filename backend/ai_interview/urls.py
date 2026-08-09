from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse

def root_view(request):
    return JsonResponse({"status": "ok", "message": "AI Interview Backend is running. Access the API at /api/screening/ or /api/interview/"})

urlpatterns = [
    path('', root_view, name='root'),
    path('admin/', admin.site.urls),
    path('api/screening/', include('screening.urls')),
    path('api/interview/', include('interview.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
