from django.contrib.auth.backends import BaseBackend
from django.contrib.auth.hashers import check_password
# Importa tu modelo de usuario personalizado que definiste en models.py
from .models import Usuario 

class CustomUserBackend(BaseBackend):
    """
    Backend de autenticación que usa el modelo Usuario de mi_app para
    garantizar que la función authenticate() busque en la tabla correcta.
    """
    def authenticate(self, request, username=None, password=None, **kwargs):
        try:
            # 1. Busca el usuario por el nombre de usuario (case-sensitive)
            user = Usuario.objects.get(username=username)
        except Usuario.DoesNotExist:
            # Si no se encuentra, la autenticación falla.
            return None 

        # 2. Verifica si la contraseña coincide con el hash almacenado en la DB
        if user.check_password(password):
            return user
        
        # 3. Si la contraseña es incorrecta
        return None

    def get_user(self, user_id):
        """
        Método obligatorio usado por el framework de sesiones de Django para
        recuperar el objeto User por su ID.
        """
        try:
            return Usuario.objects.get(pk=user_id)
        except Usuario.DoesNotExist:
            return None