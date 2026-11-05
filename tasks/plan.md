# Plan de implementación: portada editorial pública

## Objetivo

Convertir el resumen mensual de `/novedades` en una portada editorial más visible y escaneable, manteniendo el contenido aprobado, el contrato actual de la API y el acceso público únicamente al resumen.

## Decisiones

- Mantener el resumen y las tres ideas del mes: alcanza para una primera versión institucional.
- No agregar artículos completos ni nuevas afirmaciones generadas automáticamente.
- Mantener `podcast: null` como estado válido: el bloque de podcast solo aparece cuando la API devuelve un episodio.
- No modificar el endpoint ni la autenticación de la revista para esta mejora visual.
- Reutilizar los tokens, componentes y estilos existentes del sitio AR.
- Mantener la edición del mes actual como contenido principal.
- Ofrecer acceso sutil al histórico completo de revistas anteriores, sin desplazar la edición vigente.
- Evaluar mostrar inicialmente los últimos meses y revelar el resto mediante “Ver archivo completo”, siempre que el endpoint entregue el histórico completo.

## Tareas

### Fase 1: Contenido aprobado

- [ ] **Tarea 1: Validar el texto editorial de septiembre**
  - Confirmar con el dueño de la revista título, resumen y tres ideas.
  - Revisar especialmente afirmaciones sensibles o potencialmente desactualizadas.
  - No cambiar el contenido en AR sin una nueva aprobación editorial.

  **Verificación:** aprobación explícita del dueño de la revista.

  **Dependencias:** ninguna.

  **Archivos:** ninguno, salvo que se detecte un error en el repositorio de la revista.

  **Alcance:** XS.

### Fase 2: Nueva jerarquía visual

- [ ] **Tarea 2: Rediseñar `PublicEditorialSummary` como portada editorial**
  - Mostrar período como badge editorial destacado.
  - Mantener un único `h1` con el título.
  - Organizar el contenido en dos columnas en desktop y una en mobile.
  - Convertir “Tres ideas del mes” en tres bloques numerados `01`, `02`, `03`.
  - Mantener contraste, foco visible y lectura correcta con teclado.

  **Verificación:** el resumen se entiende en menos de 10 segundos y no se corta en 320, 768, 1024 y 1440 px.

  **Dependencias:** Tarea 1 para congelar el contenido visual de referencia.

  **Archivos probables:** `src/components/site/PublicEditorialSummary.tsx`.

  **Alcance:** S.

- [ ] **Tarea 3: Mejorar la zona de acciones**
  - Mantener `Leer la revista completa` como CTA principal.
  - Agregar `Escuchar el resumen` solamente cuando `current.podcast` exista.
  - No mostrar un botón vacío ni un enlace de Spotify inexistente.
  - Mantener el enlace a la revista como navegación externa segura.

  **Verificación:** con `podcast: null` aparece solo el CTA de la revista; con episodio aparece también el CTA del podcast.

  **Dependencias:** Tarea 2.

  **Archivos probables:** `src/components/site/PublicEditorialSummary.tsx`.

  **Alcance:** S.

### Checkpoint: UI principal

- [ ] El componente muestra título, período, resumen, tres ideas y CTA.
- [ ] El estado sin podcast no deja espacios ni controles rotos.
- [ ] El estado sin editorial sigue mostrando “próximamente”.
- [ ] `npm run build` o `bun run build` pasa.

### Fase 3: Histórico y estados reales

- [ ] **Tarea 4: Diseñar el acceso sutil al histórico completo**
  - Mantener la edición actual arriba y con mayor peso visual.
  - Mostrar debajo una sección secundaria tipo “Archivo editorial” o “Ediciones anteriores”.
  - Mostrar inicialmente los últimos meses para no saturar la página.
  - Agregar una acción “Ver archivo completo” para acceder a todos los meses disponibles.
  - Si el histórico es corto, mostrarlo completo sin agregar una interacción innecesaria.
  - Verificar que cada edición tenga período, título y enlace a la revista.
  - Evitar una grilla de tarjetas grandes: usar filas compactas o una lista editorial.

  **Verificación:** probar sin histórico, con pocos meses y con suficientes meses para activar “Ver archivo completo”.

  **Dependencias:** Tarea 2 y confirmación de que el endpoint devuelve el histórico completo.

  **Archivos probables:** `src/components/site/PublicEditorialSummary.tsx`.

  **Alcance:** M.

- [ ] **Tarea 5: Confirmar contrato y orden del archivo**
  - Usar `archive` como fuente única del histórico.
  - Ordenar por período descendente, sin duplicar `current`.
  - Confirmar que el endpoint conserve las ediciones aprobadas anteriores y no exponga borradores.
  - Definir si el acceso completo se resuelve en la misma página o mediante una ruta secundaria.

  **Verificación:** comprobar que una nueva edición pasa a `current` y la anterior queda disponible en `archive`.

  **Dependencias:** ninguna para el relevamiento; implementación dependiente de Tarea 4.

  **Archivos probables:** `src/lib/editorial.server.ts`, `src/lib/editorial.ts` y el repositorio de la revista solo si el contrato actual no alcanza.

  **Alcance:** S.

- [ ] **Tarea 6: Validación visual autenticada en Preview**
  - Verificar `/novedades` en Preview con el endpoint público desplegado.
  - Confirmar que la respuesta sea JSON y que el resumen aprobado se renderice.
  - Revisar consola, navegación externa y comportamiento responsive.

  **Verificación:** captura visual y revisión del DOM/accessibility tree sin errores de consola.

  **Dependencias:** Tareas 2, 3, 4 y 5.

  **Archivos:** ninguno.

  **Alcance:** S.

### Checkpoint final

- [ ] Build exitoso.
- [ ] Lint sin errores nuevos atribuibles al cambio.
- [ ] `/novedades` muestra la edición aprobada.
- [ ] La revista completa continúa requiriendo login.
- [ ] El podcast aparece solo cuando existe en la API.
- [ ] La edición actual es claramente protagonista.
- [ ] Las ediciones anteriores se pueden consultar sin competir visualmente con la actual.
- [ ] El histórico completo no expone borradores ni requiere intervención técnica para navegarlo.
- [ ] La UI funciona en desktop y mobile.

## Riesgos y mitigaciones

| Riesgo | Impacto | Mitigación |
|---|---:|---|
| El resumen contiene una afirmación incorrecta | Alto | Validación manual del dueño antes de publicar |
| El podcast aún no está cargado | Bajo | Ocultar el CTA cuando `podcast` sea `null` |
| La portada ocupa demasiado espacio | Medio | Resumen más corto y columnas responsive |
| Cambia el contrato de la API | Alto | No modificarlo en esta etapa; validar el schema existente |
| Preview y Producción usan variables distintas | Medio | Verificar `VITE_SITE_MODE` y el endpoint en cada entorno |

## Fuera de alcance

- Panel editorial.
- Generación automática del resumen en cada request.
- Base de datos nueva.
- Integración de Spotify adicional.
- Rediseño de toda la web de AR.
