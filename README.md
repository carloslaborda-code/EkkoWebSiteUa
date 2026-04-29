# EkkoWebSiteUa

Proyecto de la asignatura **Usabilidad y Accesibilidad** de la Universidad de Alicante.

Ekko es una web mobile-first para descubrir, reproducir, guardar, descargar y publicar fragmentos de **audio** y **vídeo** inspirados en películas, series, videojuegos y efectos sonoros.

## Stack

### Frontend

- Angular
- TypeScript
- RxJS
- CSS por componentes

### Backend

- Node.js
- Express
- MongoDB con Mongoose
- JWT
- bcryptjs

## Estructura

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
└─ README.md
```

## Estado actual

Actualmente el proyecto ya incluye:

- registro e inicio de sesión
- login por email o nombre de usuario
- `Home` pública con tarjetas de contenido reales
- `Detalle` público con reproducción de audio o vídeo
- visualizaciones automáticas por visita al detalle
- valoración por estrellas con media global por publicación
- guardado de publicaciones por usuario
- descarga de contenido solo con sesión iniciada
- `Perfil` con guardados, subidas, contador de descargas y contador de subidas
- `Ajustes` con tamaño de texto funcional
- pantalla de `Publicar` con subida de audio o vídeo
- navegación móvil coherente con el diseño de Figma

## Flujo de acceso

### Sin iniciar sesión

Un usuario invitado puede:

- entrar en `Home`
- abrir `Detalle`
- reproducir contenido
- aumentar visualizaciones al visitar una publicación

Si intenta:

- guardar
- descargar
- valorar
- entrar en perfil
- entrar en ajustes
- abrir publicar

la aplicación lo redirige al login.

### Con sesión iniciada

Un usuario autenticado puede:

- guardar y quitar de guardados
- descargar contenido
- valorar publicaciones con estrellas
- publicar nuevos audios o vídeos
- ver sus subidas en perfil

## Pantallas implementadas

### Home

- lista las publicaciones del backend
- muestra formato, valoración media y visualizaciones
- navegación a detalle

### Detail

- reproduce audio o vídeo
- muestra cita, actor, personaje, año, duración, sinopsis y hashtags
- permite valorar por estrellas
- permite guardar, compartir y descargar
- registra una visualización por visita

### Publish

- permite elegir formato `audio` o `video`
- permite subir archivo
- recoge cita, categoría, título, año, actor, personaje, sinopsis y hashtags
- calcula duración automáticamente
- crea una publicación real en backend
- suma la publicación a `uploads` del usuario

### Profile

- muestra avatar, nombre, estadísticas y guardados
- reconstruye `uploads` a partir de las publicaciones creadas por ese usuario

### Settings

- tamaño de texto pequeño, medio y grande
- alto contraste preparado
- filtros de color preparados

## API actual

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PUT /api/auth/profile`
- `PUT /api/auth/settings`

### Quotes

- `GET /api/quotes`
- `GET /api/quotes/:id`
- `POST /api/quotes`
- `POST /api/quotes/:id/view`
- `POST /api/quotes/:id/save`
- `POST /api/quotes/:id/rate`
- `POST /api/quotes/:id/download`

## Modelos principales

### User

Campos relevantes:

- `username`
- `email`
- `password`
- `avatar`
- `downloads`
- `uploadsCount`
- `uploads`
- `savedQuotes`
- `ratedQuotes`
- `settings`
- `role`

### Quote

Campos relevantes:

- `text`
- `workTitle`
- `year`
- `rating`
- `ratingsCount`
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
- `createdBy`

## Frontend importante

Rutas actuales:

- `/`
- `/home`
- `/quote/:id`
- `/login`
- `/register`
- `/profile`
- `/settings`
- `/publish`

Servicios importantes:

- `auth.service.ts`
- `user.service.ts`
- `quotes.services.ts`
- `accessibility.service.ts`
- `api-url.ts`

## Cómo arrancar el proyecto

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

Opcional para probar desde móvil en la misma red:

```bash
cd frontend
npm run start:mobile
```

## Pendiente o preparado para futuro

- librería funcional completa
- filtros reales por categoría, hashtags y formato
- portada personalizada al publicar
- mejoras visuales finas de detalle y ajustes
- sistema más completo de accesibilidad
- más testing de integración
