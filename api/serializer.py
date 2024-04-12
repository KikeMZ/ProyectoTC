from rest_framework import serializers
from .models import Programmer, Alumno,Clase2, Profesor, Inscripcion, Entrega, Criterio, ClaseCriterio


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

class InscripcionSerializer(serializers.ModelSerializer):
    clase_detail = Clase2Serializer(source='clase', read_only=True)
    alumno_detail = AlumnoSerializer(source='alumno', read_only=True)

    class Meta:
        model = Inscripcion
        fields = ('id', 'clase', 'alumno', 'clase_detail', 'alumno_detail')
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
        fields=('id','id_clase','id_criterio','ponderacion','clase_detail','criterio_detail')

class EntregaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Entrega
        fields = ('id_entrega', 'nombre', 'tipo')
