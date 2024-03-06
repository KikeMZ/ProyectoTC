from django.contrib import admin
from .models import Programmer, Profesor, Alumno, Materia, Clase, Calificacion, Clase2, Criterio, Entrega
# Register your models here.

modelos= [Programmer,Profesor, Alumno, Materia, Clase, Calificacion, Clase2, Criterio, Entrega]

for modelo in modelos:
    admin.site.register(modelo)
