# EkkoWebSiteUa

Proyecto desarrollado para la asignatura **Usabilidad y Accesibilidad** de la **Universidad de Alicante**.

El objetivo del proyecto es crear una aplicación web donde los usuarios puedan **buscar, guardar y compartir fragmentos de películas, series o videojuegos** en diferentes formatos (texto, audio o vídeo).

La aplicación está construida siguiendo una arquitectura **frontend + backend + base de datos**.

---

# Tecnologías utilizadas

## Frontend
- Angular
- RxJS
- TailwindCSS

## Backend
- Node.js
- Express
- JWT (autenticación)
- bcryptjs (hash de contraseñas)

## Base de datos
- MongoDB Atlas

---

# Arquitectura del proyecto

EkkoWebSiteUa

frontend → aplicación Angular

backend → API REST Node + Express  
config → conexión a la base de datos  
controllers → lógica de endpoints  
models → esquemas de MongoDB  
routes → definición de rutas  
app.js → configuración de Express  
server.js → arranque del servidor  

.gitignore  
README.md

---

# Base de datos

La base de datos está alojada en **MongoDB Atlas**.

Para el proyecto se creó un **cluster compartido**, configurando:

- usuario de base de datos
- permisos de lectura y escritura
- acceso desde cualquier IP (`0.0.0.0/0`) para desarrollo

La conexión se realiza mediante **variables de entorno**.

Ejemplo de archivo `.env`:

PORT=5000  
MONGO_URI=your_mongodb_connection_string  
JWT_SECRET=your_secret  

Este archivo **no se sube al repositorio** por seguridad.

En su lugar se proporciona un archivo:

.env.example

que cada desarrollador debe copiar para crear su propio `.env`.

---

# Configuración del proyecto

## 1. Clonar el repositorio

git clone https://github.com/usuario/EkkoWebSiteUa.git  
cd EkkoWebSiteUa  

---

# Backend

## Instalación

cd backend  
npm install  

## Configuración

Crear archivo `.env` copiando el ejemplo:

cp .env.example .env  

Editar `.env` y añadir la URI del cluster de MongoDB Atlas.

Ejemplo:

PORT=5000  
MONGO_URI=mongodb://usuario:password@cluster.mongodb.net/ekkoDB  
JWT_SECRET=supersecret

## Ejecutar el servidor

npm start  

El servidor se ejecutará en:

http://localhost:5000  

---

# Frontend

## Instalación

cd frontend  
npm install  

## Ejecutar aplicación

npm start  

La aplicación Angular se ejecutará en:

http://localhost:4200  

---

# Endpoints disponibles

## Registro de usuario

POST /api/auth/register  

Body de ejemplo:

{
"username": "usuario",
"email": "usuario@email.com",
"password": "123456"
}

---

## Login

POST /api/auth/login  

Body de ejemplo:

{
"email": "usuario@email.com",
"password": "123456"
}

La respuesta devuelve:

- token JWT
- información del usuario

---

# Modelo de datos actual

User

username  
email  
password  
avatar  
role  

Las contraseñas se almacenan **encriptadas con bcrypt**.

---

# Estado actual del proyecto

Actualmente el proyecto tiene implementado:

- conexión del backend con MongoDB Atlas  
- registro de usuarios  
- login con autenticación JWT  
- conexión Angular → backend  
- creación automática de la colección **users**  

Durante las pruebas se crearon **usuarios de prueba** para verificar el funcionamiento del sistema.

---

# Próximas funcionalidades

- autenticación persistente en Angular  
- gestión de perfiles  
- creación de citas (quotes)  
- sistema de favoritos  
- buscador de contenido multimedia  

---

# Dependencias principales

## Backend

express  
mongoose  
bcryptjs  
jsonwebtoken  
cors  
dotenv  
nodemon  

## Frontend

Angular  
RxJS  
TailwindCSS  

---
