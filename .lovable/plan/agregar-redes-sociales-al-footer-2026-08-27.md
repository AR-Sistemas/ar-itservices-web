# Agregar redes sociales al footer

## Objetivo
Reemplazar la columna de texto "Seguinos" en el footer por iconos oficiales de LinkedIn, Instagram y WhatsApp, cada uno con su link real y estilo acorde al tema oscuro de marca.

## Cambios

1. **Nuevo componente `src/components/site/SocialLinks.tsx`**
   - Tres iconos SVG inline (LinkedIn, Instagram, WhatsApp).
   - Links exactos proporcionados:
     - LinkedIn: https://www.linkedin.com/showcase/ar-consultores1/posts/?feedView=all
     - Instagram: https://www.instagram.com/ar_consultores
     - WhatsApp: https://wa.me/5493512349619
   - Color base `text-muted-foreground`, hover `text-primary` (#FF000D).
   - Atributos de accesibilidad: `aria-label` por red, `target="_blank"`, `rel="noopener noreferrer"`.

2. **Actualizar `src/routes/index.tsx`**
   - Importar `SocialLinks`.
   - Reemplazar el bloque `SOCIAL.map(...)` en la columna "Seguinos" por `<SocialLinks />`.
   - Eliminar la constante `SOCIAL` si queda sin usar.

3. **Validación**
   - Ejecutar build para confirmar que no hay errores de tipo ni imports rotos.
   - Verificar visualmente en preview que los tres iconos se ven, son clickeables y apuntan a las URLs correctas.

## Notas técnicas
- Se usan SVG inline para no depender de librerías externas ni imágenes adicionales.
- Se mantiene el layout de 4 columnas del footer; los iconos se alinean horizontalmente bajo el título "Seguinos".
