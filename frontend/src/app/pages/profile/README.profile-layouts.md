# Layouts Del Perfil

La variante activa se decide en una sola línea de [profile.component.ts](./profile.component.ts), línea 15:

```ts
readonly activeOverviewLayout: ProfileOverviewLayout = 'instagram';
```

Valores posibles:

- `'compact'`
- `'original'`
- `'instagram'`

Cada layout está separado en su propio componente:

- `overviews/profile-overview-compact.component.*`
- `overviews/profile-overview-original.component.*`
- `overviews/profile-overview-instagram.component.*`

Así el cambio de diseño se hace tocando una sola línea y el resto de variantes quedan guardadas en ficheros independientes.
