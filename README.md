# EkkoWebSiteUa

Aplicacion web MEAN para buscar, reproducir, valorar, guardar, descargar y publicar fragmentos breves de audio y video relacionados con peliculas, series, videojuegos y efectos sonoros.

El proyecto se ha desarrollado para la asignatura de Usabilidad y Accesibilidad de la Universidad de Alicante. La prioridad no es solo que la app funcione, sino que sea clara, consistente, responsive, accesible y mantenible.

## Indice

- [Vision general](#vision-general)
- [Funcionalidades](#funcionalidades)
- [Stack tecnico](#stack-tecnico)
- [Arquitectura](#arquitectura)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Paginas principales](#paginas-principales)
- [API REST](#api-rest)
- [Modelos de datos](#modelos-de-datos)
- [Instalacion y ejecucion](#instalacion-y-ejecucion)
- [Variables de entorno](#variables-de-entorno)
- [Cloudinary](#cloudinary)
- [Accesibilidad y usabilidad](#accesibilidad-y-usabilidad)
- [Rendimiento](#rendimiento)
- [Verificacion](#verificacion)
- [Estado actual](#estado-actual)

## Vision general

Ekko permite localizar fragmentos memorables de contenido multimedia mediante busqueda, filtros y navegacion por categorias. Un usuario invitado puede explorar y ver publicaciones. Un usuario autenticado puede guardar contenido en su biblioteca, valorar publicaciones, descargar medios, publicar nuevos fragmentos y configurar su cuenta.

La experiencia esta pensada para dos escenarios:

- exploracion rapida de contenido destacado desde Home;
- busqueda mas precisa desde Discover y Library mediante filtros.

La identidad visual actual mantiene un estilo oscuro, cinematografico y compacto, con acentos dorados, tarjetas multimedia, sidebar en escritorio y navegacion inferior en movil.

## Funcionalidades

- Registro e inicio de sesion con JWT.
- Login usando correo o nombre de usuario.
- Home con contenido destacado por categoria.
- Busqueda inteligente en Home con puntuacion por coincidencia y similitud.
- Discover con filtros por categoria, formato y produccion.
- Detail con reproductor de audio o video.
- Registro real de visitas al abrir una publicacion.
- Valoracion por estrellas con media persistente y numero de valoraciones.
- Guardado y desguardado de publicaciones.
- Library como pagina propia para ver los guardados del usuario.
- Descarga de contenido con contador de descargas del usuario.
- Publish para crear publicaciones de audio o video.
- Subida de medios y portadas a Cloudinary.
- Portada opcional para audio.
- Portada manual o capturada desde frame para video.
- Profile con avatar editable, estadisticas y publicaciones propias.
- Settings con ajustes visuales y configuracion de cuenta.
- Cambio de contrasena desde Settings.
- Ajustes de accesibilidad persistentes por usuario.
- Navegacion responsive para movil y escritorio.

## Stack tecnico

### Frontend

- Angular 16
- TypeScript
- RxJS
- Angular Router
- Angular Forms
- CSS por componente
- Estilos globales en `frontend/src/styles.css`

### Backend

- Node.js
- Express 5
- MongoDB Atlas
- Mongoose
- JWT
- bcryptjs
- Cloudinary mediante servicio propio
- dotenv
- CORS

### Herramientas de desarrollo

- Angular CLI
- Karma/Jasmine para tests frontend
- Nodemon para backend en desarrollo

## Arquitectura

El proyecto sigue una arquitectura cliente-servidor:

- `frontend/`: aplicacion Angular, rutas, paginas, servicios HTTP, estilos y assets.
- `backend/`: API REST con Express, controladores, modelos Mongoose, middleware de autenticacion y servicios.
- MongoDB: almacena usuarios, publicaciones, relaciones de guardados, valoraciones y ajustes.
- Cloudinary: almacena los archivos multimedia y portadas, evitando guardar binarios pesados en MongoDB.

El frontend consume la API mediante `API_BASE_URL` y mantiene en `localStorage` el token, el perfil basico y los ajustes necesarios para aplicar accesibilidad global.

## Estructura del proyecto

```text
EkkoWebSiteUa/
|-- backend/
|   |-- scripts/
|   |   `-- migrate-cloudinary-assets.js
|   |-- src/
|   |   |-- config/
|   |   |   `-- db.js
|   |   |-- controllers/
|   |   |   |-- auth.controller.js
|   |   |   `-- quote.controller.js
|   |   |-- data/
|   |   |   |-- defaultUserData.js
|   |   |   `-- seedQuotes.js
|   |   |-- middleware/
|   |   |   `-- auth.middleware.js
|   |   |-- models/
|   |   |   |-- quote.js
|   |   |   `-- user.js
|   |   |-- routes/
|   |   |   |-- auth.routes.js
|   |   |   `-- quote.routes.js
|   |   |-- services/
|   |   |   `-- cloudinary.service.js
|   |   |-- app.js
|   |   `-- server.js
|   `-- package.json
|-- frontend/
|   |-- src/
|   |   |-- app/
|   |   |   |-- components/
|   |   |   |   |-- icon/
|   |   |   |   `-- navbar/
|   |   |   |-- pages/
|   |   |   |   |-- detail/
|   |   |   |   |-- discover/
|   |   |   |   |-- home/
|   |   |   |   |-- library/
|   |   |   |   |-- login/
|   |   |   |   |-- profile/
|   |   |   |   |-- publish/
|   |   |   |   |-- register/
|   |   |   |   `-- settings/
|   |   |   |-- services/
|   |   |   |   |-- accessibility.service.ts
|   |   |   |   |-- api-url.ts
|   |   |   |   |-- auth.service.ts
|   |   |   |   |-- quotes.services.ts
|   |   |   |   `-- user.service.ts
|   |   |   |-- app-routing.module.ts
|   |   |   `-- app.module.ts
|   |   |-- assets/
|   |   |-- index.html
|   |   `-- styles.css
|   `-- package.json
|-- package.json
`-- README.md
```

## Paginas principales

### Home

Ruta: `/` y `/home`

Pagina de entrada de la aplicacion. Muestra una seleccion destacada de publicaciones, una por categoria, y permite buscar en toda la coleccion.

Funciones:

- buscador principal;
- resultados destacados por categoria;
- ordenacion de coincidencias por relevancia, valoracion y visitas;
- tarjetas con portada, formato, titulo, frase, estrellas y visualizaciones;
- acceso directo al detalle.

El criterio de destacados prioriza la mayor valoracion media. En empate, se usa el numero de visitas.

### Discover

Ruta: `/discover`

Pagina de exploracion avanzada.

Funciones:

- filtro por categoria: pelicula, serie, videojuego y efectos;
- filtro por formato: audio o video;
- filtro por produccion concreta;
- busqueda por texto dentro de los resultados filtrados;
- resultados navegables hacia Detail.

### Library

Ruta: `/library`

Biblioteca personal del usuario autenticado. Sustituye la antigua seccion de guardados dentro del perfil.

Funciones:

- listado de publicaciones guardadas;
- busqueda dentro de guardados;
- filtro por formato;
- filtro por categoria;
- orden por recientes, mejor valorados o titulo;
- contador de guardados, videos y audios;
- tarjetas con valoracion real, numero de valoraciones y visitas reales;
- estrellas renderizadas como en Home, por ejemplo una valoracion de `3.3` muestra 3 estrellas activas.

Si el usuario no tiene sesion iniciada, la pagina redirige a Login.

### Detail

Ruta: `/quote/:id`

Vista completa de una publicacion.

Funciones:

- reproductor de audio o video;
- titulo, ano, cita, actor, personaje, sinopsis y hashtags;
- contador de visitas actualizado al entrar;
- valoracion por estrellas;
- guardado o eliminacion de biblioteca;
- descarga del medio;
- compartir con Web Share API o copiar enlace al portapapeles;
- mensajes contextuales de exito o error.

Las acciones que modifican datos requieren autenticacion.

### Publish

Ruta: `/publish`

Formulario para publicar nuevos fragmentos.

Funciones:

- seleccion de tipo: audio o video;
- seleccion de categoria;
- subida de archivo multimedia;
- validacion de tamano de archivo;
- calculo automatico de duracion;
- campos de frase, obra, ano, actor, personaje, sinopsis y hashtags;
- portada opcional para audio;
- portada manual para video;
- captura de portada desde un frame del video;
- previsualizacion de portada;
- subida final del medio y portada a Cloudinary.

Limites actuales:

- audio: hasta 8 MB;
- video: hasta 20 MB;
- portada: hasta 4 MB.

### Profile

Ruta: `/profile`

Pagina de perfil del usuario autenticado.

Funciones:

- avatar e iniciales de fallback;
- cambio de foto de perfil;
- contador de publicaciones;
- contador de descargas;
- listado de publicaciones propias.

Los guardados ya no se muestran en Profile. Ahora se gestionan desde Library.

### Settings

Ruta: `/settings`

Pagina de ajustes del usuario.

Funciones:

- filtro de color: normal, calido, frio y escala de grises;
- alto contraste;
- tamano de texto: pequeno, mediano, grande y muy grande;
- reduccion de movimiento;
- controles grandes;
- subrayado de enlaces y acciones;
- tipografia legible;
- configuracion de cuenta desplegable;
- cambio de contrasena con validacion;
- cierre de sesion.

Los ajustes se guardan en backend y se aplican globalmente desde el servicio de accesibilidad.

### Login

Ruta: `/login`

Funciones:

- inicio de sesion con correo o nombre de usuario;
- validacion basica;
- almacenamiento de token;
- redireccion posterior al acceso;
- autocompletado de navegador.

### Register

Ruta: `/register`

Funciones:

- registro con nombre de usuario, correo y contrasena;
- confirmacion de contrasena;
- validacion de campos obligatorios;
- validacion de longitud minima;
- errores inline sin usar alertas nativas.

## Componentes reutilizables

### Navbar

Componente comun de navegacion.

- En movil funciona como barra inferior.
- En escritorio funciona como sidebar.
- Marca la pagina activa.
- Expone accesos a Home, Discover, Library, Publish, Profile y Settings.
- Respeta el estado de autenticacion para acciones protegidas.

### Icon

Componente centralizado para iconos SVG internos.

- Reduce duplicacion de markup.
- Mantiene consistencia visual.
- Facilita reutilizar iconos en botones, tarjetas y filtros.

## API REST

URL base local habitual:

```text
http://localhost:5000
```

### Auth

| Metodo | Endpoint | Protegido | Descripcion |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | No | Registra un usuario |
| POST | `/api/auth/login` | No | Inicia sesion y devuelve JWT |
| GET | `/api/auth/me` | Si | Obtiene el perfil actual |
| PUT | `/api/auth/profile` | Si | Actualiza username o avatar |
| PUT | `/api/auth/settings` | Si | Actualiza ajustes de accesibilidad |
| PUT | `/api/auth/password` | Si | Cambia la contrasena |

### Quotes

| Metodo | Endpoint | Protegido | Descripcion |
| --- | --- | --- | --- |
| GET | `/api/quotes` | No | Lista publicaciones |
| GET | `/api/quotes/:id` | No | Obtiene una publicacion |
| POST | `/api/quotes` | Si | Crea una publicacion |
| POST | `/api/quotes/:id/view` | No | Registra una visita |
| POST | `/api/quotes/:id/save` | Si | Guarda o elimina de biblioteca |
| POST | `/api/quotes/:id/rate` | Si | Registra o actualiza valoracion |
| POST | `/api/quotes/:id/download` | Si | Registra descarga y devuelve `mediaUrl` |

### Respuesta raiz

```text
GET /
```

Devuelve:

```json
{
  "message": "API funcionando correctamente"
}
```

## Modelos de datos

### User

Campos principales:

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
- `createdAt`
- `updatedAt`

Ajustes guardados en `settings`:

- `colorFilter`
- `highContrast`
- `textSize`
- `reducedMotion`
- `largeTargets`
- `underlineLinks`
- `readableFont`

### Quote

Campos principales:

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
- `createdAt`
- `updatedAt`

Categorias usadas:

- `movie`
- `series`
- `game`
- `sfx`

Tipos de medio:

- `audio`
- `video`

## Instalacion y ejecucion

### Requisitos

- Node.js
- npm
- MongoDB Atlas o una instancia MongoDB compatible
- Cuenta de Cloudinary para subida de medios

### Backend

```bash
cd backend
npm install
npm run dev
```

Modo produccion/local simple:

```bash
cd backend
npm start
```

El backend queda normalmente en:

```text
http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
npm start
```

El frontend queda normalmente en:

```text
http://localhost:4200
```

### Prueba en movil dentro de la misma red

```bash
cd frontend
npm run start:mobile
```

Despues se accede desde el movil usando la IP local del ordenador y el puerto `4200`.

## Variables de entorno

El backend usa `backend/.env`. Este archivo no debe subirse al repositorio.

Variables esperadas:

```env
PORT=5000
MONGO_URI=...
JWT_SECRET=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

Notas:

- `PORT` define el puerto del servidor Express.
- `MONGO_URI` conecta con MongoDB.
- `JWT_SECRET` firma los tokens de autenticacion.
- Las variables de Cloudinary permiten subir portadas y medios.

## Despliegue en Vercel

La opcion recomendada es desplegar el frontend Angular en Vercel y mantener el backend Express en un servicio Node publico como Render, Railway o similar. El backend de Ekko recibe archivos de audio/video y no encaja bien con limites pequenos de payload en funciones serverless.

### Frontend en Vercel

Al importar el repositorio en Vercel:

- Framework Preset: `Angular`
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist/client`

Variable de entorno necesaria en Vercel:

```env
EKKO_API_BASE_URL=https://tu-backend-publico.com/api
```

En local no hace falta definirla: el frontend usa automaticamente `http://localhost:5000/api`.

### Rutas SPA

`frontend/vercel.json` incluye rewrites para que rutas como `/home`, `/library`, `/quote/:id`, `/login` o `/settings` funcionen al recargar la pagina directamente en Vercel.

### Backend

El backend necesita estas variables en la plataforma donde se despliegue:

```env
PORT=5000
MONGO_URI=...
JWT_SECRET=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

## Cloudinary

Cloudinary se utiliza para guardar archivos pesados fuera de MongoDB.

Flujo de publicacion:

1. El frontend lee el archivo local como `data URI`.
2. El backend recibe el payload.
3. El servicio `cloudinary.service.js` detecta si el contenido es `data URI`.
4. El backend sube portada y medio a Cloudinary.
5. MongoDB guarda solo las URLs finales.

Ventajas:

- documentos de MongoDB mas ligeros;
- mejor tiempo de respuesta;
- menor riesgo de superar limites de tamano;
- medios servidos desde infraestructura optimizada para contenido multimedia.

### Migracion de contenido legado

Existe un script para migrar publicaciones antiguas que guarden `image` o `mediaUrl` como `data:`.

```bash
cd backend
npm run migrate:cloudinary:dry
npm run migrate:cloudinary
```

El modo `dry` permite revisar cuantos elementos se migrarian antes de modificar datos.

## Accesibilidad y usabilidad

El proyecto incluye medidas de accesibilidad basica y ajustes personalizables:

- enlace para saltar al contenido principal;
- foco visible global;
- navegacion por teclado en tarjetas interactivas;
- labels y `aria-label` en acciones relevantes;
- `aria-current` en navegacion activa;
- botones con estados claros;
- contraste reforzado en modo alto contraste;
- filtros de color;
- tamano de texto configurable;
- objetivos tactiles grandes;
- opcion de reducir movimiento;
- opcion de subrayar enlaces;
- tipografia mas legible.

El servicio `accessibility.service.ts` aplica los ajustes al elemento `html` mediante:

- `data-text-size`
- `data-color-filter`
- `data-high-contrast`
- `data-reduced-motion`
- `data-large-targets`
- `data-underline-links`
- `data-readable-font`

## Rendimiento

Mejoras aplicadas:

- cache compartida de `getQuotes()` con `shareReplay`;
- invalidacion de cache al crear nuevas publicaciones;
- actualizacion local de cache al valorar o registrar visitas;
- `trackBy` en listas principales;
- imagenes con carga diferida cuando procede;
- `decoding="async"` en imagenes;
- restauracion de scroll al cambiar de pagina;
- seleccion de campos en backend para evitar payloads innecesarios;
- cabeceras `no-store` en API para evitar datos sensibles cacheados;
- limites de tamano en Publish;
- medios externalizados en Cloudinary.

## Verificacion

### Build frontend

```bash
cd frontend
npm run build
```

Resultado de la ultima verificacion:

```text
Build OK
Initial Total: 496.62 kB
Estimated Transfer Size: 115.05 kB
```

### Tests frontend

```bash
cd frontend
npm test -- --watch=false --browsers=ChromeHeadless
```

Si no hay Google Chrome instalado pero si Microsoft Edge:

```powershell
$env:CHROME_BIN='C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
npm.cmd test -- --watch=false --browsers=ChromeHeadless
```

Resultado de la ultima verificacion:

```text
TOTAL: 11 SUCCESS
```

### Check sintactico backend

```powershell
Get-ChildItem backend/src -Recurse -Filter *.js | ForEach-Object { node --check $_.FullName }
```

Resultado:

```text
OK
```

### Smoke test local

Rutas comprobadas con respuesta `200`:

- `http://localhost:4200/`
- `http://localhost:4200/home`
- `http://localhost:4200/discover`
- `http://localhost:4200/library`
- `http://localhost:4200/login`
- `http://localhost:4200/register`
- `http://localhost:4200/profile`
- `http://localhost:4200/settings`
- `http://localhost:5000/`
- `http://localhost:5000/api/quotes`

## Estado actual

El proyecto tiene actualmente:

- frontend Angular funcional;
- backend Express conectado a MongoDB;
- autenticacion JWT;
- subida de medios a Cloudinary;
- paginas principales completas;
- biblioteca de guardados separada del perfil;
- valoraciones y visitas persistentes;
- publicacion avanzada de audio/video;
- ajustes visuales y de accesibilidad;
- configuracion de cuenta con cambio de contrasena;
- limpieza de codigo muerto y referencias obsoletas;
- mejoras de rendimiento en listas, imagenes y servicios.

## Decisiones recientes

- Los guardados se gestionan desde `Library`, no desde `Profile`.
- Se eliminaron las opciones de modo lector de pantalla y transcripciones visibles.
- Las tarjetas de Library muestran valoracion y visitas reales.
- Las estrellas se renderizan con el mismo criterio visual que Home.
- Register usa errores inline en lugar de `alert`.
- Se elimino el enlace a recuperacion de contrasena porque no existe ruta implementada.
- El backend mantiene una limpieza conservadora de datos heredados de usuario.

## Posibles mejoras futuras

- Lazy loading real por modulo/ruta para reducir aun mas el bundle inicial.
- Auditoria con Lighthouse para medir rendimiento, accesibilidad y buenas practicas.
- Tests e2e con Playwright o Cypress para flujos completos.
- Paginacion o busqueda server-side si la coleccion crece mucho.
- Recuperacion de contrasena por email.
- Moderacion o panel de administracion para contenido publicado.

## Conclusiones

EkkoWebSiteUa es una aplicacion academica con base tecnica real: autenticacion, exploracion multimedia, interaccion de usuario, publicacion de contenido, almacenamiento externo de medios y ajustes de accesibilidad. La version actual esta preparada para presentacion y para continuar evolucionando sin partir de un prototipo desordenado.
