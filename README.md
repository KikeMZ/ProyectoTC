## 🚀 Instalación y ejecución del proyecto

Este proyecto cuenta con dos partes principales:

- **Frontend:** desarrollado en React.js
- **Backend:** desarrollado en Django (Python)

### 🔧 Requisitos previos

- Node.js (v20 o superior)
- Python 3.10+
- pip (gestor de paquetes de Python)
- Git

---

### 📦 Clonar el proyecto

```bash
git clone https://github.com/KikeMZ/ProyectoTC.git

cd ProyectoPracticas
```

Carpeta clonada:

![imagen](https://github.com/user-attachments/assets/4149d012-44d2-4e36-b7a6-1ee128386119)
###### Se encuentra tanto el frontend (client) como el backend (carpeta base)

##

### ⚛️ Configuración del frontend (React)

```bash
cd ProyectoPracticas/client

npm install

npm run dev
```

![imagen](https://github.com/user-attachments/assets/627dcd84-54c6-4126-990a-cd6d06d11d06)
###### Ejecución del frontend

##

### 🐍 Instalación del backend (Django)

1. Configuración e instalación de librerías
   
```bash
cd ProyectoPracticas

python -m venv env

# Activación del entorno virtual
source env/bin/activate  # En Windows: env\Scripts\activate

```

![imagen](https://github.com/user-attachments/assets/c0af97d8-f147-46d7-9828-e06b6d61cdeb)
###### Entorno virtual activado

Se instalan las librerías requeridas:

```bash
pip install -r requirements.txt
```


2. Aplicación de migraciones e iniciar servidor

```bash
python manage.py migrate

python manage.py runserver
```

![imagen](https://github.com/user-attachments/assets/56d2769f-dc17-47e2-9523-1d23edcd63f0)
###### Backend ejecutandose


## ¡Ya estás ejecutando el proyecto!

#### Ábrelo -> http://localhost:5173
