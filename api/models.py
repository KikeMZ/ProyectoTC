from django.db import models

# Create your models here.

class Programmer(models.Model):
    fullname = models.CharField(max_length=100)
    nickname = models.CharField(max_length=50)
    age = models.PositiveSmallIntegerField()
    is_active = models.BooleanField(default=True)


class Alumno(models.Model):
    matricula=models.PositiveBigIntegerField(primary_key=True)
    nombre=models.CharField(max_length=100)
    apellidos=models.CharField(max_length=100)
    correo=models.CharField(max_length=100)

    def __str__(self):
        return str(self.matricula )

class Materia(models.Model):
    clave=models.CharField(max_length=20)
    nombre=models.CharField(max_length=100)

class Clase(models.Model):
    seccion=models.CharField(max_length=100)


class Profesor(models.Model):
    id_profesor=models.PositiveBigIntegerField()
    nombre=models.CharField(max_length=250)

    def __str__(self):
        return self.nombre


class Clase2(models.Model):
    nrc=models.BigIntegerField(primary_key=True)
    clave=models.CharField(max_length=10)
    seccion=models.CharField(max_length=4)
    nombreMateria=models.CharField(max_length=250)
    nombreProfesor=models.CharField(max_length=250)

    def __str__(self):
        return str(self.nrc)

class Inscripcion(models.Model):
    clase = models.ForeignKey(Clase2, on_delete=models.SET_NULL, null=True)
    alumno = models.ForeignKey(Alumno, on_delete=models.SET_NULL, null=True)

class Criterio(models.Model):
    id_criterio = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=250)

    def __str__(self):
        return str(self.id_criterio)

class ClaseCriterio(models.Model):
    id_clase = models.ForeignKey(Clase2, on_delete=models.DO_NOTHING, default=0)
    id_criterio = models.ForeignKey(Criterio, on_delete=models.DO_NOTHING, default=0)
    ponderacion = models.FloatField()

class Entrega(models.Model):
    nombre = models.CharField(max_length=250)
    tipo = models.ForeignKey(ClaseCriterio, on_delete=models.DO_NOTHING, default=1)  # Aquí estableces el valor predeterminado

class Calificacion(models.Model):
    nota=models.FloatField()
    matricula = models.ForeignKey(Alumno, on_delete=models.DO_NOTHING, default=0)
    id_entrega = models.ForeignKey(Entrega, on_delete=models.DO_NOTHING, default=0)
    

