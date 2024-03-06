from django.db import models

# Create your models here.

class Programmer(models.Model):
    fullname = models.CharField(max_length=100)
    nickname = models.CharField(max_length=50)
    age = models.PositiveSmallIntegerField()
    is_active = models.BooleanField(default=True)


class Alumno(models.Model):
    matricula=models.PositiveBigIntegerField()
    nombre=models.CharField(max_length=100)
    apellidos=models.CharField(max_length=100)
    correo=models.CharField(max_length=100)

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

class Calificacion(models.Model):
    id_entrega=models.PositiveBigIntegerField()
    nota=models.FloatField()


class Entrega(models.Model):
    id_entrega=models.BigIntegerField
    nombre=models.CharField(max_length=100)
    tipo=models.CharField(max_length=20)


class Criterio(models.Model):
    nombre=models.CharField(max_length=100)
    ponderacion=models.IntegerField()


class Clase2(models.Model):
    nrc=models.BigIntegerField()
    clave=models.CharField(max_length=10)
    seccion=models.CharField(max_length=4)
    nombreMateria=models.CharField(max_length=250)
    nombreProfesor=models.CharField(max_length=250)
