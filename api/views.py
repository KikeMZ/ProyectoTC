from django.shortcuts import render
from rest_framework import viewsets
from .serializer import ProgrammerSerializer,AlumnoSerializer,Clase2Serializer, ProfesorSerializer
from .models import Programmer,Alumno,Clase2, Profesor

# Create your views here.

class ProgrammerViewSet(viewsets.ModelViewSet):       #esta clase se encarga de crear todo el crud#
    queryset = Programmer.objects.all()
    serializer_class = ProgrammerSerializer

class AlumnoViewSet(viewsets.ModelViewSet):
    queryset = Alumno.objects.all()
    serializer_class = AlumnoSerializer


class Clase2ViewSet(viewsets.ModelViewSet):
    queryset = Clase2.objects.all()
    serializer_class=Clase2Serializer

class ProfesorViewSet(viewsets.ModelViewSet):
    queryset = Profesor.objects.all()
    serializer_class=ProfesorSerializer

