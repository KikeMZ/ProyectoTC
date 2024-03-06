from rest_framework import serializers
from .models import Programmer, Alumno,Clase2, Profesor


class ProgrammerSerializer(serializers.ModelSerializer):
    class Meta:
        model=Programmer
        fields='__all__'


class AlumnoSerializer(serializers.ModelSerializer):
    class Meta:
        model=Alumno
        fields='__all__'

class MateriaSerializer(serializers.ModelSerializer):
    class Meta:
        model=Alumno
        fields='__all__'


class Clase2Serializer(serializers.ModelSerializer):
    class Meta:
        model=Clase2
        fields='__all__'

class ProfesorSerializer(serializers.ModelSerializer):
    class Meta:
        model=Profesor
        fields= '__all__'