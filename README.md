## 🚀 Instalación y ejecución del proyecto

Este proyecto cuenta con dos partes principales:

- **Frontend:** desarrollado en React.js
- **Backend:** desarrollado en Django (Python)

### 🔧 Requisitos previos

- Node.js (v18 o superior)
- Python 3.10+
- pip (gestor de paquetes de Python)
- Git

---

### 📦 Clonar el proyecto

```bash
git clone https://github.com/KikeMZ/ProyectoTC.git

cd ProyectoTC
```

### ⚛️ Configuración del frontend (React)

```bash
cd ProyectoTC/client

npm install

npm run dev
```


### 🐍 Instalación del backend (Django)

1. Configuración e instalación de librerías
   
```bash
cd ..

python -m venv env
source env/bin/activate  # En Windows: env\Scripts\activate

pip install -r requirements.txt
```

2. Aplicación de migraciones e iniciar servidor

```bash
python manage.py migrate
python manage.py runserver
```



## ¡Ya estás ejecutando el proyecto!

#### Ábrelo -> http://localhost:5173
