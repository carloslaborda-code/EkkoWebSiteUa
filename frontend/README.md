# Frontend de Ekko

Frontend Angular de Ekko, la aplicacion de usabilidad y accesibilidad para descubrir, reproducir, valorar, guardar y publicar fragmentos de audio y video.

## Tecnologias

- Angular 16
- TypeScript
- RxJS
- Tailwind CSS
- CSS por componente

## Arranque

```bash
cd frontend
npm install
npm start
```

## Uso en movil

```bash
cd frontend
npm run start:mobile
```

Despues abre en el movil la IP local del ordenador en el puerto `4200`.

## Scripts

- `npm start`: arranca Angular en local
- `npm run start:mobile`: expone el servidor para pruebas en movil
- `npm run build`: build de produccion
- `npm run watch`: build en modo desarrollo con watch
- `npm test`: tests con Karma

## Estructura util

- `src/app/pages`: pantallas principales
- `src/app/components`: componentes compartidos
- `src/app/services`: comunicacion con backend y estado auxiliar
- `src/assets`: imagenes, media y recursos estaticos
- `src/styles.css`: variables y reglas globales responsive

## Accesibilidad

El frontend aplica los ajustes de accesibilidad desde `src/app/services/accessibility.service.ts`. El servicio lee la configuracion guardada del usuario y activa atributos globales en `html` para que `src/styles.css` adapte toda la interfaz.

Opciones disponibles desde `Settings`:

- filtros de color: normal, calido, frio y escala de grises
- alto contraste
- tamano de texto pequeno, mediano, grande y muy grande
- reduccion de movimiento
- controles grandes para facilitar interaccion tactil o motriz
- subrayado de enlaces y acciones
- tipografia mas legible
- modo lector de pantalla
- transcripciones visibles en contenido multimedia

Medidas implementadas:

- enlace `Saltar al contenido principal`
- `id="main-content"` en las vistas principales
- foco visible global con `:focus-visible`
- `aria-label`, `aria-current`, `aria-pressed` y decoraciones con `aria-hidden`
- tarjetas de resultados navegables por teclado con `Enter` y `Espacio`
- transcripcion opcional en `detail`

## Verificacion rapida

```bash
frontend\node_modules\.bin\tsc.cmd -p tsconfig.app.json --noEmit
frontend\node_modules\.bin\tsc.cmd -p tsconfig.spec.json --noEmit
```

## Notas del proyecto

- la app esta preparada para movil y escritorio
- `home` muestra destacados por categoria
- `discover` usa filtros y layout adaptado a desktop
- la navbar de escritorio usa el color dorado como indicador de pagina activa
- `publish` permite portada manual y previsualizacion de frame desde video
- `detail` carga contenido sin cache para evitar datos desactualizados
- `settings` aplica accesibilidad global persistente
- los medios nuevos se publican pensando en Cloudinary desde backend
