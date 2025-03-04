from django.urls import path, include
from rest_framework import routers 
from rest_framework.documentation import include_docs_urls 
from api import views
from rest_framework_simplejwt.views import (TokenObtainPairView,TokenRefreshView)
from .views import EntregasPorTipoView
from .views import (
    AsistenciaPorClaseView, AsistenciaDiariaView, DistribucionCalificacionesView,
    PromedioCalificacionesView, EstadoInscripcionesView, ProgresoEntregasView,
    ClasesPorProfesorView
)


router=routers.DefaultRouter()
#router2=routers.DefaultRouter()
router.register(r'programmmers',views.ProgrammerViewSet)
router.register(r'Alumno',views.AlumnoViewSet)
router.register(r'Periodo',views.PeriodoViewSet,'Periodo')
router.register(r'Clase2',views.Clase2ViewSet)
router.register(r'Profesor',views.ProfesorViewSet,'Profesor')
router.register(r'Inscripcion',views.InscripcionViewSet,'Inscripcion')
router.register(r'Criterio',views.CriterioViewSet,'Criterio')
router.register(r'ClaseCriterio',views.ClaseCriterioViewSet,'ClaseCriterio')
router.register(r'Entrega',views.EntregaViewSet,'Entrega')
router.register(r'Calificacion', views.CalificacionViewSet,'Calificacion')
router.register(r'User', views.UserViewSet,'User')
router.register(r'Asistencia', views.AsistenciaViewSet, 'Asistencia')



urlpatterns =[
    path('',include(router.urls)),
    path('entregas/tipos/<str:nrc>/', EntregasPorTipoView.as_view(), name='entregas-por-tipo'),
    path('api/asistencia_por_clase/<int:nrc>/', AsistenciaPorClaseView.as_view(), name='asistencia_por_clase'),
    path('api/asistencia_diaria/<int:nrc>/', AsistenciaDiariaView.as_view(), name='asistencia_diaria'),
    path('api/distribucion_calificaciones/<int:nrc>/', DistribucionCalificacionesView.as_view(), name='distribucion_calificaciones'),
    path('api/promedio_calificaciones/<int:nrc>/', PromedioCalificacionesView.as_view(), name='promedio_calificaciones'),
    path('api/estado_inscripciones/<int:nrc>/', EstadoInscripcionesView.as_view(), name='estado_inscripciones'),
    path('api/progreso_entregas/<int:nrc>/', ProgresoEntregasView.as_view(), name='progreso_entregas'),
    path('api/clases_por_profesor/', ClasesPorProfesorView.as_view(), name='clases_por_profesor'),
    path('token/', views.CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path('token/refresh/', TokenRefreshView.as_view(), name="token_refresh"),
    path('docs/',include_docs_urls(title="API"))
    
]







