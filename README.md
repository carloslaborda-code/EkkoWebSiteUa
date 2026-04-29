# EkkoWebSiteUa

Proyecto de la asignatura **Usabilidad y Accesibilidad** de la Universidad de Alicante.

Ekko es una aplicacion web para descubrir, reproducir, valorar, guardar, descargar y publicar fragmentos de **audio** y **video** inspirados en **peliculas, series, videojuegos y efectos sonoros**. El proyecto nacio con enfoque mobile-first y durante esta iteracion se ha consolidado tambien una experiencia de escritorio con layout lateral, navegacion expandible y redistribucion especifica de contenido.

## Stack

### Frontend

- Angular 16
- TypeScript
- RxJS
- Tailwind CSS para parte del layout y componentes visuales
- CSS por componente

### Backend

- Node.js
- Express
- MongoDB Atlas con Mongoose
- JWT para autenticacion
- bcryptjs para hash de contrasenas
- Cloudinary para almacenamiento externo de medios

## Arquitectura actual

```text
EkkoWebSiteUa/
|-- backend/
|   |-- scripts/
|   |   `-- migrate-cloudinary-assets.js
|   |-- src/
|   |   |-- config/
|   |   |-- controllers/
|   |   |-- data/
|   |   |-- middleware/
|   |   |-- models/
|   |   |-- routes/
|   |   |-- services/
|   |   |   `-- cloudinary.service.js
|   |   |-- app.js
|   |   `-- server.js
|   `-- package.json
|-- frontend/
|   |-- src/
|   |   |-- app/
|   |   |-- assets/
|   |   |-- index.html
|   |   `-- styles.css
|   `-- package.json
`-- README.md
```

## Funcionalidades actuales

- registro de usuarios
- login con email o nombre de usuario
- home publica con destacados
- detalle publico con reproduccion de audio o video
- valoracion por estrellas con media global
- guardado de publicaciones por usuario
- descarga de contenido solo con sesion iniciada
- perfil con avatar, estadisticas, subidas y guardados
- ajustes de accesibilidad base
- publicacion de audio y video
- subida de portada manual y portada extraida desde frame del video
- anio de publicacion por desplegable
- almacenamiento de medios y portadas en Cloudinary
- migracion de publicaciones antiguas desde `data:` a Cloudinary

## Cambios principales de esta sesion

### 1. Responsive real movil + escritorio

- se revisaron breakpoints globales y estructura responsive
- en movil se evito el zoom automatico al enfocar inputs subiendo el tamano minimo tipografico
- en escritorio se paso a una navegacion lateral tipo app social
- la sidebar de escritorio queda compacta y se expande al pasar por encima
- se redistribuyeron `home`, `discover`, `detail`, `publish`, `profile`, `settings`, `login` y `register`

### 2. Discover redisenado

- nueva composicion con panel de filtros y resultados
- reduccion del exceso de beige
- mejor espaciado en desktop con separacion real respecto a la sidebar
- eliminacion de textos de carga y copys sin valor

### 3. Publish mejorado

- soporte para `audio` y `video`
- subida opcional de portada para audio
- placeholder por defecto para audio si no se elige imagen
- portada manual para video
- portada automatica a partir del propio video si no se sube una manual
- selector de frame del video:
  - previsualizacion del video
  - slider de tiempo
  - captura del frame como portada
- limites de tamano para evitar sobrecargas innecesarias:
  - audio: 8 MB
  - video: 20 MB
  - portada: 4 MB

### 4. Persistencia y rendimiento

- la lista de publicaciones se sirve mas ligera desde backend
- `home` y `discover` comparten cache de publicaciones
- `detail` cachea cada publicacion por `id`
- se actualiza cache al registrar visualizaciones y valoraciones
- se elimino la carga anticipada de metadatos pesados en `detail`
- el estado local del usuario se reaprovecha para evitar peticiones redundantes al entrar al detalle

### 5. Home con destacados

`home` ya no enseña todas las publicaciones. Ahora muestra un contenido destacado por categoria:

- `movie`
- `series`
- `game`
- `sfx`

Criterios:

1. mayor valoracion media
2. si empatan, mayor numero de visualizaciones

### 6. Valoraciones endurecidas

- bloqueo de clicks repetidos mientras se envia la valoracion
- mensaje de exito o error dentro del propio panel de valorar
- mensaje mas claro cuando no hay sesion:
  - `Debes iniciar sesion para valorar esta publicacion.`
- normalizacion extra en backend para entradas antiguas o inconsistentes de `ratedQuotes`

### 7. Cloudinary

Las publicaciones nuevas ya no deben guardar medios pesados en MongoDB si Cloudinary esta configurado. El backend:

- recibe `data URI` desde frontend
- sube portada y medio a Cloudinary
- guarda en Mongo solo las URLs finales

Fallback:

- si Cloudinary no esta configurado, el backend conserva el comportamiento anterior para no romper la app

### 8. Migracion de publicaciones antiguas

Se anadio un script para migrar publicaciones antiguas que todavia guardaban `image` o `mediaUrl` en `data:`.

Script:

- [backend/scripts/migrate-cloudinary-assets.js](backend/scripts/migrate-cloudinary-assets.js)

Comandos:

```bash
cd backend
npm run migrate:cloudinary:dry
npm run migrate:cloudinary
```

El script:

- localiza publicaciones con `data:`
- sube portadas y medios a Cloudinary
- actualiza Mongo con las nuevas URLs
- resincroniza los `uploads` de usuario

## Flujo de acceso

### Usuario invitado

Puede:

- entrar en `Home`
- abrir `Detalle`
- reproducir audio o video
- generar visualizaciones

Si intenta:

- guardar
- descargar
- valorar
- abrir `Perfil`
- abrir `Ajustes`
- abrir `Publicar`

la aplicacion lo redirige a `Login`.

### Usuario autenticado

Puede:

- guardar y quitar guardados
- descargar contenido
- valorar publicaciones
- publicar audio y video
- subir portada manual
- elegir portada desde un frame del video
- editar avatar
- ver subidas y guardados
- ajustar opciones base de accesibilidad

## Pantallas principales

### Home

- resultados destacados por categoria
- buscador sobre destacados
- cards con portada, valoracion y visualizaciones
- acceso rapido a detalle

### Discover

- filtros por categoria
- filtros por formato
- filtro por produccion
- resultados en grid
- layout de escritorio con panel lateral de filtros

### Detail

- reproduce audio o video
- muestra cita, actor, personaje, titulo, anio, sinopsis y hashtags
- valorar dentro del panel propio
- compartir
- guardar
- descargar

### Publish

- seleccion de `audio` o `video`
- subida de archivo
- duracion automatica
- portada manual
- captura de frame desde el propio video
- dropdown de anio

### Profile

- avatar editable
- estadisticas
- mis subidas
- guardados

### Settings

- tamano de texto
- alto contraste base
- filtros de color base
- logout

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

## Variables de entorno

Archivo:

- [backend/.env](backend/.env)

Necesarias:

```env
PORT=5000
MONGO_URI=...
JWT_SECRET=...
```

Para Cloudinary:

```env
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

## Arranque del proyecto

### Backend

```bash
cd backend
npm install
npm start
```

Modo desarrollo:

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

Para abrir desde movil en la misma red:

```bash
cd frontend
npm run start:mobile
```

## Verificaciones utiles

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
node --check backend/scripts/migrate-cloudinary-assets.js
```

## Mantenimiento y decisiones tecnicas

- MongoDB se usa para metadatos y relaciones
- Cloudinary se usa para assets grandes
- las caches del frontend reducen tiempos entre pantallas
- `home` trabaja con destacados, no con el catalogo completo
- `detail` evita cargar medios pesados hasta que el usuario reproduce

## Siguientes mejoras razonables

- migrar por completo contenido legado si queda algo fuera de Cloudinary
- introducir feedback visual mas rico para acciones de exito/error
- ampliar ajustes de accesibilidad reales
- tests de integracion de flujos clave
- pulido visual fino frente a Figma

## Archivos clave para retomar el proyecto

- [frontend/src/app/pages/home](frontend/src/app/pages/home)
- [frontend/src/app/pages/discover](frontend/src/app/pages/discover)
- [frontend/src/app/pages/detail](frontend/src/app/pages/detail)
- [frontend/src/app/pages/publish](frontend/src/app/pages/publish)
- [frontend/src/app/services](frontend/src/app/services)
- [backend/src/controllers/auth.controller.js](backend/src/controllers/auth.controller.js)
- [backend/src/controllers/quote.controller.js](backend/src/controllers/quote.controller.js)
- [backend/src/services/cloudinary.service.js](backend/src/services/cloudinary.service.js)
- [backend/scripts/migrate-cloudinary-assets.js](backend/scripts/migrate-cloudinary-assets.js)
