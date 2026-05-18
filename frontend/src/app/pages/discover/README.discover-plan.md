# Plan De Implementación De Descubrir

## Objetivo

Redefinir la página `Descubrir` para que deje de duplicar el filtrado de `Inicio`.

La lógica de ambas pantallas quedaría así:

- `Inicio`: ranking global de publicaciones, ordenado por `rating` y, en caso de empate, por visualizaciones.
- `Descubrir`: exploración personalizada y editorial, pensada para descubrir contenido relevante o inesperado.

## Propuesta Base

La versión inicial de `Descubrir` se construirá con estos bloques:

1. `Para ti`
2. `Selección del día`
3. `Temas`
4. `Picks inesperados`

Esta combinación evita la redundancia con los filtros de `Inicio`, es viable de automatizar y no depende de curación manual continua.

## Estructura Recomendada De La Pantalla

Orden recomendado:

1. `Selección del día`
2. `Para ti`
3. `Temas`
4. `Picks inesperados`

Comportamiento visual:

- `Selección del día` debe tener aspecto de bloque editorial destacado.
- `Para ti` debe ser el bloque principal.
- `Temas` debe funcionar como entrada rápida a intereses concretos.
- `Picks inesperados` debe cerrar la pantalla con contenido menos predecible.

## Fase 1
### 1. Selección Del Día

Objetivo:

- destacar una publicación principal cada día
- dar a `Descubrir` un punto editorial y reconocible

Automatización propuesta:

1. Cada día se elige una publicación entre un conjunto elegible.
2. El conjunto elegible puede filtrarse por:
   - rating mínimo
   - calidad mínima de metadatos
   - imagen disponible, si queréis una tarjeta visual potente
   - exclusión de publicaciones ya usadas muy recientemente
3. El sistema fija la selección durante 24 horas.

Override manual recomendado:

- permitir elegir manualmente la publicación en fechas especiales
- ejemplos:
  - Navidad
  - Día de la Madre
  - campañas o hitos del proyecto

Regla práctica:

- automático por defecto
- manual solo cuando haya una razón clara

### 2. Para Ti

Objetivo:

- recomendar publicaciones relacionadas con los intereses del usuario
- tomar como referencia principal las etiquetas de las publicaciones guardadas

Regla de automatización propuesta:

1. Recoger todas las publicaciones guardadas por el usuario.
2. Extraer sus `tags`.
3. Calcular frecuencia por tag.
4. Construir un perfil de intereses con los tags más repetidos.
5. Buscar publicaciones no guardadas que compartan esos tags.
6. Ordenarlas por una mezcla de:
   - coincidencia con tags del usuario
   - rating
   - visualizaciones
   - recencia, si queréis meter algo de frescura

Ejemplo de scoring simple:

- `score = coincidencias_de_tags * 3 + rating * 2 + log(visualizaciones)`

Salvaguardas recomendadas:

- excluir publicaciones ya guardadas
- limitar publicaciones del mismo autor para que no monopolice el bloque
- reservar una parte del bloque para contenido reciente

### 3. Temas

Objetivo:

- permitir que el usuario explore por intereses
- ofrecer una entrada distinta a la de `Inicio`

Automatización propuesta:

No hace falta curación continua si las publicaciones tienen tags.

Se recomienda mantener un mapa interno `tema -> tags`.

Ejemplo:

- `Motivación`:
  - `motivacion`
  - `superacion`
  - `disciplina`
  - `exito`
- `Cine`:
  - `cine`
  - `peliculas`
  - `series`
  - `escenas`
- `Relax`:
  - `relax`
  - `calma`
  - `meditacion`
  - `study`

Cómo se genera cada tema:

1. Se toma la lista de tags asociada al tema.
2. Se buscan publicaciones con alguno de esos tags.
3. Se ordenan por relevancia interna:
   - número de coincidencias con el tema
   - rating
   - visualizaciones
4. Se muestran las más relevantes.

Ventajas:

- solo hay que mantener el mapa de temas
- las publicaciones se reasignan solas
- no hace falta revisar bloque por bloque manualmente

### 4. Picks Inesperados

Objetivo:

- sacar al usuario de su patrón habitual
- introducir descubrimiento real y no solo refuerzo de preferencias

Automatización propuesta:

1. Construir el perfil de intereses del usuario con los tags de sus guardados.
2. Detectar los tags dominantes.
3. Buscar publicaciones con tags diferentes o poco frecuentes en su historial.
4. Filtrar por una calidad mínima para no recomendar contenido irrelevante.

Regla práctica:

- excluir tags muy cercanos a los dominantes del usuario
- priorizar publicaciones bien valoradas de categorías distintas

Ejemplo:

- si el usuario guarda sobre todo `motivacion`, `estudio` y `podcast`
- `Picks inesperados` puede mostrar contenido de `cine`, `humor` o `gaming`

Salvaguarda importante:

- el bloque no debe ser completamente aleatorio
- tiene que ser inesperado, pero no malo

## Fase 2

Elementos recomendados para evolución futura:

### 5. Colecciones

Objetivo:

- agrupar publicaciones en conjuntos con más intención editorial

Automatización posible:

Se puede hacer sin curación continua usando reglas.

Enfoques posibles:

1. Colecciones temáticas automáticas
- se construyen a partir de tags y tipo de media
- ejemplos:
  - `Audios tranquilos`
  - `Frases para estudiar`
  - `Momentos de cine`

Reglas ejemplo:

- `Audios tranquilos`
  - `mediaType = audio`
  - tags en `relax`, `calma`, `study`
  - rating mínimo

2. Colecciones híbridas
- automáticas por defecto
- editables manualmente en momentos especiales

Esta segunda opción es la más recomendable a medio plazo.

### 6. Creadores

Objetivo:

- descubrir autores y no solo publicaciones

Automatización posible:

Los listados se pueden generar por métricas:

- creadores con mejor rating medio
- creadores con más guardados recientes
- creadores con más visualizaciones esta semana
- creadores emergentes

Ejemplos de bloques:

- `Creadores en alza`
- `Nuevos creadores`
- `Más guardados esta semana`

Regla recomendada:

- no mostrar solo volumen bruto
- combinar rendimiento y consistencia mínima

Ejemplo:

- rating medio aceptable
- mínimo de publicaciones
- crecimiento reciente de interacciones

## Fases Técnicas Sugeridas

### Fase A

- eliminar la lógica actual de `Descubrir` como duplicado del filtro de `Inicio`
- definir la nueva estructura visual de la página
- crear los modelos de datos que necesita cada bloque

### Fase B

- implementar `Selección del día` con fallback automático
- implementar `Temas` con mapa fijo de `tema -> tags`
- dejar `Para ti` con una primera versión simple basada en coincidencia de tags

### Fase C

- añadir `Picks inesperados`
- mejorar el scoring de `Para ti`
- introducir diversidad para no repetir autores o temáticas

### Fase D

- valorar incorporación de `Colecciones`
- valorar incorporación de `Creadores`
- añadir overrides manuales para fechas especiales o campañas concretas

## Riesgos

- si los tags son pobres o inconsistentes, `Para ti` y `Temas` perderán calidad
- si `Picks inesperados` es demasiado aleatorio, parecerá ruido
- si `Selección del día` no tiene una mínima calidad visual, perderá fuerza

## Sistema De Tags

### Recomendación De Producto

No conviene dejar que los usuarios creen tags completamente libres desde el principio.

Si `Descubrir` se apoya en:

- `Para ti`
- `Temas`
- `Picks inesperados`
- futuras `Colecciones`

entonces la consistencia de los tags pasa a ser una parte crítica del producto.

Problemas de los tags totalmente libres:

- duplicados semánticos
- diferencias de acentos o escritura
- etiquetas demasiado largas o demasiado específicas
- ruido difícil de reutilizar en recomendaciones

Ejemplos de ruido:

- `motivacion`
- `motivación`
- `frases motivadoras`
- `superacion personal`
- `motivacion!`

Todo eso puede referirse a lo mismo, pero para el sistema son etiquetas distintas si no se normalizan.

### Estrategia Recomendada

Sistema híbrido:

1. catálogo oficial de tags predefinidos
2. selección guiada por parte del usuario
3. posibilidad de sugerir tags nuevos, pero no publicarlos automáticamente como tags oficiales

Esto permite:

- mantener consistencia
- facilitar recomendaciones
- permitir evolución del vocabulario con el tiempo

### Política Recomendada Por Fases

#### Fase inicial

- solo tags predefinidos
- selección múltiple desde una lista

#### Fase intermedia

- permitir sugerencias de nuevos tags
- guardar la sugerencia para revisión interna
- no usarla todavía como tag estructural principal

#### Fase avanzada

- promover algunos tags sugeridos al catálogo oficial
- reagrupar sinónimos o variantes bajo una misma etiqueta canónica

### Reglas Recomendadas Para El Catálogo

- nombres cortos
- una sola idea por tag
- evitar frases completas
- evitar signos innecesarios
- evitar duplicados conceptuales
- usar una versión canónica sin variantes superficiales

Ejemplo:

- usar `motivacion`
- no mezclar `motivacion`, `motivación`, `motivarse`, `frases motivadoras`

## Batería Inicial De Tags Predefinidos

La siguiente batería sirve como punto de partida para clasificación, recomendaciones y agrupación por temas.

### Emoción Y Estado De Ánimo

- `motivacion`
- `inspiracion`
- `relax`
- `calma`
- `felicidad`
- `nostalgia`
- `tristeza`
- `energia`
- `esperanza`
- `superacion`

### Estudio Y Productividad

- `estudio`
- `concentracion`
- `productividad`
- `disciplina`
- `habitos`
- `aprendizaje`
- `examenes`
- `universidad`
- `lectura`
- `organizacion`

### Reflexión Y Desarrollo Personal

- `reflexion`
- `vida`
- `crecimiento`
- `autoestima`
- `saludmental`
- `mindfulness`
- `propositos`
- `cambio`
- `madurez`
- `consejos`

### Entretenimiento Y Cultura

- `cine`
- `peliculas`
- `series`
- `musica`
- `podcast`
- `libros`
- `poesia`
- `gaming`
- `anime`
- `humor`

### Social Y Relaciones

- `amistad`
- `amor`
- `familia`
- `pareja`
- `ruptura`
- `apoyo`
- `comunidad`
- `conversaciones`

### Contexto O Uso

- `manana`
- `noche`
- `entrenamiento`
- `viaje`
- `trabajo`
- `descanso`
- `rutina`
- `fin de semana`

### Formato O Intención

- `frase`
- `dialogo`
- `escena`
- `audio`
- `video`
- `voz`
- `extracto`
- `recomendacion`

## Temas Iniciales Sugeridos

Estos temas pueden construirse agrupando tags del catálogo oficial.

### Motivación

- `motivacion`
- `inspiracion`
- `superacion`
- `disciplina`
- `energia`

### Estudio

- `estudio`
- `concentracion`
- `productividad`
- `aprendizaje`
- `universidad`

### Relax

- `relax`
- `calma`
- `mindfulness`
- `descanso`
- `noche`

### Cultura

- `cine`
- `peliculas`
- `series`
- `musica`
- `libros`

### Humor

- `humor`
- `dialogo`
- `escena`

### Social

- `amistad`
- `amor`
- `familia`
- `comunidad`

## Decisión De Producto Recomendada

Versión mínima viable:

- `Para ti`
- `Selección del día`
- `Temas`
- `Picks inesperados`

Versión futura:

- `Colecciones`
- `Creadores`

Esto permite lanzar una `Descubrir` claramente distinta de `Inicio` sin depender de trabajo editorial constante.
