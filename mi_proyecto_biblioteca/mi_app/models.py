from django.db import models
from django.contrib.auth.models import AbstractUser

# =================================================================
# 1. GESTIÓN DE USUARIOS Y ROLES (Para RBAC)
# =================================================================

class Rol(models.Model):
    """Define los roles de usuario (ej. Administrador, Bibliotecario, Estudiante)."""
    nombre = models.CharField(max_length=50, unique=True)
    
    def __str__(self):
        return self.nombre
    
    class Meta:
        # Asegura que la tabla se llame 'Roles' en el administrador.
        verbose_name_plural = "Roles" 


class Usuario(AbstractUser):
    """
    Extiende el modelo User de Django (AbstractUser) para incluir 
    la relación con Roles y el estado de la cuenta.
    """
    
    # Campo 'estado' basado en la especificación del proyecto
    estado = models.CharField(max_length=20, default='Activo', 
                              choices=[('Activo', 'Activo'), ('Suspendido', 'Suspendido')])
    
    # Relación N:M explícita a través de la tabla 'UsuarioRol'
    roles = models.ManyToManyField(Rol, through='UsuarioRol', related_name='usuarios')
    
    # El resto de campos (username, password, email, is_active, etc.)
    # son heredados de AbstractUser.

    def __str__(self):
        return self.username
    
    class Meta:
        # Usamos el nombre 'Usuario' en singular
        verbose_name = "Usuario" 


class UsuarioRol(models.Model):
    """Tabla intermedia para la relación N:M entre Usuario y Rol."""
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    rol = models.ForeignKey(Rol, on_delete=models.CASCADE)

    class Meta:
        # Garantiza que un usuario no pueda tener el mismo rol dos veces
        unique_together = ('usuario', 'rol')


# =================================================================
# 2. GESTIÓN DE CATÁLOGO Y OPERACIONES (Libro, Préstamo, Reserva)
# =================================================================

class Libro(models.Model):
    """Contiene la información bibliográfica esencial."""
    isbn = models.CharField(max_length=20, unique=True)
    titulo = models.CharField(max_length=255)
    autor = models.CharField(max_length=100)
    categoria = models.CharField(max_length=50) # Categoría del libro
    
    def __str__(self):
        return self.titulo
    
    class Meta:
        verbose_name_plural = "Libros"


class Prestamo(models.Model):
    """Registra las operaciones de préstamo."""
    # on_delete=models.RESTRICT: Impide borrar el usuario/libro si tiene préstamos activos
    usuario = models.ForeignKey(Usuario, on_delete=models.RESTRICT) 
    libro = models.ForeignKey(Libro, on_delete=models.RESTRICT)
    
    fecha_prestamo = models.DateTimeField(auto_now_add=True)
    fecha_devolucion_esperada = models.DateField()
    fecha_devolucion_real = models.DateField(null=True, blank=True)
    
    ESTADOS = [
        ('Activo', 'Activo'),
        ('Devuelto', 'Devuelto'),
        ('Vencido', 'Vencido'),
    ]
    estado = models.CharField(max_length=20, choices=ESTADOS, default='Activo')
    
    def __str__(self):
        return f"Préstamo de {self.libro.titulo} a {self.usuario.username}"


class Reserva(models.Model):
    """Registra las reservas de libros."""
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    libro = models.ForeignKey(Libro, on_delete=models.CASCADE)
    
    fecha_reserva = models.DateTimeField(auto_now_add=True)
    fecha_vencimiento = models.DateField(null=True, blank=True)
    
    ESTADOS = [
        ('Pendiente', 'Pendiente'),
        ('Disponible', 'Disponible'), # Libro esperando a ser recogido
        ('Cancelada', 'Cancelada'),
    ]
    estado = models.CharField(max_length=20, choices=ESTADOS, default='Pendiente')
    
    def __str__(self):
        return f"Reserva de {self.libro.titulo} por {self.usuario.username}"