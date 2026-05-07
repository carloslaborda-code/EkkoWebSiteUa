# Guion de defensa: Unidad 3

## Informe final: criterios de usabilidad y accesibilidad

 Buenos días. En esta unidad hemos revisado Ekko desde el punto de vista de la usabilidad y la accesibilidad. Ekko no se ha planteado como una maqueta, sino como una plataforma operativa para buscar, reproducir, guardar, valorar y publicar fragmentos multimedia de películas, series, videojuegos y efectos sonoros.

La aplicación tiene frontend Angular, backend Express, base de datos MongoDB, subida de medios y portadas, autenticación de usuarios y despliegue en Vercel. Por eso la evaluación no se queda en pantallas sueltas: se analiza cómo se comportan flujos completos como buscar un contenido, filtrarlo, abrir su detalle, guardarlo, valorarlo o publicar un nuevo fragmento.

En usabilidad, el primer criterio trabajado es la facilidad de aprendizaje. La navegación mantiene secciones claras: Inicio, Descubrir, Librería, Publicar y Perfil. Desde Home el usuario puede empezar con una búsqueda sencilla, y si necesita más precisión puede ir a Discover y usar filtros por categoría, formato y producción.

También se ha aplicado flexibilidad. Un usuario invitado puede explorar y consultar contenidos, mientras que un usuario autenticado puede guardar, valorar, descargar, publicar y configurar su cuenta. Además, la aplicación ofrece varios caminos: búsqueda rápida en Home, filtros avanzados en Discover, gestión personal desde Library y acciones concretas desde Detail.

La consistencia se ve en la reutilización de la navegación principal, en las tarjetas de resultados, en los botones, en los chips de filtros y en los estados activos. El usuario aprende un patrón una vez y lo reconoce en varias pantallas.

En robustez y recuperabilidad, el proyecto incluye validaciones y estados de error. Por ejemplo, Publish comprueba campos obligatorios y tamaño máximo de archivos; Library permite limpiar filtros; y las páginas protegidas redirigen al login cuando no hay sesión. El backend también valida publicaciones, usuarios y valoraciones.

Respecto al tiempo de respuesta, las búsquedas y filtros se aplican en cliente una vez cargada la colección, y el servicio de publicaciones reutiliza la respuesta con `shareReplay`. Esto hace que buscar y filtrar se perciba como una acción inmediata.

En accesibilidad, el documento base define `lang="es"`, existe un enlace para saltar al contenido principal, hay foco visible global y se usan labels en formularios. Las imágenes relevantes tienen texto alternativo, como el logo, portadas, avatar y vista previa de portada. Además, la navegación usa `aria-current`, los filtros usan `aria-pressed` y varias zonas dinámicas emplean `aria-live`.

Una parte importante del proyecto es la pantalla Settings, porque permite activar ajustes de accesibilidad: alto contraste, tamaño de texto, reducción de movimiento, controles grandes, subrayado de enlaces, filtros de color y tipografía más legible. Estos ajustes se guardan y se aplican globalmente mediante atributos `data-*` en el elemento HTML.

El diseño responsive también es clave. En móvil se usa una barra inferior, adecuada para interacción táctil. En escritorio, la navegación se convierte en una barra lateral. Las páginas se adaptan con grids y columnas: Discover separa filtros y resultados, Library separa herramientas y guardados, Detail reorganiza multimedia y acciones, y Publish separa archivo y metadatos.

Como evaluación crítica, el proyecto está bien encaminado porque tiene navegación clara, feedback, formularios comprensibles, estructura responsive y ajustes reales de accesibilidad. Las mejoras futuras serían pasar Lighthouse y axe, probar con lectores de pantalla, realizar pruebas con usuarios, mejorar algunos errores por campo con `aria-describedby` y añadir subtítulos o transcripciones para contenidos multimedia cuando sea posible.

En conclusión, Ekko se ha desarrollado con enfoque de producto. La aplicación cuida la claridad visual, la navegación, la respuesta a las acciones del usuario y la adaptación a distintas necesidades. Aun así, mantiene un margen de mejora razonable para seguir avanzando hacia una experiencia más accesible y verificable.
