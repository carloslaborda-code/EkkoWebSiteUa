# Cierre final de la Unidad 3

Este anexo resume los cambios de cierre implementados tras la revision final del informe principal. Su objetivo es dejar constancia de las mejoras reales aplicadas al producto antes de la entrega.

## Mejoras implementadas

- `Discover`
  Se ha mejorado la navegacion por teclado del selector de produccion. Ahora puede abrirse con teclado, cerrarse con `Esc`, mover el foco entre opciones con flechas y devolver el foco al disparador al cerrarse. Tambien se ha anadido la accion `Limpiar filtros`.

- `Publish`
  La seleccion de archivo multimedia y de portada ya no depende de labels no enfocables. Ahora se activa mediante controles utilizables con teclado. Ademas, los mensajes del formulario distinguen mejor entre estado, error y exito.

- `Settings`
  Se ha eliminado la accion ambigua de `Privacidad` para no mostrar un flujo vacio en demo. El bloque de configuracion de cuenta expone mejor su estado expandido.

- `Profile`
  Se ha reforzado la claridad del bloque de subidas con copy contextual y estados vacios mas explicitos. En movil estrecho la rejilla se adapta a una sola columna para evitar tarjetas demasiado comprimidas.

- `Backend y demo`
  La coleccion semilla se ha ampliado hasta una base suficiente para demostrar categorias, busqueda y filtros. Tambien se ha anadido el script `npm run seed:demo-users` para preparar tres usuarios de prueba con nombres coherentes.

## Evidencias utiles para la defensa

- Navegacion por teclado y foco visible: `Discover`, `Publish`, `Settings`.
- Recuperabilidad: `Limpiar filtros` en `Discover`, mensajes claros en `Publish`.
- Disminucion de carga cognitiva: microcopy mas directo y eliminacion de acciones vacias.
- Preparacion de demo: coleccion semilla amplia y usuarios demo idempotentes.
