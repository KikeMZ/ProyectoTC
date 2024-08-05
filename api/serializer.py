from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer 
from django.contrib.auth.models import User
from .models import Programmer, Alumno, Periodo, Clase2, Profesor, Inscripcion, Entrega, Criterio, ClaseCriterio, Calificacion

# Serializadores auxiliares

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls,user):
        token = super().get_token(user)
        correoUsuario = user.username
        dominioProfesor = "@correo.buap.mx"
        if dominioProfesor in correoUsuario:
            profesor = Profesor.objects.get(id_usuario=user)
            token['nombre'] = profesor.nombre
            token['correo'] = correoUsuario
        return token
            


# Serializadores principales

class ProgrammerSerializer(serializers.ModelSerializer):
    class Meta:
        model=Programmer
        fields='__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields='__all__'


class AlumnoSerializer(serializers.ModelSerializer):
    class Meta:
        model=Alumno
        fields='__all__'

class MateriaSerializer(serializers.ModelSerializer):
    class Meta:
        model=Alumno
        fields='__all__'

class ProfesorSerializer(serializers.ModelSerializer):
    class Meta:
        model=Profesor
        fields= '__all__'

class PeriodoSerializer(serializers.ModelSerializer):
    class Meta:
        model=Periodo
        fields= '__all__'

class Clase2Serializer(serializers.ModelSerializer):
    profesor_detail = ProfesorSerializer(source="id_profesor", read_only=True)

    class Meta:
        model=Clase2
        fields = ('nrc', 'clave', 'seccion', 'nombreMateria', 'id_profesor', 'profesor_detail', 'id_periodo')


class InscripcionSerializer(serializers.ModelSerializer):
    clase_detail = Clase2Serializer(source='clase', read_only=True)
    alumno_detail = AlumnoSerializer(source='alumno', read_only=True)

    class Meta:
        model = Inscripcion
        fields = ('id', 'clase', 'alumno','estado', 'clase_detail', 'alumno_detail')
        extra_kwargs = {
            'clase': {'write_only': True},
            'alumno': {'write_only': True}
        }

class CriterioSerializer(serializers.ModelSerializer):
    class Meta:
        model=Criterio
        fields='__all__'

class ClaseCriterioSerializer(serializers.ModelSerializer):
    clase_detail = Clase2Serializer(source='id_clase', read_only=True)
    criterio_detail = CriterioSerializer(source='id_criterio', read_only=True)
    class Meta:
        model=ClaseCriterio
        fields=('id','id_clase','id_criterio','nombre','ponderacion','clase_detail','criterio_detail')

class EntregaSerializer(serializers.ModelSerializer):
    claseCriterio_detail = ClaseCriterioSerializer(source='tipo', read_only=True)
    class Meta:
        model = Entrega
        fields = ('id', 'nombre', 'tipo', 'fecha', "estado",'claseCriterio_detail')

class CalificacionSerializer(serializers.ModelSerializer):
    alumno_detail = AlumnoSerializer(source="matricula", read_only=True)
    entrega_detail = EntregaSerializer(source="id_entrega", read_only=True)
    class Meta:
        model=Calificacion
        fields= ('id', 'nota', 'matricula', 'id_entrega', 'alumno_detail', 'entrega_detail')