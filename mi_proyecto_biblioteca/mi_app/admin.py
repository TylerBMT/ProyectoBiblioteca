# mi_app/admin.py

from django.contrib import admin
from .models import Rol, Usuario, UsuarioRol, Libro, Prestamo, Reserva

# 1. Registro de Modelos de la Aplicación
admin.site.register(Rol)
admin.site.register(Usuario) # Nota: Para un control más detallado del usuario, 
                              # en producción usarías una clase personalizada de UserAdmin.
admin.site.register(UsuarioRol)
admin.site.register(Libro)
admin.site.register(Prestamo)
admin.site.register(Reserva)

# Recomendación: Puedes definir cómo se visualizan los modelos en el panel.
# Ejemplo de registro detallado (Opcional, pero mejora la experiencia):

# class LibroAdmin(admin.ModelAdmin):
#     list_display = ('titulo', 'autor', 'isbn', 'categoria')
#     search_fields = ('titulo', 'autor', 'isbn')
#     list_filter = ('categoria',)

# admin.site.register(Libro, LibroAdmin)