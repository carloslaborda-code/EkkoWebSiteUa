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

## Verificacion rapida

```bash
frontend\node_modules\.bin\tsc.cmd -p tsconfig.app.json --noEmit
frontend\node_modules\.bin\tsc.cmd -p tsconfig.spec.json --noEmit
```

## Notas del proyecto

- la app esta preparada para movil y escritorio
- `home` muestra destacados por categoria
- `discover` usa filtros y layout adaptado a desktop
- `publish` permite portada manual y captura de frame desde video
- `detail` cachea contenido y evita cargas pesadas anticipadas
- los medios nuevos se publican pensando en Cloudinary desde backend
