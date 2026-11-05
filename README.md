# AR IT Services: Engineering Excellence

# Prompt para Lovable — Sitio web AR IT Services (v1)


> Copiá todo el contenido de este documento y pegalo como primer mensaje en Lovable. Subí junto con el prompt los 3 archivos de logo (color, negativo, escala de grises) que ya tenés.


---


## 1. Contexto del proyecto


Quiero que construyas la primera versión (v1) del sitio web corporativo de **AR IT Services** (nombre comercial de AR Consultores SRL), una empresa de desarrollo de software, ciencia de datos y staffing de talento IT con 25+ años de trayectoria, oficinas en **Dallas (EE.UU.), Córdoba (Argentina) y Asunción (Paraguay)**, y clientes como **Claro** y la **Dirección de Inteligencia Fiscal de Córdoba**.


El sitio debe reemplazar la web institucional actual (desactualizada, en WordPress) y reflejar la nueva identidad de marca que te voy a detallar a continuación. Es un sitio B2B: el visitante típico es un gerente de tecnología, IT o innovación evaluando proveedores de desarrollo de software, datos o staffing.


Construilo en **React + Tailwind CSS** (tu stack nativo), como una single-page de landing institucional con secciones ancladas, mobile-first y con animaciones sutiles al scroll.


---


## 2. Identidad de marca (obligatorio — extraído del Brand Book oficial)


### Colores corporativos (usar exactamente estos valores, no aproximar)


| Uso | Hex |
|---|---|
| Rojo primario (acento, CTAs, marca) | `#FF000D` |
| Rojo oscuro / vino (hover states, profundidad) | `#990F1B` |
| Gris corporativo (texto secundario, elementos neutros) | `#706F6F` |
| Tinta / casi-negro (texto principal, fondo de secciones oscuras) | `#232234` |
| Blanco (fondo primario) | `#FFFFFF` |


No introduzcas ningún otro color de acento (nada de azul, verde, ámbar). Los degradados solo se permiten entre `#232234` y `#706F6F` (así es como el logo degrada la "R"), o variaciones de opacidad del rojo primario (100/80/60/40/20%, tal como especifica el manual de marca).


### Tipografía


Familia tipográfica oficial: **Nexa** (variantes de Thin a Black). Si no está disponible como webfont en este proyecto, usá **Sora** o **Manrope** de Google Fonts como reemplazo temporal (geometría similar, buena legibilidad, amplia variedad de pesos) y dejá un comentario en el código indicando `/* TODO: reemplazar por Nexa cuando se suban los archivos de fuente con licencia webfont */`.


### Logo y reglas de uso (obligatorio respetar)


- Voy a subir 3 archivos: logo a color (fondo blanco), logo en escala de grises (fondo transparente), y el manual de marca en PDF.
- Usá el **logo a color como versión prioritaria** sobre fondos blancos o claros.
- Sobre fondos oscuros (`#232234` o rojo `#FF000D`), usá la versión negativa del logo (el manual muestra ambas variantes: negativo a color y negativo total en blanco). Si no tenés el archivo exacto de esa variante, generá una versión del logo en blanco sólido para esos casos, nunca superpongas el logo a color original sobre fondos oscuros.
- Respetá siempre un **área de seguridad** alrededor del logo equivalente a la altura de la "S" de "Services" (proporción 2U según el manual) — no dejes que texto, botones o imágenes invadan ese margen.
- **Nunca**: cambies los colores del logo, apliques sombras/efectos/brillos, deformes sus proporciones (mantené siempre el aspect ratio), ni lo redimensiones de forma no proporcional.
- El nombre comercial a mostrar en el sitio es **"AR IT Services"**. La razón social **"AR Consultores SRL"** va solo en el footer, junto a los datos legales.


---


## 3. Dirección de diseño (síntesis de 3 conceptos ya validados)


Ya exploramos tres direcciones de diseño distintas y la aprobación fue: **combinar lo mejor de las tres** en un solo sitio cohesivo. Concretamente:


1. **Base visual — minimalista y editorial** (de la dirección "Minimalista SaaS"): fondo predominantemente blanco, tipografía grande y protagonista, mucho espacio en blanco, un solo CTA claro por sección, sin saturar de tarjetas o iconos. Esta es la piel general del sitio.


2. **Densidad de prueba y credibilidad enterprise** (de la dirección "Corporativo Global"): una franja de métricas destacadas tipo dashboard (25+ años, 2.000+ proyectos, 3 países, 2M+ horas-hombre) superpuesta al cierre del hero; casos de éxito con formato storytelling (cliente / desafío / resultado); sección de "stack tecnológico" con logos reales.


3. **Un momento de marca oscuro e interactivo** (de la dirección "AI-Native Dark Tech"): en vez de que todo el sitio sea oscuro, reservá **una sola sección** con fondo `#232234` (no negro puro) como el "momento de firma" del sitio: un **widget interactivo de armado de equipos**. El visitante elige disciplinas (ej. ".NET & React", "Data & Power BI", "QA & Testing", "Scrum Master", "Mobile", "DevOps & n8n", "Project Manager") tocando chips, y ve en tiempo real cómo se arma su equipo ideal (tarjetas con rol + cantidad sugerida). Esto conecta directo con el diferencial real de la empresa: "armamos el equipo exacto que tu proyecto necesita". Usá acentos monoespaciados (font-mono de Tailwind) para las etiquetas tipo "// selecciona las disciplinas" en esta sección únicamente, para darle un aire técnico sin convertir todo el sitio en "modo oscuro".


El resultado debe sentirse como un sitio corporativo prolijo y confiable (no una demo de IA genérica), con un solo momento sorpresa que la gente recuerde y quiera mostrar a colegas.


---


## 4. Por qué estas decisiones (contexto de investigación — no lo muestres en el sitio, es para que entiendas el criterio)


Relevamos los sitios de Santex, Accenture, Globant, DICSYS.ai y Vates (hoy absorbida por EPAM). Hallazgos que este sitio debe capitalizar:


- Los competidores mejor posicionados comunican **IA/agentes como eje del mensaje desde el hero**, no como un servicio más al final. AR IT Services debe mencionar IA aplicada (ciencia de datos, IA en el flujo de trabajo del equipo) desde el primer scroll, sin sonar a "IA por moda".
- **Métricas de impacto grandes y visuales** (años, proyectos, países) generan confianza inmediata — está ausente hoy en el sitio actual de AR.
- **Casos de éxito con nombre real de cliente** (Claro, Dirección de Inteligencia Fiscal de Córdoba) son más creíbles que las referencias genéricas de la competencia más débil.
- **Formularios de contacto que califican el lead** (industria, tipo de proyecto) superan al formulario genérico de "nombre/email/mensaje".
- Un competidor directo de Córdoba (Vates) fue absorbido por un player global (EPAM) y perdió su identidad propia — refuerza la importancia de una marca fuerte y diferenciada, que es justamente lo que este rediseño busca lograr.


---


## 5. Estructura de la home (en este orden)


### 5.1 Header (sticky)
Logo a la izquierda (con área de seguridad respetada) — menú: Servicios, Casos de éxito, Nosotros, Carreras — botón CTA a la derecha "Hablemos" en rojo primario. Selector de idioma ES/EN visible (aunque el contenido inicial esté solo en español).


### 5.2 Hero
Titular grande (tipografía display), mensaje que combine propuesta de valor + mención de IA aplicada. Ejemplo de tono (podés mejorarlo): *"Armamos el equipo exacto que tu producto necesita — con datos e IA en el flujo, no como promesa."* Subtítulo con los 25 años + 3 países. Dos CTAs: primario "Hablemos de tu proyecto" (rojo), secundario "Ver casos de éxito" (outline).


### 5.3 Franja de métricas
4 números grandes: **25+** años de trayectoria · **2.000+** proyectos entregados · **3** países con oficina propia · **2M+** horas-hombre en proyectos con Claro. Card blanca con sombra, ligeramente superpuesta al borde inferior del hero.


### 5.4 Servicios (grid de 6)
Desarrollo Web & Mobile (.NET, React, iOS, Android) · Ciencia de Datos & BI (modelos predictivos, Power BI) · QA & Testing · Equipos dedicados & Scrum · Automatización (n8n, DevOps) · Consultoría & Project Management.


### 5.5 Sección firma — Armado de equipo interactivo
Fondo `#232234`. El widget descripto en el punto 3. Incluir un CTA final dentro del panel: "Agendar una llamada con tu equipo propuesto".


### 5.6 Casos de éxito
2 casos con storytelling: (1) Detección de fraude fiscal con Machine Learning junto a la Dirección de Inteligencia Fiscal de Córdoba. (2) +2.000 proyectos y 2M+ horas-hombre con Claro en toda LATAM.


### 5.7 Stack tecnológico
Logos/etiquetas reales: .NET, React, TypeScript, Angular, Python, Node.js, Swift, Kotlin, Power BI, n8n, AWS/Azure/GCP, Jira.


### 5.8 Nuestra gente (citas de socios)
4 tarjetas con foto (placeholder), nombre, cargo y una frase corta:
- Felix Melinsky — Fundador & Presidente
- Jose Romanutti — Socio & CEO
- Adrián Ferrari — Socio & Director de Operaciones
- Constanza Giordano — Directora de Talento


### 5.9 CTA final
Banda con fondo rojo o tinta, mensaje "¿Armamos el equipo que tu proyecto necesita?" + botón a formulario de contacto.


### 5.10 Formulario de contacto (calificado)
Campos: nombre, email, empresa, país, tipo de proyecto (select: Desarrollo web/mobile, Data & BI, Staffing/equipo dedicado, Otro), mensaje. Botón "Enviar consulta".


### 5.11 Footer
Logo (versión negativa si el fondo es oscuro), oficinas (Dallas · Córdoba · Asunción con direcciones), links a Servicios/Casos/Carreras, redes (LinkedIn, Instagram, WhatsApp), y línea legal: "© 2026 AR Consultores SRL".


---


## 6. Tono de voz


Directo, humano, sin jerga corporativa vacía. Evitar frases genéricas tipo "soluciones innovadoras a medida". Preferir verbos activos y específicos ("armamos", "entregamos", "medimos") sobre sustantivos abstractos. El copy debe sonar a una empresa que hace el trabajo, no a una que solo lo promociona.


---


## 7. Requisitos técnicos


- Totalmente responsive (mobile, tablet, desktop).
- Accesibilidad: contraste AA mínimo, focus visible en todos los elementos interactivos, textos alternativos en imágenes.
- Animaciones de scroll sutiles (fade/slide al entrar en viewport) — sin exagerar, nada de efectos que se sientan "genéricos de IA".
- El widget de armado de equipo debe ser completamente funcional en el frontend (estado en React, sin necesidad de backend para esta v1).
- Dejá los textos de servicios, casos y stack fácilmente editables (como constantes o arrays al inicio del componente) para poder iterarlos rápido.


---


## 8. Qué evitar


- No uses ningún color fuera de la paleta oficial.
- No generes un logo nuevo ni modifiques el existente — vas a recibir los archivos.
- No copies literalmente el diseño de Accenture, Globant, Santex o DICSYS — usalos solo como referencia de tendencia, no de imitación.
- No hagas que todo el sitio sea modo oscuro — el modo oscuro es exclusivo de la sección de armado de equipo.
- No inventes clientes, cifras o casos de éxito que no estén en este prompt.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://ar-talent-forge.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/19579825-293c-43fb-9db9-77e5fe34669d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

### Avisos de AR Recruiting

`/trabaja-con-nosotros` y `/aviso/:id` no tienen las vacantes hardcodeadas: las bajan
del feed público del proyecto de AR Recruiting (`GET /api/busquedas` y
`GET /api/busquedas/:id`). Para que funcione en local, el recruit tiene que estar
levantado y el sitio pegarle a su URL:

```sh
# server-only, sin prefijo VITE_ (nunca al bundle del cliente).
# Default: http://localhost:8080
AVISOS_API_URL=http://localhost:8080

# Clave compartida con AR Recruiting (allá se llama PUBLIC_SITE_API_KEY). El feed responde
# 401 sin ella. Se manda como header x-site-key desde el servidor; nunca va al bundle.
AVISOS_API_KEY=
```

El fetch se hace **desde el servidor** (server functions), no desde el browser: por
eso el sitio no necesita CORS ni que su origen esté en el `PUBLIC_SITE_ORIGINS` del
otro proyecto, y las vacantes llegan en el HTML del SSR.

Si el feed no responde, la página de vacantes muestra un estado de error con botón
de reintento (no un 500). Un aviso que se cubre, se oculta o se cierra desaparece
solo del listado y su detalle da 404.

El origen no manda webhooks ni caché: la ruta re-pega contra el feed en cada visita,
así que un recargar muestra los cambios en `vacantes_disponibles`. Si el feed no
responde, el botón "Reintentar" del estado de error re-pega sin salir de la página.
