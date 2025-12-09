from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from django.utils import timezone
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
import logging

from .models import Libro, Prestamo, Usuario
from .serializers import (
    LibroSerializer,
    PrestamoSerializer,
    UsuarioSerializer,
    UsuarioCreateSerializer,
)

logger = logging.getLogger(__name__)


# ------------------------------
# LOGIN
# ------------------------------

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        logger.warning(f"Intento de login para usuario: '{username}'")
        if password:
            logger.warning(f"Longitud de la contraseña recibida: {len(password)}")
        else:
            logger.error("La contraseña recibida es nula o vacía.")

        user = authenticate(request, username=username, password=password)

        if user is not None:
            if user.is_active:
                login(request, user)
                logger.warning(f"Login Exitoso para: {user.username}")
                return Response(
                    {
                        "message": "Inicio de sesión exitoso.",
                        "username": user.username,
                        "roles": [r.nombre for r in user.roles.all()],
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                logger.error(f"Login Fallido (403): Cuenta inactiva para {user.username}")
                return Response(
                    {"error": "Cuenta inactiva. Contacte al administrador."},
                    status=status.HTTP_403_FORBIDDEN,
                )

        logger.error(f"Login Fallido (401): Credenciales inválidas para {username}")
        return Response(
            {"error": "Credenciales inválidas. Usuario o contraseña incorrectos."},
            status=status.HTTP_401_UNAUTHORIZED,
        )


# ------------------------------
# LIBROS (pública)
# ------------------------------

class LibroViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = LibroSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Libro.objects.all()
        q = self.request.query_params.get('q')
        autor = self.request.query_params.get('autor')
        categoria = self.request.query_params.get('categoria')

        if q:
            queryset = queryset.filter(titulo__icontains=q)
        if autor:
            queryset = queryset.filter(autor__icontains=autor)
        if categoria and categoria != 'Todas':
            queryset = queryset.filter(categoria__iexact=categoria)

        return queryset


# ------------------------------
# PRÉSTAMOS (solo usuarios logueados)
# ------------------------------

class PrestamoViewSet(viewsets.ModelViewSet):
    queryset = Prestamo.objects.all().select_related('usuario', 'libro')
    serializer_class = PrestamoSerializer
    permission_classes = [permissions.AllowAny]

    @action(detail=True, methods=['post'])
    def devolver(self, request, pk=None):
        prestamo = self.get_object()

        if prestamo.estado == 'Devuelto':
            return Response(
                {"detail": "El préstamo ya está devuelto."},
                status=status.HTTP_400_BAD_REQUEST
            )

        prestamo.estado = 'Devuelto'
        prestamo.fecha_devolucion_real = timezone.now().date()
        prestamo.save()

        serializer = self.get_serializer(prestamo)
        return Response(serializer.data, status=status.HTTP_200_OK)


# ------------------------------
# CLIENTES (usuarios) – solo usuarios logueados
# ------------------------------

class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return (
            Usuario.objects
            .filter(is_superuser=False)
            .exclude(roles__nombre='Administrador')
            .distinct()
        )

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return UsuarioCreateSerializer
        return UsuarioSerializer


# ------------------------------
# REGISTRO PÚBLICO DE CLIENTES
# ------------------------------

class RegistroView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UsuarioCreateSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {
                    "message": "Registro exitoso.",
                    "username": user.username,
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ------------------------------
# CSRF
# ------------------------------

@ensure_csrf_cookie
def get_csrf_token(request):
    return JsonResponse({"message": "CSRF cookie set"})
