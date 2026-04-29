# EkkoWebSiteUa

## 1. Introduccion

**Ekko** es una aplicacion web orientada a la busqueda, reproduccion, valoracion, guardado, descarga y publicacion de fragmentos de **audio** y **video** extraidos de **peliculas, series, videojuegos y efectos sonoros**. El proyecto ha sido desarrollado en el contexto de la asignatura **Usabilidad y Accesibilidad** de la Universidad de Alicante y persigue una doble meta:

- construir un producto funcional con una arquitectura web moderna;
- aplicar criterios reales de usabilidad, claridad visual, navegacion intuitiva y adaptacion a distintos dispositivos.

La idea central de la aplicacion es ofrecer una experiencia en la que el usuario pueda localizar fragmentos memorables, acceder rapidamente a ellos, valorarlos y publicar nuevo contenido de forma guiada y comprensible.

## 2. Objetivos del proyecto

Los objetivos principales de Ekko son los siguientes:

- permitir la consulta publica de contenido multimedia breve sin necesidad de autenticacion;
- ofrecer una experiencia de usuario clara tanto en **movil** como en **escritorio**;
- gestionar usuarios autenticados con funciones de valoracion, guardado, descarga y publicacion;
- almacenar metadatos en MongoDB y externalizar medios pesados para mejorar rendimiento y escalabilidad;
- aplicar decisiones de diseño coherentes con un proyecto academico centrado en la usabilidad y la accesibilidad.

## 3. Vision general de la aplicacion

Desde el punto de vista funcional, Ekko se apoya en tres ideas:

- **Exploracion**: el usuario puede descubrir contenido destacado o filtrarlo por categoria, formato y produccion.
- **Interaccion**: el usuario puede reproducir, valorar, compartir, guardar y descargar fragmentos.
- **Contribucion**: el usuario autenticado puede publicar nuevos audios o videos y personalizar su portada.

La aplicacion distingue entre usuario invitado y usuario autenticado. Esto permite mantener una entrada sencilla al sistema y reservar las acciones que modifican datos para usuarios con sesion iniciada.

## 4. Tecnologias utilizadas

### 4.1 Frontend

- **Angular 16**: framework principal para la construccion de la interfaz.
- **TypeScript**: tipado estatico y mejora del mantenimiento del codigo.
- **RxJS**: gestion reactiva de peticiones y cache en servicios.
- **Tailwind CSS**: apoyo para composicion rapida de ciertos layouts y componentes.
- **CSS por componente**: personalizacion visual fina en cada pantalla.

### 4.2 Backend

- **Node.js**: entorno de ejecucion del servidor.
- **Express**: framework para exponer la API REST.
- **MongoDB Atlas**: almacenamiento persistente de usuarios, publicaciones y relaciones.
- **Mongoose**: modelado de datos y acceso a MongoDB.
- **JWT**: autenticacion basada en token.
- **bcryptjs**: hash seguro de contrasenas.
- **Cloudinary**: almacenamiento externo de archivos multimedia y portadas.

## 5. Arquitectura general

La arquitectura del sistema sigue una separacion clasica cliente-servidor:

- el **frontend** Angular se encarga de la interfaz, navegacion, validaciones de cliente y experiencia de usuario;
- el **backend** Express expone endpoints REST para autenticacion, publicaciones, valoraciones, guardados, descargas y ajustes;
- **MongoDB** almacena usuarios y metadatos de publicaciones;
- **Cloudinary** almacena los archivos multimedia y las imagenes de portada para evitar cargar MongoDB con datos binarios pesados.

Esta separacion mejora la mantenibilidad, favorece la escalabilidad del proyecto y reduce los tiempos de carga en comparacion con un almacenamiento completo en base64 dentro de la base de datos.

## 6. Estructura del proyecto

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
`-- README.md
```

## 7. Descripcion funcional pagina por pagina

### 7.1 Home

La pagina de inicio presenta una vista de acceso rapido al contenido destacado de la plataforma.

#### Funciones implementadas

- buscador por texto;
- visualizacion de fragmentos destacados;
- acceso al detalle de cada publicacion;
- indicador visual de formato, valoracion y visualizaciones.

#### Criterio de destacados

No se muestran todas las publicaciones. En su lugar, `Home` selecciona un resultado destacado por cada categoria:

- pelicula
- serie
- videojuego
- efectos

La eleccion se realiza segun:

1. mayor valoracion media;
2. en caso de empate, mayor numero de visualizaciones.

#### Consideraciones de usabilidad

- acceso inmediato al contenido mas relevante;
- reduccion de sobrecarga visual;
- jerarquia clara entre buscador, resumen e items destacados.

### 7.2 Discover

La pantalla `Discover` se concibe como un espacio de exploracion avanzada.

#### Funciones implementadas

- filtro por categoria;
- filtro por formato;
- filtro por produccion concreta;
- busqueda por texto;
- visualizacion de resultados en lista o grid adaptada al ancho disponible.

#### Diseño

En escritorio se ha implementado un layout con:

- panel lateral de filtros;
- zona principal de resultados;
- mejor separacion visual respecto a la barra lateral de navegacion.

En movil, los bloques se redistribuyen en columna priorizando el dedo y la lectura vertical.

### 7.3 Detail

La pantalla `Detail` muestra la informacion completa de una publicacion.

#### Funciones implementadas

- reproduccion de audio o video;
- visualizacion de cita, titulo, anio, actor, personaje, sinopsis y hashtags;
- valoracion por estrellas;
- guardado de contenido;
- descarga;
- copiado o comparticion de enlace;
- registro de visualizacion.

#### Mejoras tecnicas introducidas

- cache por `id` de cada publicacion;
- actualizacion del cache al valorar o registrar visualizacion;
- eliminacion de carga anticipada innecesaria del medio para mejorar tiempos de entrada;
- control de clicks repetidos en valoraciones;
- mensajes de exito o error dentro del propio panel de valoracion.

### 7.4 Publish

La pantalla `Publish` es uno de los modulos mas avanzados del proyecto.

#### Funciones implementadas

- seleccion entre `audio` y `video`;
- subida de archivo multimedia;
- calculo automatico de duracion;
- introduccion de cita, categoria, titulo, anio, actor, personaje, sinopsis y etiquetas;
- portada opcional en audio;
- portada manual en video;
- portada automatica desde el propio video;
- seleccion de un frame del video para usarlo como portada;
- limites de tamano para proteger rendimiento.

#### Logica de portada

Para video, el sistema permite tres caminos:

- usar una portada manual;
- capturar una portada desde un frame elegido del video;
- dejar que el sistema genere una portada automatica si no se ha seleccionado ninguna.

Para audio:

- se puede subir una portada opcional;
- si no se selecciona ninguna, se usa un placeholder por defecto.

### 7.5 Profile

La pantalla `Profile` centraliza la informacion de usuario.

#### Funciones implementadas

- visualizacion del avatar;
- cambio de foto de perfil;
- recuento de subidas;
- recuento de descargas;
- listado de publicaciones propias;
- listado de guardados.

#### Consideraciones de mantenimiento

El backend mantiene resincronizadas las subidas del usuario en base a las publicaciones realmente creadas.

### 7.6 Settings

La pantalla `Settings` reune opciones basicas de accesibilidad y sesion.

#### Funciones implementadas

- ajuste de tamano de texto;
- soporte base para alto contraste;
- soporte base para filtros de color;
- cierre de sesion.

### 7.7 Login

Pantalla para autenticacion del usuario.

#### Funciones implementadas

- login por correo o nombre de usuario;
- almacenamiento de token;
- persistencia del usuario en localStorage;
- redireccion posterior al acceso.

### 7.8 Register

Pantalla de registro de nuevos usuarios.

#### Funciones implementadas

- alta de usuario con nombre, correo y contrasena;
- validacion basica del formulario;
- conexion directa con backend.

## 8. Componentes reutilizables

### 8.1 Navbar

Componente de navegacion comun para la aplicacion.

#### Comportamiento actual

- en movil actua como navegacion pensada para acceso rapido;
- en escritorio se comporta como sidebar lateral;
- en desktop puede expandirse para mostrar etiquetas de texto;
- controla accesos a perfil y publicacion segun el estado de autenticacion.

### 8.2 Icon

Componente reutilizable para los SVG de la aplicacion.

#### Ventajas

- centraliza los iconos;
- evita repeticion de markup;
- mantiene consistencia visual.

## 9. Backend y API

## 9.1 Endpoints principales

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

## 9.2 Modelos de datos

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

## 10. Rendimiento y optimizacion

Durante el desarrollo se han introducido varias mejoras de rendimiento y mantenimiento:

- respuestas de listado mas ligeras desde backend;
- cache de coleccion en frontend para `home` y `discover`;
- cache individual por publicacion en `detail`;
- actualizacion de cache al registrar visualizaciones y valoraciones;
- reduccion de carga inicial del detalle;
- limites de tamano en publicacion;
- externalizacion de medios en Cloudinary.

## 11. Cloudinary y almacenamiento multimedia

Inicialmente parte del contenido se estaba almacenando en base64 dentro de MongoDB, lo que degradaba el rendimiento. Para resolverlo se ha integrado **Cloudinary** como almacenamiento de medios.

### Flujo actual

1. el frontend obtiene el archivo local;
2. lo convierte temporalmente a `data URI`;
3. el backend recibe esa informacion;
4. el backend sube el contenido a Cloudinary;
5. MongoDB guarda solo la URL final del medio y de la portada.

### Ventajas

- menor peso en documentos MongoDB;
- mejor escalabilidad;
- menor riesgo de degradacion en tiempos de carga.

## 12. Migracion de contenido legado

Se ha desarrollado un script para migrar publicaciones antiguas que todavia almacenaban `image` o `mediaUrl` en `data:`.

Script:

- `backend/scripts/migrate-cloudinary-assets.js`

Comandos:

```bash
cd backend
npm run migrate:cloudinary:dry
npm run migrate:cloudinary
```

El modo `dry-run` permite verificar cuantas publicaciones se migrarian sin modificar la base de datos.

## 13. Accesibilidad y usabilidad

El proyecto no se limita a ser funcional, sino que incorpora decisiones orientadas a la asignatura:

- diseño mobile-first;
- adaptacion posterior a escritorio con redistribucion especifica;
- tamano minimo tipografico en inputs moviles para evitar zoom automatico;
- jerarquias visuales claras;
- botones y controles amplios;
- mensajes de error o confirmacion contextualizados;
- separacion entre contenido exploratorio y acciones sensibles.

## 14. Ejecucion del proyecto

### Backend

```bash
cd backend
npm install
npm start
```

Modo desarrollo:

```bash
cd backend
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm start
```

### Prueba en movil

```bash
cd frontend
npm run start:mobile
```

## 15. Variables de entorno

Archivo:

- `backend/.env`

Variables principales:

```env
PORT=5000
MONGO_URI=...
JWT_SECRET=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

## 16. Verificacion tecnica

Comandos utilizados para validacion rapida:

### Frontend

```bash
frontend\node_modules\.bin\tsc.cmd -p frontend/tsconfig.app.json --noEmit
frontend\node_modules\.bin\tsc.cmd -p frontend/tsconfig.spec.json --noEmit
```

### Backend

```bash
node --check backend/src/controllers/auth.controller.js
node --check backend/src/controllers/quote.controller.js
node --check backend/scripts/migrate-cloudinary-assets.js
```

## 17. Estado actual del desarrollo

En el momento actual, el proyecto presenta:

- una base funcional completa de autenticacion;
- exploracion de contenido y detalle multimedia;
- valoraciones persistentes;
- guardados y descargas;
- publicacion avanzada con gestion de portadas;
- almacenamiento multimedia desacoplado de MongoDB;
- experiencia responsive movil y escritorio;
- documentacion y estructura suficientemente maduras para continuar el proyecto con claridad.

## 18. Conclusion

EkkoWebSiteUa representa una aplicacion web academica con una base tecnica realista y una atencion especial a la experiencia de uso. El sistema combina exploracion multimedia, autenticacion, interaccion social basica y publicacion de contenido con una arquitectura separada entre frontend, backend, base de datos y almacenamiento de medios. La evolucion del proyecto durante esta sesion ha reforzado especialmente la responsividad, el rendimiento, la mantenibilidad y la escalabilidad del sistema.
