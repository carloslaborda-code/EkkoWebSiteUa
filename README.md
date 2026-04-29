# EkkoWebSiteUa

Proyecto de la asignatura **Usabilidad y Accesibilidad** de la Universidad de Alicante.

Ekko es una aplicacion web **mobile-first** para descubrir, reproducir, valorar, guardar, descargar y publicar fragmentos de **audio** y **video** inspirados en peliculas, series, videojuegos y efectos sonoros. El proyecto sigue como referencia visual el diseno definido en Figma y esta orientado a uso en telefono movil.

## Stack

### Frontend

- Angular 16
- TypeScript
- RxJS
- Tailwind CSS para parte de la interfaz y los iconos
- CSS por componentes

### Backend

- Node.js
- Express
- MongoDB Atlas con Mongoose
- JWT para autenticacion
- bcryptjs para hash de contrasenas

## Estructura general

```text
EkkoWebSiteUa/
|-- backend/
|   |-- src/
|   |   |-- config/
|   |   |-- controllers/
|   |   |-- data/
|   |   |-- middleware/
|   |   |-- models/
|   |   |-- routes/
|   |   |-- app.js
|   |   `-- server.js
|   `-- package.json
|-- frontend/
|   |-- src/
|   |   |-- app/
|   |   |   |-- components/
|   |   |   |-- pages/
|   |   |   |-- services/
|   |   |   |-- app-routing.module.ts
|   |   |   `-- app.module.ts
|   |   |-- assets/
|   |   |-- index.html
|   |   `-- styles.css
|   `-- package.json
`-- README.md
```

## Estado actual del proyecto

Actualmente el proyecto incluye:

- registro de usuarios
- inicio de sesion con correo o nombre de usuario
- `Home` publica
- `Detalle` publico con reproduccion de audio o video
- reproduccion sin necesidad de iniciar sesion
- contador de visualizaciones por visita al detalle
- valoracion por estrellas con media global
- guardado de publicaciones por usuario
- descarga de contenido solo con sesion iniciada
- `Perfil` con avatar, edicion de foto, estadisticas, guardados y subidas
- `Ajustes` con tamano de texto funcional y base para accesibilidad
- pantalla de `Publicar` para subir audio o video
- barra de navegacion comun reutilizable
- iconos comunes reutilizables en varias pantallas
- interfaz traducida al castellano en las vistas principales

## Flujo de acceso

### Usuario invitado

Sin iniciar sesion se puede:

- entrar en `Home`
- abrir una publicacion en `Detalle`
- reproducir audio o video
- aumentar las visualizaciones al visitar una publicacion

Si el usuario intenta:

- guardar
- descargar
- valorar
- entrar en `Perfil`
- entrar en `Ajustes`
- abrir `Publicar`

la aplicacion lo redirige a `Login`.

### Usuario autenticado

Con sesion iniciada se puede:

- guardar y eliminar de guardados
- descargar contenido
- valorar publicaciones con estrellas
- publicar nuevos fragmentos
- ver subidas propias en `Perfil`
- editar la foto de perfil
- modificar ajustes de accesibilidad

## Pantallas implementadas

### Home

- carga publicaciones reales desde backend
- muestra portada o placeholder segun sea video o audio
- muestra formato, valoracion media y visualizaciones
- incluye buscador
- permite navegar al detalle de cada publicacion

### Detail

- reproduce audio o video
- muestra cita, actor, personaje, titulo, ano, duracion, sinopsis y hashtags
- permite valorar por estrellas
- permite guardar
- permite compartir
- permite descargar si el usuario esta autenticado
- registra una visualizacion por visita

### Publish

- permite elegir `audio` o `video`
- permite subir un archivo local
- recoge cita, categoria, titulo, ano, actor, personaje, sinopsis y etiquetas
- calcula la duracion del archivo automaticamente
- crea una publicacion real en backend
- actualiza las subidas del usuario

### Profile

- muestra avatar y nombre de usuario
- permite cambiar la foto de perfil
- muestra contador real de subidas
- muestra contador real de descargas
- muestra `Mis Subidas`
- muestra `Guardados`

### Settings

- control de tamano de texto
- alto contraste preparado
- filtros de color preparados
- cierre de sesion

### Login y Register

- formularios conectados con backend
- redireccion a `Home` tras login correcto
- validaciones basicas y mensajes de error

## Componentes compartidos

### Navbar

Barra inferior comun para las paginas principales. Mantiene una navegacion consistente en movil y controla accesos a `Publicar` y `Perfil`.

### Icon

Componente reutilizable para iconos SVG. Se usa para unificar el estilo visual de acciones y navegacion.

## Backend

## API disponible

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

## Logica importante ya implementada

- sembrado automatico de publicaciones iniciales si la coleccion esta vacia
- sincronizacion real de `uploads` del usuario a partir de las publicaciones creadas
- sincronizacion de guardados para evitar duplicados
- sincronizacion de valoraciones por usuario
- incremento de descargas en perfil
- incremento de visualizaciones en detalle
- valoracion media acumulada por publicacion
- soporte para avatar en base64
- aumento del limite de `express.json()` para soportar subida de foto de perfil

## Frontend importante

### Rutas actuales

- `/`
- `/home`
- `/quote/:id`
- `/login`
- `/register`
- `/profile`
- `/settings`
- `/publish`

### Servicios importantes

- `auth.service.ts`
- `user.service.ts`
- `quotes.services.ts`
- `accessibility.service.ts`
- `api-url.ts`

### Paginas principales

- `pages/home`
- `pages/detail`
- `pages/publish`
- `pages/profile`
- `pages/settings`
- `pages/login`
- `pages/register`

## Accesibilidad y responsive

- enfoque mobile-first real
- uso de `100dvh`, `safe-area-inset-*` y espaciados fluidos
- tamano de texto persistente por usuario
- base preparada para alto contraste
- base preparada para filtros de color
- estructura pensada para distintos anchos de pantalla movil sin marcos laterales raros

## Como arrancar el proyecto

### Backend

```bash
cd backend
npm install
npm start
```

Modo desarrollo con recarga:

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm start
```

Para probar desde un movil en la misma red:

```bash
cd frontend
npm run start:mobile
```

## Verificaciones que usamos durante el desarrollo

Frontend:

```bash
cd frontend
node .\node_modules\typescript\bin\tsc -p tsconfig.app.json --noEmit
node .\node_modules\typescript\bin\tsc -p tsconfig.spec.json --noEmit
```

Backend:

```bash
node --check backend/src/app.js
node --check backend/src/controllers/auth.controller.js
node --check backend/src/controllers/quote.controller.js
```

## Pendiente o preparado para futuro

- pagina de libreria funcional completa
- filtros reales por categoria, hashtags y formato
- portada personalizada al publicar
- edicion adicional del perfil aparte del avatar
- mas opciones reales en ajustes
- refinado visual final al pixel respecto a Figma
- mas pruebas de integracion

## Resumen rapido para el equipo

Si alguien del grupo retoma el proyecto, las piezas mas importantes a entender primero son:

- `frontend/src/app/pages/` para ver cada pantalla
- `frontend/src/app/components/` para navbar e iconos compartidos
- `frontend/src/app/services/` para comunicacion con backend
- `backend/src/controllers/auth.controller.js` para login, perfil y ajustes
- `backend/src/controllers/quote.controller.js` para publicaciones, detalle, guardados, valoraciones, vistas y descargas

Con eso se puede seguir trabajando sobre casi cualquier parte del proyecto sin empezar de cero.
