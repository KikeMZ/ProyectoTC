from django.shortcuts import render
from django.contrib.auth.models import User, Group
from rest_framework import viewsets
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializer import ProgrammerSerializer,AlumnoSerializer, PeriodoSerializer,Clase2Serializer, ProfesorSerializer, InscripcionSerializer,EntregaSerializer,CriterioSerializer, ClaseCriterioSerializer, CalificacionSerializer, UserSerializer, CustomTokenObtainPairSerializer, AsistenciaSerializer
from .models import Programmer,Alumno, Periodo,Clase2, Profesor, Inscripcion,Entrega,Criterio, ClaseCriterio, Calificacion, Asistencia
from rest_framework import filters, status
from rest_framework.response import Response
from rest_framework.decorators import action
import smtplib
from email.message import EmailMessage
import random
import string
from django.utils import timezone
from rest_framework.pagination import PageNumberPagination
from django.http import JsonResponse
from django.utils.timezone import now
from datetime import date
from django.db.models import Count
from rest_framework.views import APIView

def generarCodigo(tamano:int):
    Characters=string.ascii_letters + "1234567890."
    word=""
    for i in range (tamano):
        letra=random.choice(Characters)
        word=word+letra
    return word

def generarToken():
    return generarCodigo(50)

def generarContrasena():
    return generarCodigo(10)

def enviarCorreo(correoDestino:str):
    remitente="sm.maldonado1799@gmail.com"
    destinatario="pokemondile24@gmail.com"
    mensaje="hola mundo"
    email=EmailMessage()
    email["from"]=remitente
    email["to"]=destinatario
    email["subject"]="correo prueba"
    x=generarContrasena()
    # email.set_content(mensaje)
    # email.set_content(email.set_content("tu contraseña es:"+ mensaje))
    email.set_content("tu contraseña es:" + x)
    smtp=smtplib.SMTP("smtp.gmail.com",port=587)#puede llegar a variar
    #smtp.ehlo()
    smtp.starttls()
    ##smtp.login(remitente,"Drafthhh-1")
    smtp.login(remitente,"jywedbrhzkbbwjvg")
    smtp.sendmail(remitente,destinatario,email.as_string())
    smtp.quit()


# Auxiliar views

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

# Create your views here.

class ProgrammerViewSet(viewsets.ModelViewSet):       #esta clase se encarga de crear todo el crud#
    queryset = Programmer.objects.all()
    serializer_class = ProgrammerSerializer

class UserViewSet(viewsets.ModelViewSet):       #esta clase se encarga de crear todo el crud#
    queryset = User.objects.all()
    serializer_class = UserSerializer

    @action(detail=True, methods=['get'])
    def grupos(self, request, pk=None):
        user = self.get_object()
        serializer = UserSerializer(user)
        print(serializer.data)
        return Response([])

class AlumnoViewSet(viewsets.ModelViewSet):
    queryset = Alumno.objects.all()
    serializer_class = AlumnoSerializer

    @action(detail=False, methods=['post'])
    def registrarAlumnos(self, request, pk=None):
        alumnos = request.data["alumnos"]
        for alumno in alumnos:
            contrasena = generarContrasena()
            usuario = User.objects.create_user(username=alumno["correo"], email=alumno["correo"], password=contrasena)
            Alumno.objects.create(matricula=alumno["matricula"], nombre=alumno["nombre"], apellidos=alumno["apellidos"], correo=alumno["correo"],id_usuario=usuario)
            print("Se ha creado la cuenta para un alumno")
        return Response([], status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'])
    def borrarAlumnos(self, request, pk=None):
        alumnos = Alumno.objects.all()
        for j in alumnos:
            j.delete()
        return Response(status=status.HTTP_200_OK)

class PeriodoViewSet(viewsets.ModelViewSet):
    queryset = Periodo.objects.all()
    serializer_class = PeriodoSerializer

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
    
    @action(detail=False, methods=['get'], url_path=r'getClasesByAlumno/(?P<alumno>[^/.]+)')
    def getClasesByAlumno(self, request, alumno, pk=None):
        print("In")
        inscripciones_alumno = []
        clases_filtradas = []
        lista_clases = []
        #instancia_alumno = Alumno.objects.get(matricula=alumno)
        inscripciones_alumno = Inscripcion.objects.filter(alumno=alumno)
        clases_filtradas = [ inscripcion.clase for inscripcion in inscripciones_alumno]
        lista_clases = [ self.get_serializer(c).data for c in clases_filtradas if c.id_periodo.estado=="ACTIVO"]
        #print(clases_filtradas[0].nombreMateria)
        return Response(lista_clases, status=status.HTTP_200_OK)
        

    @action(detail=False, methods=['get'], url_path=r'getClasesByPeriodo/(?P<periodo>[^/.]+)')
    def getClasesByPeriodo(self, request, periodo, pk=None):
        clases_filtradas = []
        lista_clases = []
        clases_filtradas = Clase2.objects.filter(id_periodo=periodo).order_by("nombreMateria")
        lista_clases = [ self.get_serializer(c).data for c in clases_filtradas ]
        print(lista_clases)
        return Response(lista_clases, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=["get"], url_path=r'getClasesByProfesorCurrentPeriodo/(?P<profesor>[^/.]+)')
    def getClasesByProfesorCurrentPeriodo(self, request, profesor, pk=None):
        #clases_profesor = []
        clases_filtradas = []
        lista_clases_activas = []
        #periodos_activos = Periodo.objects.filter(estado="ACTIVO")
        #profesor = Profesor.objects.get(id=profesor)
        #print(profesor.id)
        clases_filtradas = Clase2.objects.filter(id_profesor=profesor)
        lista_clases_activas = [ self.get_serializer(c).data for c in clases_filtradas if c.id_periodo.estado=="ACTIVO"]
        #print(lista_clases)
        return Response(lista_clases_activas, status=status.HTTP_200_OK)
        

class ProfesorViewSet(viewsets.ModelViewSet):
    queryset = Profesor.objects.all()
    serializer_class=ProfesorSerializer
    filter_backends=[filters.SearchFilter]
    search_fields=["correo"]
    

    @action(detail=False, methods=['post'])
    def crearCuenta(self, request, pk=None):
        profesor = request.data
        usuarioProfesor = User.objects.create_user(username=profesor["correo"], email=profesor["correo"], password=profesor["correo"])
        print(usuarioProfesor.password)
        p = Profesor.objects.create(nombre=profesor["nombre"], contrasena=profesor["contrasena"], id_usuario=usuarioProfesor)
        print("Profesor valido")
        return Response([], status=status.HTTP_201_CREATED)
#        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    @action(detail=False, methods=['post'])
    def actualizarDatosProfesores(self, request, pk=None):
        datosProfesores = request.data["profesores"]
        tipoActualizacion = request.data["tipoActualizacion"]
        posicionProfesor = -1
        print(datosProfesores)
        profesores = Profesor.objects.all()
        #Se comprueba si el endpoint es llamado despues de extraer datos del PDF de la pagina de Secretaria Academica
        if tipoActualizacion=='1':
            nombreProfesores = [ profesor.nombre for profesor in profesores]
            for p in datosProfesores:
                posicionProfesor = nombreProfesores.index(p["nombre"])
                correoInicial = profesores[posicionProfesor].correo
                profesores[posicionProfesor].correo = p["correo"]
                if correoInicial=="":
                    contrasena = generarContrasena()
                    profesores[posicionProfesor].contrasena = contrasena
                    usuarioProfesor = User.objects.create_user(username=p["correo"], email=p["correo"], password=contrasena)
                    print("Se ha creado la cuenta para un profesor")
                    profesores[posicionProfesor].id_usuario = usuarioProfesor
                if profesores[posicionProfesor].correo!="" and profesores[posicionProfesor]!=p["correo"]:
                    profesores[posicionProfesor].correo = p["correo"]
                    profesores[posicionProfesor].id_usuario.username = p["correo"] 
                    profesores[posicionProfesor].id_usuario.save()
                profesores[posicionProfesor].save()
                
        else:
            identificadorProfesores = [ profesor.id for profesor in profesores]
            for p in datosProfesores:
                posicionProfesor = identificadorProfesores.index(p["id"])
                profesores[posicionProfesor].nombre = p["nombre"]
                if profesores[posicionProfesor].correo=="" and p["correo"]!="":
                    contrasena = generarContrasena()
                    profesores[posicionProfesor].contrasena = contrasena
                    profesores[posicionProfesor].correo = p["correo"]
                    usuarioProfesor = User.objects.create_user(username=p["correo"], email=p["correo"], password=contrasena)
                    print("Se ha creado la cuenta para un profesor")
                    profesores[posicionProfesor].id_usuario = usuarioProfesor
                if profesores[posicionProfesor].correo!="" and profesores[posicionProfesor]!=p["correo"]:
                    profesores[posicionProfesor].correo = p["correo"]
                    profesores[posicionProfesor].id_usuario.username = p["correo"] 
                    profesores[posicionProfesor].id_usuario.save()
                profesores[posicionProfesor].save()
                
        
        return Response([], status=status.HTTP_200_OK)
    
    @action(detail=True, methods=["post"])
    def reiniciarContrasena(self, request, pk=None):
        profesor = self.get_object()
        contrasenaActualizada = generarContrasena()
        #print(profesor.contrasena)
        profesor.contrasena = contrasenaActualizada
        #print(profesor.id_usuario.password)
        profesor.id_usuario.set_password(contrasenaActualizada)
        profesor.save()
        profesor.id_usuario.save()
        #enviarCorreo("")
        return Response({"mensaje":"¡Correo enviado exitosamente!"})
    
    @action(detail=True, methods=['post'])
    def verificarEstadoSesion(self, request, pk=None):
        token_cliente = request.data["token"]
        profesor = self.get_object()
        if token_cliente!=profesor.token:
            return Response({"message":"¡El token que tiene el cliente no es igual al que tiene el servidor.","estadoSesion":1}, status=status.HTTP_406_NOT_ACCEPTABLE)
        return Response({"message":"Sesion activa","estadoSesion":0}, status=status.HTTP_200_OK)


    @action(detail=False, methods=['get'])
    def autenticarProfesor(self, request, pk=None):
        respuesta = {"id":"","nombre":"","correo":"","token":"","estadoSesion":1} # Campos vacios
        correoFormulario = request.GET["correo"]
        contrasenaFormulario = request.GET["password"]
        if correoFormulario!="" or contrasenaFormulario!="":
            correosBD = [ p.correo for p in Profesor.objects.all()]
            if correoFormulario in correosBD:
                profesor = Profesor.objects.get(correo=correoFormulario)
                if contrasenaFormulario==profesor.contrasena:
                    token = generarToken()
                    respuesta["id"]=profesor.id
                    respuesta["nombre"]=profesor.nombre
                    respuesta["correo"]=profesor.correo
                    respuesta["token"]= token
                    respuesta["estadoSesion"]=0 # Datos correctos
                    profesor.token=token
                    profesor.save()
                    
                else:
                    respuesta["estadoSesion"]=2 #Contraseña incorrecta
        print(respuesta)
        return Response(respuesta, status=status.HTTP_200_OK)

class InscripcionViewSet(viewsets.ModelViewSet):
    queryset = Inscripcion.objects.all()
    serializer_class=InscripcionSerializer
    filter_backends=[filters.SearchFilter] #Se indica que se permitira la filtracion de los datos basado en el dato que se pase mediante el metodo GET    
    search_fields=['clase__nrc','alumno__matricula'] #Se indicaran los campos en los cuales se buscara el valor indicado como parametro al momento de llamar al metodo GET

    @action(detail=False, methods=['post'])
    def activarInscripciones(self, request, pk=None):
        lista_inscripciones = []
        nrc_POST = request.data["nrc"]
        print("T") 
        lista_inscripciones = Inscripcion.objects.filter(clase=nrc_POST)
        for inscripcion in lista_inscripciones:
            inscripcion.estado = "ACTIVA"
            inscripcion.save()
        return Response([],status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'], url_path=r'obtenerInscripcionesPorAlumno/(?P<matricula>[^/.]+)')
    def obtenerInscripcionesPorAlumno(self, request, matricula):
        #print(matricula)
        inscripciones_filtradas = Inscripcion.objects.filter(alumno=matricula, estado="ACTIVA")
        lista_inscripciones_alumno = [self.get_serializer(inscripcion).data for inscripcion in inscripciones_filtradas]
        #print(lista_inscripciones)
        return Response(lista_inscripciones_alumno, status=status.HTTP_200_OK)
        
    
    
class CriterioViewSet(viewsets.ModelViewSet):
    queryset = Criterio.objects.all()
    serializer_class=CriterioSerializer
    filter_backends=[filters.SearchFilter]
    

class ClaseCriterioViewSet(viewsets.ModelViewSet):
    queryset = ClaseCriterio.objects.all()
    serializer_class = ClaseCriterioSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["id_clase__nrc"]

    def destroy(self, request, *args, **kwargs):
        mensajeRespuesta="¡Se ha eliminado el criterio correctamente!"
        statusHTTP = status.HTTP_200_OK
        criterio = self.get_object()
        clase = criterio.id_clase
        lista_criteriosClase = ClaseCriterio.objects.filter(id_clase=clase)
        lista_entregas = Entrega.objects.filter(tipo=criterio.id)
        criteriosClaseActualizados = [ c for c in lista_criteriosClase if c!=criterio]
        print(criteriosClaseActualizados)
        numeroCriteriosClase = len(lista_criteriosClase)
        if numeroCriteriosClase>1:
            criterioTemporal = criteriosClaseActualizados[0]
            for entrega in lista_entregas:
                entrega.tipo = criterioTemporal
                entrega.save()
            criterio.delete()
        else:
            mensajeRespuesta="¡Error al intentar borrar el criterio!, parece que no es posible borrar el criterio debido a que debe existir al menos otro criterio para poder borrarlo."
            statusHTTP = status.HTTP_500_INTERNAL_SERVER_ERROR
            
        return Response({"message":mensajeRespuesta},status=statusHTTP)

class EntregaViewSet(viewsets.ModelViewSet):
    queryset = Entrega.objects.all()  # Utiliza el queryset de Entrega en lugar de Clase2
    serializer_class = EntregaSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['tipo__id']  # Asegúrate de que 'nombre' esté definido en tu modelo Entrega

    def destroy(self, request, *args, **kwargs):
        entrega = self.get_object()
        lista_calificaciones = Calificacion.objects.filter(id_entrega=entrega)
        #print(lista_calificaciones)
        for calificacion in lista_calificaciones:
            calificacion.delete()
        entrega.delete()
        return Response({"message":"¡Se ha eliminado la entrega exitosamente!"})

    @action(detail=False, methods=['get'])
    def getEntregasByNRC(self, request, pk=None):
        lista_entregas = []
        nrc = request.GET['nrc']
        entregas = Entrega.objects.all()
        lista_entregas = [ self.get_serializer(e).data for e in entregas if str(e.tipo.id_clase)==nrc ]

        return Response(lista_entregas,status=status.HTTP_200_OK)
    
    @action(detail=False, methods=["delete"])
    def borrarEntrega(self, request, pk=None):
        print(request.data)
        id_entrega = 0
        return Response([], status=status.HTTP_200_OK)

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
    
## Esto lo hize yo


class AsistenciaPagination(PageNumberPagination):
    page_size = 10  # Número de elementos por página
    page_size_query_param = 'page_size'
    max_page_size = 100  # Límite máximo de elementos por página
    
class AsistenciaViewSet(viewsets.ModelViewSet):
    queryset = Asistencia.objects.all()
    serializer_class = AsistenciaSerializer
    pagination_class = AsistenciaPagination  # Añadir la paginación aquí

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Validar la inscripción
        materia_nrc = serializer.validated_data['materia_nrc']
        matricula = serializer.validated_data['matricula']

        inscripcion = Inscripcion.objects.filter(alumno=matricula, clase=materia_nrc).first()

        if not inscripcion or inscripcion.estado != 'ACTIVA':
            return Response(
                {"detail": f"El alumno con matrícula {matricula} no está inscrito en la clase con NRC {materia_nrc} o no tiene una inscripción activa."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Guardar la asistencia si todo está bien
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def get_queryset(self):
        queryset = Asistencia.objects.all()
        nrc = self.request.query_params.get('materia_nrc', None)
        if nrc is not None:
            queryset = queryset.filter(materia_nrc__nrc=nrc).order_by('-fecha')  
        return queryset
    
    

class EntregasPorTipoView(APIView):
    def get(self, request, nrc):
        # Filtrar las entregas por el nrc específico (a través de la relación ClaseCriterio -> Clase2)
        entregas = Entrega.objects.filter(tipo__id_clase__nrc=nrc)
        
        # Contar el total de entregas por cada tipo
        entregas_por_tipo = entregas.values('tipo__nombre').annotate(total=Count('id'))
        
        # Obtener la fecha de hoy
        today = timezone.now().date()
        
        # Contar las asistencias del día de hoy por el nrc específico
        asistencias_hoy = Asistencia.objects.filter(materia_nrc__nrc=nrc, fecha=today).count()
        
        # Crear la respuesta con los totales por tipo y el conteo de asistencias de hoy
        resultado = {
            'entregas_por_tipo': {
                tipo['tipo__nombre']: tipo['total'] for tipo in entregas_por_tipo
            },
            'asistencias_hoy': asistencias_hoy
        }
        
        return Response(resultado)