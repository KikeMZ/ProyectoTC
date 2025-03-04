#!/bin/sh

# Ejecutar migraciones
python manage.py migrate

# Iniciar el servidor de desarrollo de Django
python manage.py runserver 0.0.0.0:8000
