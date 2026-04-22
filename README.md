# PROYECTO EKKO

## 1. Resumen del proyecto

**Ekko** es una aplicación web desarrollada para la asignatura de **Usabilidad y Accesibilidad** de la Universidad de Alicante.

La idea principal de la aplicación es permitir a los usuarios:

- buscar fragmentos de películas, series o videojuegos
- visualizar publicaciones en formato **vídeo** o **audio**
- reproducir el contenido desde una pantalla de detalle
- descargar contenido si han iniciado sesión
- guardar publicaciones para revisarlas después desde su perfil
- gestionar ajustes de accesibilidad

El diseño visual sigue las pantallas definidas en Figma y las referencias PNG del proyecto. La app está planteada con enfoque **mobile-first**, es decir, diseñada principalmente para **teléfono móvil**.

---

## 2. Arquitectura general

El proyecto está dividido en dos partes:

- `frontend/`: aplicación Angular
- `backend/`: API REST con Node.js, Express y MongoDB

### Tecnologías principales

**Frontend**

- Angular
- TypeScript
- RxJS
- CSS por componentes

**Backend**

- Node.js
- Express
- MongoDB + Mongoose
- JWT para autenticación
- bcryptjs para hash de contraseñas

---

## 3. Estructura del repositorio

```text
EkkoWebSiteUa/
├─ backend/
│  └─ src/
│     ├─ config/
│     ├─ controllers/
│     ├─ data/
│     ├─ middleware/
│     ├─ models/
│     ├─ routes/
│     ├─ app.js
│     └─ server.js
├─ frontend/
│  └─ src/
│     ├─ app/
│     │  ├─ pages/
│     │  ├─ services/
│     │  ├─ app-routing.module.ts
│     │  └─ app.module.ts
│     ├─ assets/
│     └─ styles.css
├─ README.md
└─ package.json
```

---

## 4. Estado actual del desarrollo

Actualmente el proyecto ya incluye:

- registro de usuarios
- login con JWT
- navegación entre pantallas principales
- `Home` conectada a publicaciones reales del backend
- `Detalle` de publicación para audio o vídeo
- guardado de publicaciones por usuario
- conteo real de descargas del usuario
- sincronización correcta de guardados sin duplicados
- `Perfil` con datos del usuario y elementos guardados
- `Ajustes` de accesibilidad
- tamaño de texto funcional en toda la app
- diseño adaptado a móvil
- flujo mixto de invitado y usuario autenticado

---

## 5. Frontend implementado

### 5.1 Rutas actuales

Archivo: [frontend/src/app/app-routing.module.ts](C:/Users/carl0/Desktop/Ua/3º/2ºCuatri/UA/EkkoWebSiteUa/frontend/src/app/app-routing.module.ts:1)

Rutas disponibles:

- `/` y `/home` -> Home
- `/quote/:id` -> Detalle de publicación
- `/login` -> Inicio de sesión
- `/register` -> Registro
- `/profile` -> Perfil de usuario
- `/settings` -> Ajustes

### 5.2 Páginas implementadas

#### Home

Archivos:

- [frontend/src/app/pages/home/home.component.ts](C:/Users/carl0/Desktop/Ua/3º/2ºCuatri/UA/EkkoWebSiteUa/frontend/src/app/pages/home/home.component.ts:1)
- [frontend/src/app/pages/home/home.component.html](C:/Users/carl0/Desktop/Ua/3º/2ºCuatri/UA/EkkoWebSiteUa/frontend/src/app/pages/home/home.component.html:1)
- [frontend/src/app/pages/home/home.component.css](C:/Users/carl0/Desktop/Ua/3º/2ºCuatri/UA/EkkoWebSiteUa/frontend/src/app/pages/home/home.component.css:1)

Funcionalidad actual:

- carga publicaciones desde el backend
- muestra tarjetas con imagen o placeholder según el tipo de contenido
- permite navegar al detalle de cada publicación
- usa diseño móvil basado en Figma
- incluye navegación inferior
- está disponible tanto para invitados como para usuarios autenticados
- si un invitado intenta entrar al perfil desde la navegación, se le redirige al login

#### Login

Archivos:

- [frontend/src/app/pages/login/login.component.ts](C:/Users/carl0/Desktop/Ua/3º/2ºCuatri/UA/EkkoWebSiteUa/frontend/src/app/pages/login/login.component.ts:1)
- [frontend/src/app/pages/login/login.component.html](C:/Users/carl0/Desktop/Ua/3º/2ºCuatri/UA/EkkoWebSiteUa/frontend/src/app/pages/login/login.component.html:1)

Funcionalidad actual:

- login por email o nombre de usuario
- muestra errores de credenciales
- guarda token y usuario en `localStorage`
- redirige a `Home` al iniciar sesión

#### Register

Archivos:

- [frontend/src/app/pages/register/register.component.ts](C:/Users/carl0/Desktop/Ua/3º/2ºCuatri/UA/EkkoWebSiteUa/frontend/src/app/pages/register/register.component.ts:1)
- [frontend/src/app/pages/register/register.component.html](C:/Users/carl0/Desktop/Ua/3º/2ºCuatri/UA/EkkoWebSiteUa/frontend/src/app/pages/register/register.component.html:1)

Funcionalidad actual:

- registro de usuario nuevo
- comunicación directa con el backend

#### Detail

Archivos:

- [frontend/src/app/pages/detail/detail.component.ts](C:/Users/carl0/Desktop/Ua/3º/2ºCuatri/UA/EkkoWebSiteUa/frontend/src/app/pages/detail/detail.component.ts:1)
- [frontend/src/app/pages/detail/detail.component.html](C:/Users/carl0/Desktop/Ua/3º/2ºCuatri/UA/EkkoWebSiteUa/frontend/src/app/pages/detail/detail.component.html:1)
- [frontend/src/app/pages/detail/detail.component.css](C:/Users/carl0/Desktop/Ua/3º/2ºCuatri/UA/EkkoWebSiteUa/frontend/src/app/pages/detail/detail.component.css:1)

Es una de las pantallas más importantes del proyecto.

Funcionalidad actual:

- carga una publicación concreta por `id`
- si la publicación es de vídeo, permite reproducir vídeo
- si la publicación es de audio, permite reproducir audio
- muestra actor, personaje, duración, año, sinopsis y hashtags
- muestra la duración real del archivo cuando los metadatos están disponibles
- la reproducción está disponible sin necesidad de login
- si un invitado intenta guardar o descargar, se le redirige al login
- si el usuario está autenticado, puede guardar o quitar de guardados

#### Profile

Archivos:

- [frontend/src/app/pages/profile/profile.component.ts](C:/Users/carl0/Desktop/Ua/3º/2ºCuatri/UA/EkkoWebSiteUa/frontend/src/app/pages/profile/profile.component.ts:1)
- [frontend/src/app/pages/profile/profile.component.html](C:/Users/carl0/Desktop/Ua/3º/2ºCuatri/UA/EkkoWebSiteUa/frontend/src/app/pages/profile/profile.component.html:1)
- [frontend/src/app/pages/profile/profile.component.css](C:/Users/carl0/Desktop/Ua/3º/2ºCuatri/UA/EkkoWebSiteUa/frontend/src/app/pages/profile/profile.component.css:1)

Funcionalidad actual:

- muestra datos del usuario autenticado
- muestra contador de subidas y descargas
- muestra guardados del usuario
- muestra estado vacío si aún no hay subidas
- enlaza a ajustes
- si se intenta acceder sin sesión, redirige al login

Nota importante:

- el contador de descargas ahora es **real**
- el contador de subidas está preparado pero actualmente será `0` mientras no exista la funcionalidad de publicar contenido

#### Settings

Archivos:

- [frontend/src/app/pages/settings/settings.component.ts](C:/Users/carl0/Desktop/Ua/3º/2ºCuatri/UA/EkkoWebSiteUa/frontend/src/app/pages/settings/settings.component.ts:1)
- [frontend/src/app/pages/settings/settings.component.html](C:/Users/carl0/Desktop/Ua/3º/2ºCuatri/UA/EkkoWebSiteUa/frontend/src/app/pages/settings/settings.component.html:1)
- [frontend/src/app/pages/settings/settings.component.css](C:/Users/carl0/Desktop/Ua/3º/2ºCuatri/UA/EkkoWebSiteUa/frontend/src/app/pages/settings/settings.component.css:1)

Funcionalidad actual:

- cambio de tamaño de texto
- guardado de preferencias del usuario
- opción de alto contraste preparada
- opción de filtros de color preparada
- logout
- si se intenta acceder sin sesión, redirige al login

### 5.3 Servicios del frontend

#### AuthService

Archivo: [frontend/src/app/services/auth.service.ts](C:/Users/carl0/Desktop/Ua/3º/2ºCuatri/UA/EkkoWebSiteUa/frontend/src/app/services/auth.service.ts:1)

Responsabilidad:

- login
- registro
- comunicación con `/api/auth`

#### UserService

Archivo: [frontend/src/app/services/user.service.ts](C:/Users/carl0/Desktop/Ua/3º/2ºCuatri/UA/EkkoWebSiteUa/frontend/src/app/services/user.service.ts:1)

Responsabilidad:

- obtener usuario actual
- actualizar perfil
- actualizar ajustes
- persistir datos del usuario en `localStorage`
- sincronizar guardados del usuario tras guardar o desguardar publicaciones

#### QuoteService

Archivo: [frontend/src/app/services/quotes.services.ts](C:/Users/carl0/Desktop/Ua/3º/2ºCuatri/UA/EkkoWebSiteUa/frontend/src/app/services/quotes.services.ts:1)

Responsabilidad:

- obtener todas las publicaciones
- obtener publicación por `id`
- guardar o quitar de guardados
- registrar descargas

#### AccessibilityService

Archivo: [frontend/src/app/services/accessibility.service.ts](C:/Users/carl0/Desktop/Ua/3º/2ºCuatri/UA/EkkoWebSiteUa/frontend/src/app/services/accessibility.service.ts:1)

Responsabilidad:

- aplicar el tamaño de texto global
- recuperar ajustes guardados
- sincronizar accesibilidad con `localStorage`

### 5.4 Diseño responsive

El frontend se ha ido adaptando con enfoque **solo móvil**.

Objetivo de este ajuste:

- que la interfaz use el ancho real del teléfono
- evitar marcos o espacios vacíos tipo maqueta de escritorio
- mantener barra inferior y espaciados consistentes

Se han ajustado especialmente:

- `Home`
- `Profile`
- `Settings`
- `Detail`
- estilos globales en [frontend/src/styles.css](C:/Users/carl0/Desktop/Ua/3º/2ºCuatri/UA/EkkoWebSiteUa/frontend/src/styles.css:1)

---

## 6. Backend implementado

### 6.1 Servidor y app

Archivos:

- [backend/src/server.js](C:/Users/carl0/Desktop/Ua/3º/2ºCuatri/UA/EkkoWebSiteUa/backend/src/server.js:1)
- [backend/src/app.js](C:/Users/carl0/Desktop/Ua/3º/2ºCuatri/UA/EkkoWebSiteUa/backend/src/app.js:1)

Funcionalidad:

- carga variables de entorno
- conecta con MongoDB
- arranca Express
- activa CORS
- parsea JSON
- registra rutas `/api/auth` y `/api/quotes`

### 6.2 Modelos

#### User

Archivo: [backend/src/models/user.js](C:/Users/carl0/Desktop/Ua/3º/2ºCuatri/UA/EkkoWebSiteUa/backend/src/models/user.js:1)

Campos relevantes:

- `username`
- `email`
- `password`
- `avatar`
- `downloads`
- `uploadsCount`
- `uploads`
- `savedQuotes`
- `settings`
- `role`

`settings` incluye:

- `colorFilter`
- `highContrast`
- `textSize`

#### Quote

Archivo: [backend/src/models/quote.js](C:/Users/carl0/Desktop/Ua/3º/2ºCuatri/UA/EkkoWebSiteUa/backend/src/models/quote.js:1)

Campos relevantes:

- `text`
- `workTitle`
- `year`
- `rating`
- `views`
- `image`
- `mediaType`
- `mediaUrl`
- `duration`
- `actorName`
- `characterName`
- `synopsis`
- `hashtags`
- `category`

Esto permite que una publicación soporte tanto **audio** como **vídeo**.

### 6.3 Controladores y rutas

#### Auth

Archivos:

- [backend/src/controllers/auth.controller.js](C:/Users/carl0/Desktop/Ua/3º/2ºCuatri/UA/EkkoWebSiteUa/backend/src/controllers/auth.controller.js:1)
- [backend/src/routes/auth.routes.js](C:/Users/carl0/Desktop/Ua/3º/2ºCuatri/UA/EkkoWebSiteUa/backend/src/routes/auth.routes.js:1)

Endpoints actuales:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PUT /api/auth/profile`
- `PUT /api/auth/settings`

Funcionalidad implementada:

- registro de usuario
- login con JWT
- login por email o username
- carga del perfil autenticado
- actualización de perfil
- actualización de ajustes
- normalización de datos antiguos del usuario

Importante:

- se corrigieron contadores falsos que antes venían de valores mock
- ahora las descargas se contabilizan de forma real

#### Quotes

Archivos:

- [backend/src/controllers/quote.controller.js](C:/Users/carl0/Desktop/Ua/3º/2ºCuatri/UA/EkkoWebSiteUa/backend/src/controllers/quote.controller.js:1)
- [backend/src/routes/quote.routes.js](C:/Users/carl0/Desktop/Ua/3º/2ºCuatri/UA/EkkoWebSiteUa/backend/src/routes/quote.routes.js:1)

Endpoints actuales:

- `GET /api/quotes`
- `GET /api/quotes/:id`
- `POST /api/quotes`
- `POST /api/quotes/:id/save`
- `POST /api/quotes/:id/download`

Funcionalidad implementada:

- listar publicaciones
- ver detalle de una publicación
- crear publicaciones desde backend
- guardar y desguardar publicaciones
- registrar descargas del usuario autenticado
- normalizar guardados para evitar duplicados en `savedQuotes`

### 6.4 Middleware

Archivo: [backend/src/middleware/auth.middleware.js](C:/Users/carl0/Desktop/Ua/3º/2ºCuatri/UA/EkkoWebSiteUa/backend/src/middleware/auth.middleware.js:1)

Responsabilidad:

- validar token JWT
- proteger rutas privadas

### 6.5 Datos auxiliares

Archivos:

- [backend/src/data/defaultUserData.js](C:/Users/carl0/Desktop/Ua/3º/2ºCuatri/UA/EkkoWebSiteUa/backend/src/data/defaultUserData.js:1)
- [backend/src/data/seedQuotes.js](C:/Users/carl0/Desktop/Ua/3º/2ºCuatri/UA/EkkoWebSiteUa/backend/src/data/seedQuotes.js:1)

Uso:

- `defaultUserData.js` define valores por defecto del usuario
- `seedQuotes.js` contiene publicaciones iniciales para poblar la aplicación

---

## 7. Flujo de autenticación

### Registro

1. El usuario completa nombre, email y contraseña.
2. Angular envía la petición a `POST /api/auth/register`.
3. El backend valida y guarda el usuario con contraseña encriptada.

### Login

1. El usuario introduce email o username y contraseña.
2. Angular llama a `POST /api/auth/login`.
3. El backend valida las credenciales.
4. Si son correctas, devuelve:
   - token JWT
   - datos del usuario
5. El frontend guarda esta información en `localStorage`.
6. El usuario es redirigido a `Home`.

### Sesión

Las rutas protegidas usan el token almacenado para:

- cargar perfil
- guardar publicaciones
- registrar descargas
- actualizar ajustes

### Flujo de invitado

La aplicación permite una experiencia parcial sin autenticación:

- un invitado puede entrar en `Home`
- un invitado puede abrir `Detalle`
- un invitado puede reproducir audio o vídeo

Las siguientes acciones requieren login:

- guardar publicaciones
- descargar contenido
- acceder a `Perfil`
- acceder a `Ajustes`

Si un invitado intenta realizar alguna de esas acciones, la app lo redirige al login.

---

## 8. Flujo de publicaciones

### Home

- obtiene todas las publicaciones desde `GET /api/quotes`
- pinta tarjetas visuales
- distingue entre contenido de audio y vídeo

### Detail

- recibe el `id` de la publicación desde la URL
- consulta `GET /api/quotes/:id`
- renderiza media y metadatos

### Guardado

- el usuario autenticado pulsa guardar
- Angular llama a `POST /api/quotes/:id/save`
- el backend añade o elimina la publicación de `savedQuotes`
- el frontend sincroniza el estado local del usuario para evitar contadores desfasados

### Descarga

- el usuario autenticado pulsa descargar
- Angular llama a `POST /api/quotes/:id/download`
- el backend incrementa el contador `downloads`

---

## 9. Accesibilidad implementada

Se ha trabajado especialmente la parte de accesibilidad por ser una asignatura centrada en ello.

Actualmente está implementado:

- ajuste real del tamaño de texto
- persistencia de esa preferencia
- estructura preparada para alto contraste
- estructura preparada para filtros de color

El tamaño de texto se aplica a nivel global usando el `documentElement`.

---

## 10. Assets y recursos multimedia

Actualmente el proyecto usa recursos visuales y multimedia cargados en `frontend/src/assets/`.

Ejemplos:

- logo de Ekko
- placeholder para audio
- vídeo de prueba de Scarface

Estos assets se usan sobre todo en:

- `Home`
- `Detail`
- `Profile`

---

## 11. Cambios importantes realizados hasta ahora

Resumen de hitos ya implementados:

- maquetación inicial de login y registro
- corrección del arranque del backend
- corrección del login para aceptar email o username
- redirección correcta a `Home` tras login
- implementación de `Home`
- incorporación del logo real de Ekko
- adaptación del diseño a móvil real
- implementación de `Profile`
- implementación de `Settings`
- activación real del tamaño de texto
- implementación de `Detail`
- soporte para publicaciones de audio y vídeo
- guardado de publicaciones por usuario
- descargas registradas por usuario
- corrección de contadores mock en perfil
- corrección del flujo de guardado para evitar duplicados
- apertura pública de `Home` y `Detalle` sin login
- redirección al login para acciones privadas

---

## 12. Qué queda pendiente o preparado para futuro

Estas partes aún pueden desarrollarse más:

- pantalla de `Publicar`
- subida real de contenido por usuario
- contador real de `uploads` en función de publicaciones creadas por cada usuario
- sistema de filtros por hashtags y categorías
- filtro por audio/vídeo
- funcionalidad completa de `Librería`
- edición real de avatar y perfil
- mejoras visuales finales para igualar aún más Figma
- validaciones extra y tests más amplios

---

## 13. Cómo arrancar el proyecto

### Backend

```bash
cd backend
npm install
npm start
```

### Frontend

```bash
cd frontend
npm install
npm start
```

Por defecto:

- backend en `http://localhost:5000`
- frontend en `http://localhost:4200`

---

## 14. Recomendaciones para el equipo

Para que el trabajo en grupo sea más claro:

- revisar este archivo antes de tocar una parte nueva
- comprobar primero si la funcionalidad ya existe en frontend, backend o ambos
- mantener coherencia con el diseño móvil del proyecto
- evitar reintroducir datos mock en producción
- documentar aquí cualquier cambio grande que afecte a estructura, rutas o flujo de datos

---

## 15. Archivo de referencia para el equipo

Este documento está pensado como guía de trabajo compartida. Si alguien del equipo necesita entender rápidamente el proyecto, debería empezar por:

1. este archivo
2. las rutas del frontend
3. los controladores del backend

De esta forma todos los integrantes pueden saber:

- qué está implementado
- qué archivos tocar según cada funcionalidad
- cómo se comunican frontend y backend
- qué partes siguen pendientes
