from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (LoginView, get_csrf_token, LibroViewSet, PrestamoViewSet, ClienteViewSet, RegistroView)

router = DefaultRouter()
router.register(r'libros', LibroViewSet, basename='libro')
router.register(r'prestamos', PrestamoViewSet, basename='prestamo')
router.register(r'clientes', ClienteViewSet, basename='cliente')

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('csrf-token/', get_csrf_token, name='csrf-token'),
    path('registro/', RegistroView.as_view(), name='registro'),
] + router.urls
