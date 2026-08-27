# Nuestra gente: página dedicada + frase misión/visión en home

## Opinión / enfoque

Acuerdo con la estrategia: mantener la home limpia y corporativa, y conservar el toque humano en una página propia. Dos decisiones clave:

1. **La sección en home queda con una frase editorial** de misión/visión, grande, centrada, con `BlurText` o `AnimatedContent` — no un bloque vacío. Esto transforma el espacio libre en un momento de marca, no en un hueco.
2. **El link a la página del equipo va destacado** (botón estilo secundario del hero), con copy tipo "Conocé a quienes lo hacen posible" — así no se pierde el factor humano que la investigación detectó.

## Cambios

### 1. Nueva ruta `/nosotros` (`src/routes/nosotros.tsx`)
- Mueve el grid actual de socios completo: fotos circulares, nombres, roles, citas, `TiltedCard`.
- Reutiliza `PHOTOS` y `c.people.items` (sin duplicar contenido).
- Incluye `FloatingNav` + footer para navegación consistente, y link "Volver" a `/`.
- `head()` propio: título/descripción únicos ES ("Nuestra gente — AR IT Services"), `og:title`, `og:description`, `og:type`, `twitter:card`.

### 2. Home — sección "Nuestra gente" rediseñada (`src/routes/index.tsx`)
- Se quita el grid de fotos/citas (se mueve a `/nosotros`).
- En su lugar: frase misión/visión en texto grande centrado con `AnimatedContent`, p.ej.:
  - ES: "Detrás de cada proyecto hay personas que se quedan. 25 años, un mismo equipo de socios al frente."
  - EN: traducción equivalente.
- Debajo, un `<Link to="/nosotros">` con estilo de botón outline: "Conocé a nuestra gente" / "Meet our people".

### 3. Contenido i18n (`src/i18n/content.ts`)
- Nuevo bloque `people.statement` (frase) y `people.ctaLink` (texto del botón) en ES y EN.
- Se conserva `people.items` tal cual para la nueva página.

### 4. Navegación
- El item "Nosotros" del nav y footer pasa de `#nosotros` a `/nosotros` (ruta real, mejor para SEO y deep linking). El `id="nosotros"` de la home se elimina.

## Detalles técnicos
- Ruta file-based: `src/routes/nosotros.tsx` con `createFileRoute("/nosotros")`; no se toca `routeTree.gen.ts` (se regenera solo).
- Sin cambios de paleta, efectos ni layout fuera de la sección afectada.
- Verificación: build + captura de la home (frase nueva) y de `/nosotros` (grid de socios).
