# EkkoWebSiteUa
Proyecto para la asignatura de Usabilidad y Accesibilidad de la Universidad de Alicante.
El objetivo es construir una web (pila MEAN, con foco en frontend) para buscar contenido multimedia de peliculas y sonidos a partir de frases o fragmentos.

- `frontend/`: aplicacion Angular 16 inicial, con estructura base y enrutado preparado.
- `backend/`: API Express base con CORS, parseo JSON, variables de entorno y endpoint de prueba.

## Ejecucion local
<table>
  <tr>
    <th>Frontend</th>
    <th>Backend</th>
  </tr>
  <tr>
    <td style="vertical-align:top; padding-top:0;">
      <pre style="margin:0;"><code>cd frontend
npm install
npm start</code></pre>
      <ul style="margin-top:0;">
        <li>Plantilla por defecto de Angular pendiente de reemplazar por la interfaz final.</li>
      </ul>
    </td>
    <td style="vertical-align:top; padding-top:0;">
      <pre style="margin:0;"><code>cd backend
npm install
npm start</code></pre>
      <ul style="margin-top:0;">
        <li>Configuracion de entorno con <code>dotenv</code>.</li>
        <li>Endpoint de comprobacion: <code>GET /</code> devuelve un mensaje JSON de estado de la API.</li>
        <li>Arranque con <code>nodemon</code> usando <code>PORT</code> o <code>5000</code> por defecto.</li>
      </ul>
    </td>
  </tr>
</table>

# Posible estructura del proyecto:
## Carpetas:
ekk/
├── backend/ <em style="float:right; color: green">&rarr; Node + Express</em>
│   ├── src/
│   │   ├── config/ <em style="float:right; color: green">&rarr; db, env, configuración general</em>
│   │   ├── models/ <em style="float:right; color: green">&rarr; esquemas Mongoose</em>
│   │   ├── controllers/ <em style="float:right; color: green">&rarr; recibe request/responde</em>
│   │   ├── services/ <em style="float:right; color: green">&rarr; lógica de negocio</em>
│   │   ├── routes/ <em style="float:right; color: green">&rarr; endpoints</em>
│   │   ├── middlewares/ <em style="float:right; color: green">&rarr; auth, errores, validaciones</em>
│   │   ├── utils/ <em style="float:right; color: green">&rarr; helpers</em>
│   │   ├── seeds/ <em style="float:right; color: green">&rarr; datos iniciales / demo</em>
│   │   ├── app.js <em style="float:right; color: green">&rarr; configura express</em>
│   │   └── server.js <em style="float:right; color: green">&rarr; arranque</em>
│   ├── package.json
│   └── .env
|
├── frontend/ <em style="float:right; color: green">&rarr; Angular</em>
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/ <em style="float:right; color: green">&rarr; servicios globales, guards, interceptors</em>
│   │   │   ├── common/ <em style="float:right; color: green">&rarr; componentes reutilizables, pipes, interfaces</em>
│   │   │   ├── features/ <em style="float:right; color: green">&rarr; funcionalidades separadas por módulo/página</em>
│   │   │   │   ├── home/
│   │   │   │   ├── discover/
│   │   │   │   ├── quote-detail/
│   │   │   │   ├── library/
│   │   │   │   ├── upload/
│   │   │   │   ├── profile/
│   │   │   │   └── auth/
│   │   │   ├── layout/ <em style="float:right; color: green">&rarr; navbar, bottom nav, shells</em>
│   │   │   ├── app.routes.ts
│   │   │   └── app.config.ts
│   │   ├── assets/
│   │   ├── environments/
│   │   ├── styles.css
│   │   └── main.ts
│   ├── angular.json
│   ├── package.json
│   └── tailwind.config.js
│
├── docs/ <em style="float:right; color: green">&rarr; documentación del proyecto (opcional, recomendado)</em>
│   ├── api.md
│   ├── db.md
│   ├── decisiones.md
│   └── reparto-tareas.md
│
├── .gitignore
├── README.md
└── package.json <em style="float:right; color: green">&rarr; para scripts globales (opcional, no recomendado)</em>

## Organizacion recomendada

### Como organizar Angular

<div style="display:flex; flex-wrap:wrap; gap:16px; align-items:stretch;">
  <div style="flex:1 1 280px; border:1px solid #ddd; border-radius:8px; padding:12px;">
    <h4>/core</h4>
    <p>Para cosas unicas y globales:</p>
    <ul>
      <li>auth.service.ts</li>
      <li>quote.service.ts</li>
      <li>work.service.ts</li>
      <li>user.service.ts</li>
      <li>auth.interceptor.ts</li>
      <li>auth.guard.ts</li>
    </ul>
  </div>
  <div style="flex:1 1 280px; border:1px solid #ddd; border-radius:8px; padding:12px;">
    <h4>/common</h4>
    <p>Para lo que se reutiliza:</p>
    <ul>
      <li>quote-card/</li>
      <li>search-bar/</li>
      <li>section-title/</li>
      <li>media-toggle/</li>
      <li>empty-state/</li>
      <li>pipes</li>
      <li>interfaces comunes</li>
    </ul>
  </div>
  <div style="flex:1 1 280px; border:1px solid #ddd; border-radius:8px; padding:12px;">
    <h4>/features</h4>
    <p>Una carpeta por pantalla o modulo grande:</p>
    <ul>
      <li>home</li>
      <li>discover</li>
      <li>quote-detail</li>
      <li>library</li>
      <li>upload</li>
      <li>profile</li>
      <li>auth</li>
    </ul>
  </div>
</div>

### Como organizar Express

<div style="display:flex; flex-wrap:wrap; gap:16px; align-items:stretch;">
  <div style="flex:1 1 280px; border:1px solid #ddd; border-radius:8px; padding:12px; width: fit-content">
    <h4>/models</h4>
    <ul>
      <li>User.js</li>
      <li>Quote.js</li>
      <li>Work.js</li>
      <li>Character.js</li>
      <li>Person.js</li>
      <li>Favorite.js</li>
    </ul>
  </div>
  <div style="flex:1 1 280px; border:1px solid #ddd; border-radius:8px; padding:12px; width: fit-content">
    <h4>/controllers</h4>
    <p>Gestion de request/response:</p>
    <ul>
      <li>auth.controller.js</li>
      <li>quotes.controller.js</li>
      <li>works.controller.js</li>
      <li>users.controller.js</li>
    </ul>
  </div>
  <div style="flex:1 1 280px; border:1px solid #ddd; border-radius:8px; padding:12px; width: fit-content">
    <h4>/services</h4>
    <p>Logica de negocio real:</p>
    <ul>
      <li>crear quote</li>
      <li>buscar quotes</li>
      <li>filtrar por tipo</li>
      <li>guardar favoritos</li>
      <li>validar relaciones</li>
    </ul>
  </div>
  <div style="flex:1 1 280px; border:1px solid #ddd; border-radius:8px; padding:12px; width: fit-content">
    <h4>/routes</h4>
    <ul>
      <li>auth.routes.js</li>
      <li>quotes.routes.js</li>
      <li>works.routes.js</li>
      <li>users.routes.js</li>
      <li>favorites.routes.js</li>
    </ul>
  </div>
  <div style="flex:1 1 280px; border:1px solid #ddd; border-radius:8px; padding:12px; width: fit-content">
    <h4>/middlewares</h4>
    <ul>
      <li>auth.middleware.js</li>
      <li>error.middleware.js</li>
      <li>validate.middleware.js</li>
    </ul>
  </div>
</div>

## Estructura inicial de endpoints

<div style="display:flex; flex-wrap:wrap; gap:16px; align-items:stretch;">
  <div style="flex:1 1 260px; border:1px solid #ddd; border-radius:8px; padding:12px;">
    <h4>/api/auth</h4>
    <ul>
      <li><code>POST /register</code></li>
      <li><code>POST /login</code></li>
      <li><code>GET /me</code></li>
    </ul>
  </div>
  <div style="flex:1 1 260px; border:1px solid #ddd; border-radius:8px; padding:12px;">
    <h4>/api/quotes</h4>
    <ul>
      <li><code>GET /</code></li>
      <li><code>GET /:id</code></li>
      <li><code>POST /</code></li>
      <li><code>PUT /:id</code></li>
      <li><code>DELETE /:id</code></li>
    </ul>
  </div>
  <div style="flex:1 1 260px; border:1px solid #ddd; border-radius:8px; padding:12px;">
    <h4>/api/works</h4>
    <ul>
      <li><code>GET /</code></li>
      <li><code>GET /:id</code></li>
      <li><code>POST /</code></li>
      <li><code>PUT /:id</code></li>
    </ul>
  </div>
  <div style="flex:1 1 260px; border:1px solid #ddd; border-radius:8px; padding:12px;">
    <h4>/api/users</h4>
    <ul>
      <li><code>GET /:id</code></li>
      <li><code>PUT /:id</code></li>
    </ul>
  </div>
  <div style="flex:1 1 260px; border:1px solid #ddd; border-radius:8px; padding:12px;">
    <h4>/api/favorites</h4>
    <ul>
      <li><code>GET /</code></li>
      <li><code>POST /:quoteId</code></li>
      <li><code>DELETE /:quoteId</code></li>
    </ul>
  </div>
</div>

### Para busquedas y filtros
<code>GET /api/quotes?search=scarface&type=movie&format=audio</code>
(No monteis algo mas complejo al principio.)

# Modelo Mínimo de datos:
<div style="display:flex; flex-wrap:wrap; gap:16px; align-items:stretch;">
  <div style="flex:1 1 260px; border:1px solid #ddd; border-radius:8px; padding:0 12px;">
    <h4>User</h4>
<pre><code>{
  username,
  email,
  password,
  avatar,
  role
}</code></pre>
  </div>
  <div style="flex:1 1 260px; border:1px solid #ddd; border-radius:8px; padding:0 12px;">
    <h4>Work</h4>
<pre><code>{
  title,
  type,       // movie | series | game
  year,
  synopsis,
  poster,
  genres
}</code></pre>
  </div>
  <div style="flex:1 1 260px; border:1px solid #ddd; border-radius:8px; padding:0 12px;">
    <h4>Quote</h4>
<pre><code>{
  text,
  work,        // ref Work
  character,
  actor,
  format,      // text | audio | video
  mediaUrl,
  minuteReference,
  createdBy,   // ref User
  likes,
  saves,
  status
}</code></pre>
  </div>
  <div style="flex:1 1 260px; border:1px solid #ddd; border-radius:8px; padding:0 12px;">
    <h4>Favorite</h4>
<pre><code>{
  user,
  quote
}</code></pre>
  </div>
</div>

## Dependencias
### Frontend (`frontend/package.json`)
Dependencias:

- `@angular/animations`
- `@angular/common`
- `@angular/compiler`
- `@angular/core`
- `@angular/forms`
- `@angular/platform-browser`
- `@angular/platform-browser-dynamic`
- `@angular/router`
- `rxjs`
- `tslib`
- `zone.js`
- `tailwindcss`

Dependencias de desarrollo:

- `@angular-devkit/build-angular`
- `@angular/cli`
- `@angular/compiler-cli`
- `@types/jasmine`
- `autoprefixer`
- `jasmine-core`
- `karma`
- `karma-chrome-launcher`
- `karma-coverage`
- `karma-jasmine`
- `karma-jasmine-html-reporter`
- `postcss`
- `tailwindcss`
- `typescript`

### Backend (`backend/package.json`)
Dependencias:
- `bcryptjs`
- `cors`
- `dotenv`
- `express`
- `jsonwebtoken`
- `mongoose`

Dependencias de desarrollo:
- `nodemon`
