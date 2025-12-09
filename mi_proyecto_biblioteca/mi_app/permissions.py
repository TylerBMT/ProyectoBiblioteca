# mi_app/permissions.py
from rest_framework.permissions import BasePermission


class IsAdministrador(BasePermission):
    """
    Permite el acceso solo a usuarios autenticados que:
      - sean superusuarios, o
      - tengan el rol 'Administrador' en la relación Usuario.roles
    """

    message = "Se requieren permisos de administrador."

    def has_permission(self, request, view):
        user = request.user

        # No autenticado -> fuera
        if not user or not user.is_authenticated:
            return False

        # Superusuario siempre permitido
        if user.is_superuser:
            return True

        # Revisa el ManyToMany 'roles' del modelo Usuario
        return user.roles.filter(nombre__iexact='Administrador').exists()
