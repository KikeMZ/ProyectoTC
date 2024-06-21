from django.shortcuts import render
from rest_framework import viewsets
from .serializer import ProgrammerSerializer,AlumnoSerializer,Clase2Serializer, ProfesorSerializer, InscripcionSerializer,EntregaSerializer,CriterioSerializer, ClaseCriterioSerializer, CalificacionSerializer
from .models import Programmer,Alumno,Clase2, Profesor, Inscripcion,Entrega,Criterio, ClaseCriterio, Calificacion
from rest_framework import filters, status
from rest_framework.response import Response
from rest_framework.decorators import action
import smtplib
from email.message import EmailMessage
import random
import string

def generarContrasena():
    Characters=string.ascii_letters + "1234567890_-/?¿@$%"
    word=""
    for i in range (10):
        letra=random.choice(Characters)
        word=word+letra
    return word


# Create your views here.

class ProgrammerViewSet(viewsets.ModelViewSet):       #esta clase se encarga de crear todo el crud#
    queryset = Programmer.objects.all()
    serializer_class = ProgrammerSerializer

class AlumnoViewSet(viewsets.ModelViewSet):
    queryset = Alumno.objects.all()
    serializer_class = AlumnoSerializer

    @action(detail=False, methods=['get'])
    def borrarAlumnos(self, request, pk=None):
        alumnos = Alumno.objects.all()
        for j in alumnos:
            j.delete()
        return Response(status=status.HTTP_200_OK)


class Clase2ViewSet(viewsets.ModelViewSet):
    queryset = Clase2.objects.all()
    serializer_class=Clase2Serializer

    @action(detail=False, methods=['get'])
    def getClasesByProfesor(self, request, pk=None):
        clases_filtradas = []
        lista_clases = []
        nombreProfesor = request.GET['profesor']
        profesor = Profesor.objects.get(nombre=nombreProfesor)
        print(profesor.id)
        clases_filtradas = Clase2.objects.filter(id_profesor=profesor.id)
        lista_clases = [ self.get_serializer(c).data for c in clases_filtradas ]
        print(lista_clases)
        return Response(lista_clases, status=status.HTTP_200_OK)

class ProfesorViewSet(viewsets.ModelViewSet):
    queryset = Profesor.objects.all()
    serializer_class=ProfesorSerializer
    filter_backends=[filters.SearchFilter]
    search_fields=["correo"]
    

    @action(detail=False, methods=['post'])
    def actualizarDatosProfesores(self, request, pk=None):
        datosProfesores = request.data["profesores"]
        tipoActualizacion = request.data["tipoActualizacion"]
        posicionProfesor = -1
        print(datosProfesores)
        profesores = Profesor.objects.all()
        if tipoActualizacion=='1':
            nombreProfesores = [ profesor.nombre for profesor in profesores]
            for p in datosProfesores:
                posicionProfesor = nombreProfesores.index(p["nombre"])
                contrasena = generarContrasena()
                profesores[posicionProfesor].contrasena = contrasena
                profesores[posicionProfesor].correo = p["correo"]
                profesores[posicionProfesor].save()
        else:
            identificadorProfesores = [ profesor.id for profesor in profesores]
            for p in datosProfesores:
                posicionProfesor = identificadorProfesores.index(p["id"])
                profesores[posicionProfesor].nombre = p["nombre"]
                if profesores[posicionProfesor].correo=="":
                    contrasena = generarContrasena()
                    profesores[posicionProfesor].contrasena = contrasena
                    profesores[posicionProfesor].correo = p["correo"]
                    profesores[posicionProfesor].save()
                      
        
        return Response([], status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'])
    def autenticarProfesor(self, request, pk=None):
        respuesta = {"nombre":"","correo":"","estadoSesion":1}
        correoFormulario = request.GET["correo"]
        contrasenaFormulario = request.GET["password"]
        if correoFormulario!="" or contrasenaFormulario!="":
            correosBD = [ p.correo for p in Profesor.objects.all()]
            if correoFormulario in correosBD:
                datosProfesor = Profesor.objects.get(correo=correoFormulario)
                if contrasenaFormulario==datosProfesor.contrasena:
                    respuesta["nombre"]=datosProfesor.nombre
                    respuesta["correo"]=datosProfesor.correo
                    respuesta["estadoSesion"]=0
                else:
                    respuesta["estadoSesion"]=2
                
        return Response(respuesta, status=status.HTTP_200_OK)

class InscripcionViewSet(viewsets.ModelViewSet):
    queryset = Inscripcion.objects.all()
    serializer_class=InscripcionSerializer
    filter_backends=[filters.SearchFilter] #Se indica que se permitira la filtracion de los datos basado en el dato que se pase mediante el metodo GET    
    search_fields=['clase__nrc','alumno__matricula'] #Se indicaran los campos en los cuales se buscara el valor indicado como parametro al momento de llamar al metodo GET

    @action(detail=False, methods=['get'])
    def prueba(self, request, pk=None):
        lista_alumnos = []
        inscripciones = Inscripcion.objects.all()
        for inscripcion in inscripciones:
            lista_alumnos.append(inscripcion.alumno.__dict__)
        print(lista_alumnos)
        return Response(lista_alumnos,status=status.HTTP_200_OK)
    
class CriterioViewSet(viewsets.ModelViewSet):
    queryset = Criterio.objects.all()
    serializer_class=CriterioSerializer
    filter_backends=[filters.SearchFilter]
    

class ClaseCriterioViewSet(viewsets.ModelViewSet):
    queryset = ClaseCriterio.objects.all()
    serializer_class = ClaseCriterioSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["id_clase__nrc"]

class EntregaViewSet(viewsets.ModelViewSet):
    queryset = Entrega.objects.all()  # Utiliza el queryset de Entrega en lugar de Clase2
    serializer_class = EntregaSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['tipo__id']  # Asegúrate de que 'nombre' esté definido en tu modelo Entrega

    @action(detail=False, methods=['get'])
    def getEntregasByNRC(self, request, pk=None):
        lista_entregas = []
        nrc = request.GET['nrc']
        entregas = Entrega.objects.all()
        lista_entregas = [ self.get_serializer(e).data for e in entregas if str(e.tipo.id_clase)==nrc ]

        return Response(lista_entregas,status=status.HTTP_200_OK)

class CalificacionViewSet(viewsets.ModelViewSet):
    queryset = Calificacion.objects.all()
    serializer_class = CalificacionSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['id_entrega__id']

    @action(detail=False, methods=['get'])
    def getCalificacionesByNRC(self, request, pk=None):
        lista_calificaciones = []
        nrc = request.GET['nrc']
        calificaciones = Calificacion.objects.all()
        lista_calificaciones = [ self.get_serializer(c).data for c in calificaciones if str(c.id_entrega.tipo.id_clase)==nrc]
        #print(lista_calificaciones)
        return Response(lista_calificaciones, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'])
    def getCalificacionesByEntrega(self, request, pk=None):
        lista_calificaciones = []
        entrega = request.GET['id']
        calificaciones = Calificacion.objects.all()
        lista_calificaciones = [ self.get_serializer(c).data for c in calificaciones if str(c.id_entrega.id)==entrega]
        print("e")
        print(lista_calificaciones)
        return Response(lista_calificaciones, status=status.HTTP_200_OK)