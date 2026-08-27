# Reducir tamaño de imágenes en `/nosotros`

## Objetivo
Hacer que los 4 socios quepan visibles en una pantalla típica de escritorio/laptop sin necesidad de scroll vertical.

## Cambios propuestos

### 1. Achicar las tarjetas de retrato (`src/routes/nosotros.tsx`)
- Cambiar el contenedor de fotos de `aspect-4/5` a una proporción más cuadrada y compacta (`aspect-square` o `aspect-[3/4]` con ancho máximo controlado).
- Limitar el ancho máximo de cada tarjeta para que el grid no ocupe toda la altura disponible (p. ej. `max-w-[220px]` o similar, ajustado visualmente).
- Reducir el padding interno del marco de `p-5` a `p-4` o `p-3`.
- Mantener el recorte circular (`rounded-full`), el anillo rojo tenue y el efecto `TiltedCard`.

### 2. Compactar el encabezado de página
- Reducir ligeramente el margen superior del título (`mt-6`) y el espacio entre el párrafo de introducción y el grid (`mt-12` → `mt-8` o `mt-10`).
- Considerar reducir el tamaño tipográfico del párrafo (`text-lg` → `text-base`) si ayuda a ganar altura sin perder legibilidad.

### 3. Verificación visual
- Capturar `/nosotros` en viewport de escritorio (1280×800 o similar) para confirmar que los 4 perfiles + footer caben sin scroll.
- Confirmar que en mobile/tablet el layout sigue siendo usable (el grid ya es responsive: 1 → 2 → 4 columnas).

## Notas
- No se tocan colores, efectos, fotos ni contenido textual.
- No se modifica la home ni la ruta `/`.
