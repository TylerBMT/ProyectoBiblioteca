from rest_framework import serializers
from .models import Usuario, Rol, Libro, Prestamo, Reserva

# =========================
# Usuarios
# =========================
class UsuarioSerializer(serializers.ModelSerializer):
    roles = serializers.SerializerMethodField()

    class Meta:
        model = Usuario
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'estado', 'roles']

    def get_roles(self, obj):
        return list(obj.roles.values_list('nombre', flat=True))

class UsuarioCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = Usuario
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'estado', 'password']

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = Usuario(**validated_data)
        user.set_password(password)   # aquí se hace el hash
        user.save()
        rol_cliente, _ = Rol.objects.get_or_create(nombre='Cliente')
        user.roles.add(rol_cliente)
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


# =========================
# Libros
# =========================
class LibroSerializer(serializers.ModelSerializer):
    estado = serializers.SerializerMethodField()

    class Meta:
        model = Libro
        fields = ['id', 'isbn', 'titulo', 'autor', 'categoria', 'estado']

    def get_estado(self, obj):
        """
        Devuelve 'Prestado' si existe algún préstamo ACTIVO o VENCIDO
        para este libro. En caso contrario 'Disponible'.
        """
        hay_prestamo_activo = Prestamo.objects.filter(
            libro=obj,
            estado__in=['Activo', 'Vencido']
        ).exists()
        return 'Prestado' if hay_prestamo_activo else 'Disponible'



# =========================
# Préstamos
# =========================
class PrestamoSerializer(serializers.ModelSerializer):
    cliente = serializers.PrimaryKeyRelatedField(
        queryset=Usuario.objects.all(),
        source='usuario'
    )
    cliente_nombre = serializers.CharField(
        source='usuario.username',
        read_only=True
    )
    libro_titulo = serializers.CharField(
        source='libro.titulo',
        read_only=True
    )

    class Meta:
        model = Prestamo
        fields = [
            'id',
            'cliente',         
            'cliente_nombre',  
            'libro',           
            'libro_titulo',    
            'fecha_prestamo',
            'fecha_devolucion_esperada',
            'fecha_devolucion_real',
            'estado',
        ]
