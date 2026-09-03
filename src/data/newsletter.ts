/**
 * Contenido del boletín mensual de novedades de IA.
 * Solo en español (contenido editorial, no forma parte del i18n del sitio).
 *
 * Nota: la fuente original (boletín interno de gestión) incluye una sección
 * final con ideas de producto para uso interno de AR Consultores. Esa
 * sección se excluye deliberadamente de esta versión pública.
 */

export type TimelineItem = { tag: string; title: string; body: string[] };
export type PullQuote = { heading: string; body: string };

export type NewsletterSection =
  | {
      kind: "headlines";
      number: string;
      heading: string;
      intro: string;
      items: { n: string; title: string; body: string }[];
    }
  | {
      kind: "timeline";
      number: string;
      heading: string;
      intro: string;
      items: TimelineItem[];
      pullQuote?: PullQuote;
    }
  | {
      kind: "dev";
      number: string;
      heading: string;
      intro: string;
      paragraph: string;
      bulletsHeading: string;
      bullets: { lead: string; text: string }[];
      pullQuote: PullQuote;
      sidebarHeading: string;
      sidebarBody: string;
    }
  | {
      kind: "glossary";
      number: string;
      heading: string;
      intro: string;
      paragraph: string;
      items: { title: string; body: string }[];
      pullQuote: PullQuote;
    }
  | {
      kind: "regions";
      number: string;
      heading: string;
      intro: string;
      items: { region: string; body: string }[];
      pullQuote: PullQuote;
    };

export type NewsletterIssue = {
  slug: string;
  kicker: string;
  title: string;
  subtitle: string;
  description: string;
  closingDate: string;
  podcast?: { title: string; spotifyEpisodeId: string };
  editorial: { heading: string; body: string; calloutHeading: string; calloutBody: string };
  sections: NewsletterSection[];
  sourcesHeading: string;
  sources: string[];
  closingNote: string;
};

export const NEWSLETTER_ISSUE: NewsletterIssue = {
  slug: "julio-2026",
  kicker: "Boletín informativo",
  title: "Julio 2026",
  subtitle: "Novedades de inteligencia artificial y tecnología",
  description:
    "Una recorrida por los anuncios, herramientas y conversaciones que marcaron el mes.",
  closingDate: "Fecha de cierre: 31 de julio de 2026 · Córdoba, Argentina",
  podcast: {
    title: "La IA pasa de chatear a ejecutar",
    spotifyEpisodeId: "2ZAp8EpR2XsyjW3y2EaM0H",
  },
  editorial: {
    heading: "Nota editorial",
    body: "Julio fue un mes especialmente activo para la inteligencia artificial. Más que un único lanzamiento dominante, se observó una sucesión de anuncios que muestran cómo la tecnología se está integrando en el trabajo cotidiano: asistentes que usan herramientas, agentes que completan tareas, modelos más económicos, nuevas formas de programar y una conversación cada vez más seria sobre seguridad y control.",
    calloutHeading: "Cómo leer este boletín",
    calloutBody:
      "El documento está pensado como una actualización general y accesible. Presenta las novedades principales del mes y las organiza por tema.",
  },
  sections: [
    {
      kind: "headlines",
      number: "01",
      heading: "Julio en una mirada",
      intro: "Siete titulares ayudan a entender el movimiento general del mes.",
      items: [
        {
          n: "01",
          title: "La IA empezó a trabajar por objetivos",
          body: "Los productos más nuevos dejaron de limitarse a responder preguntas y comenzaron a combinar archivos, navegador, herramientas y memoria para completar tareas de varios pasos.",
        },
        {
          n: "02",
          title: "Aparecieron nuevas familias de modelos",
          body: "OpenAI, Anthropic, Google, Mistral, Qwen y DeepSeek actualizaron su oferta con modelos pensados para distintos niveles de razonamiento, velocidad y costo.",
        },
        {
          n: "03",
          title: "El desarrollo de software se volvió más agéntico",
          body: "Codex, Claude Code, GitHub Copilot y otras herramientas avanzaron hacia flujos donde una tarea puede transformarse en código, pruebas y un pull request para revisión.",
        },
        {
          n: "04",
          title: "MCP ganó peso como estándar de conexión",
          body: "La evolución del Model Context Protocol mostró un ecosistema más orientado a conectar asistentes con aplicaciones, datos y herramientas de forma interoperable.",
        },
        {
          n: "05",
          title: "La seguridad pasó al centro de la conversación",
          body: "Los incidentes y las nuevas guías de gobernanza recordaron que un agente con permisos puede provocar más daño que una respuesta incorrecta.",
        },
        {
          n: "06",
          title: "RRHH siguió siendo uno de los rubros más observados",
          body: "El mercado avanzó con sourcing y screening asistidos, informes automáticos y onboarding, mientras se reforzó la necesidad de conservar la decisión humana.",
        },
        {
          n: "07",
          title: "Córdoba mostró movimiento en adopción y formación",
          body: "Programas como HackIA, el ecosistema tecnológico y la oferta educativa local confirmaron que la conversación sobre IA ya llegó a pymes, universidades y organismos públicos.",
        },
      ],
    },
    {
      kind: "timeline",
      number: "02",
      heading: "Nuevos modelos y asistentes",
      intro:
        "Los grandes laboratorios ampliaron sus familias de productos y empezaron a diferenciarlas por tipo de tarea.",
      items: [
        {
          tag: "8-10 JUL · ANUNCIO OFICIAL",
          title: "OpenAI presentó GPT-5.6 y ChatGPT Work",
          body: [
            "La familia GPT-5.6 apareció organizada en variantes con distintos niveles de capacidad y costo. El anuncio estuvo acompañado por ChatGPT Work, una experiencia orientada a tareas profesionales sobre archivos, aplicaciones, navegador y escritorio.",
            "La novedad más visible fue el cambio de lenguaje: el producto ya no se presenta solamente como un chat, sino como un espacio capaz de investigar, actuar y generar entregables completos.",
          ],
        },
        {
          tag: "30 JUN / JULIO · CONTEXTO DEL MES",
          title: "Anthropic impulsó Claude Sonnet 5",
          body: [
            "Claude Sonnet 5 llegó al inicio del período como una opción centrada en programación, uso de herramientas y tareas agénticas. Durante julio continuó ganando presencia en comparaciones prácticas y flujos de desarrollo.",
            "La conversación alrededor del modelo se concentró en la relación entre calidad, velocidad y costo, y no únicamente en la posición obtenida en un benchmark.",
          ],
        },
        {
          tag: "21 JUL · ANUNCIO OFICIAL",
          title: "Google amplió la familia Gemini Flash",
          body: [
            "Google anunció Gemini 3.6 Flash y 3.5 Flash-Lite, con énfasis en latencia, eficiencia y procesamiento de alto volumen. La compañía también siguió desarrollando capacidades de computer use para navegador, móvil y escritorio.",
            "Estas versiones reflejan una tendencia general: reservar los modelos más costosos para tareas difíciles y utilizar modelos rápidos para clasificación, extracción y automatizaciones repetitivas.",
          ],
        },
        {
          tag: "JULIO · VARIOS ANUNCIOS",
          title: "Mistral, Qwen y DeepSeek actualizaron sus ecosistemas",
          body: [
            "Mistral presentó nuevas versiones de modelos de razonamiento y herramientas para bibliotecas documentales. Qwen amplió su propuesta de generación de imágenes, mientras DeepSeek completó cambios de nombres y compatibilidad dentro de su API.",
            "Los anuncios asiáticos y europeos mantuvieron la presión sobre precios, licencias y alternativas abiertas o de menor costo.",
          ],
        },
      ],
    },
    {
      kind: "timeline",
      number: "03",
      heading: "Agentes, automatización y nuevas conexiones",
      intro: "Julio mostró cómo los modelos empiezan a formar parte de sistemas más amplios.",
      items: [
        {
          tag: "22 JUL · ANUNCIO OFICIAL",
          title: "OpenAI Presence llevó los agentes a conversaciones empresariales",
          body: [
            "Presence fue presentado como una propuesta para crear agentes de voz y chat conectados con procesos reales. El enfoque combina modelos, políticas, herramientas autorizadas, evaluaciones y reglas de escalamiento a personas.",
            "El anuncio ilustró una idea que se repitió durante todo el mes: un agente no es solamente el modelo que conversa, sino también el conjunto de permisos, datos y acciones que lo rodean.",
          ],
        },
        {
          tag: "8-9 JUL · PRODUCTO Y PLATAFORMA",
          title: "n8n puso el foco en agentes capaces de crear workflows",
          body: [
            "n8n continuó acercando la automatización agéntica a usuarios técnicos y de negocio. Entre las novedades del mes apareció un asistente orientado a crear, probar y corregir workflows a partir de instrucciones en lenguaje natural.",
            "En paralelo, la documentación y la conversación técnica de la plataforma se concentraron en memoria, contexto, manejo de errores, costos y seguridad de credenciales.",
          ],
        },
        {
          tag: "28 JUL · ESPECIFICACIÓN TÉCNICA",
          title: "MCP avanzó hacia una arquitectura stateless",
          body: [
            "La actualización del Model Context Protocol adoptó un núcleo sin sesión persistente a nivel de protocolo. El cambio busca facilitar el despliegue sobre infraestructura web estándar y mejorar la interoperabilidad entre asistentes y herramientas.",
            "GitHub y otras plataformas anticiparon compatibilidad con esta evolución, mostrando que MCP empieza a convertirse en una pieza habitual del ecosistema de agentes.",
          ],
        },
        {
          tag: "17-23 JUL · CHANGELOG OFICIAL",
          title: "GitHub añadió más medición y controles",
          body: [
            "GitHub incorporó métricas de Copilot a nivel de repositorio, mayor visibilidad de créditos y controles para automatizaciones. Estas funciones acompañan la expansión del agente de programación y del uso de herramientas desde Visual Studio Code.",
            "La administración del consumo y de los permisos pasó a ocupar un lugar tan visible como las capacidades de generación de código.",
          ],
        },
      ],
    },
    {
      kind: "dev",
      number: "04",
      heading: "El desarrollo de software cambió de ritmo",
      intro:
        "La conversación de julio se concentró en delegar tareas completas sin retirar la revisión técnica.",
      paragraph:
        "Las herramientas de programación asistida dejaron de aparecer únicamente como autocompletado. Los flujos más recientes pueden leer una tarea, explorar un repositorio, modificar archivos, ejecutar pruebas, usar un navegador y preparar un pull request. Esta forma de trabajo fue visible en GitHub Copilot, Codex, Claude Code, Cursor, OpenCode y otros asistentes.",
      bulletsHeading: "Temas que se repitieron durante el mes",
      bullets: [
        {
          lead: "Issues que terminan en pull requests.",
          text: "Los agentes pueden recibir una tarea, preparar cambios y dejar el resultado listo para revisión humana.",
        },
        {
          lead: "Pruebas con navegador.",
          text: "Las herramientas de computer use permiten recorrer aplicaciones web y detectar problemas de interfaz o funcionamiento.",
        },
        {
          lead: "Ruteo entre modelos.",
          text: "Los entornos de desarrollo empiezan a elegir modelos distintos según costo, dificultad y velocidad.",
        },
        {
          lead: "Contexto y memoria.",
          text: "La calidad depende cada vez más de cómo se organiza la información del proyecto y no solamente del prompt inicial.",
        },
        {
          lead: "Deuda técnica generada por IA.",
          text: "La comunidad empezó a prestar más atención al código que funciona en una demo pero resulta difícil de mantener.",
        },
        {
          lead: "Evaluación propia.",
          text: "Los benchmarks ayudan a orientarse, pero los equipos necesitan probar herramientas sobre sus repositorios y tareas reales.",
        },
      ],
      pullQuote: {
        heading: "Del código escrito línea por línea al trabajo supervisado",
        body: "El cambio no elimina la necesidad de programación. Desplaza parte del esfuerzo hacia la definición del requerimiento, la revisión del resultado, el control de arquitectura, la seguridad y la validación de pruebas.",
      },
      sidebarHeading: "La conversación entre desarrolladores",
      sidebarBody:
        "En canales y comunidades tecnológicas se compararon GPT-5.6, Claude, Gemini y modelos chinos; también crecieron los contenidos sobre IA local, Linux, MCP, costos de tokens y programación por voz. El interés dejó de estar únicamente en «qué modelo responde mejor» y se trasladó a «qué herramienta permite trabajar mejor durante varias horas».",
    },
    {
      kind: "timeline",
      number: "05",
      heading: "Seguridad, control y regulación",
      intro:
        "Cuanto más puede hacer un agente, más importante se vuelve saber qué hizo y con qué permisos.",
      items: [
        {
          tag: "21-23 JUL · INCIDENTE CONFIRMADO",
          title: "El incidente de Hugging Face puso el tema en primer plano",
          body: [
            "Hugging Face informó un incidente ocurrido durante una evaluación con un agente autónomo. La organización rotó credenciales, reconstruyó componentes y reforzó controles. OpenAI publicó luego información adicional sobre la evaluación.",
            "El caso se convirtió en uno de los ejemplos más comentados del mes porque mostró que una secuencia de acciones puede ser más difícil de controlar que una respuesta aislada.",
          ],
        },
        {
          tag: "JULIO · TENDENCIA TÉCNICA",
          title: "La seguridad empezó a mirar trayectorias completas",
          body: [
            "Laboratorios y organismos técnicos reforzaron conceptos como sandboxing, permisos mínimos, monitoreo, aprobación humana, rollback y capacidad de detener ejecuciones.",
            "También ganó relevancia la prompt injection indirecta: instrucciones ocultas en páginas, correos o documentos que intentan modificar el comportamiento del agente.",
          ],
        },
        {
          tag: "JULIO · REGULACIÓN",
          title: "Europa avanzó con obligaciones de transparencia",
          body: [
            "Las guías europeas detallaron cuándo debe informarse que una persona interactúa con IA o que un contenido fue generado o manipulado. Los sistemas utilizados en empleo continúan bajo un nivel de atención regulatoria elevado.",
            "Aunque el marco europeo no sea la normativa directa de una consultora argentina, se convirtió en una referencia internacional para documentación, trazabilidad y supervisión humana.",
          ],
        },
      ],
      pullQuote: {
        heading: "La idea central del mes",
        body: "Un sistema seguro necesita algo más que un buen modelo: identidad propia para el agente, acceso limitado, registro de acciones, revisión de operaciones sensibles y una forma clara de detener o revertir el proceso.",
      },
    },
    {
      kind: "glossary",
      number: "06",
      heading: "Recursos Humanos y trabajo aumentado",
      intro:
        "El mercado siguió explorando cómo reducir tareas repetitivas sin automatizar por completo las decisiones sobre personas.",
      paragraph:
        "Durante julio continuaron apareciendo productos y estudios sobre sourcing, screening, matching, entrevistas, informes y onboarding. Las propuestas más maduras se concentraron en ordenar información, resumir perfiles, preparar preguntas, detectar faltantes y ayudar a documentar el proceso.",
      items: [
        {
          title: "Sourcing",
          body: "Búsquedas asistidas, generación de palabras clave y mensajes personalizados.",
        },
        {
          title: "Screening",
          body: "Resumen de CV, extracción de experiencia y comparación con requisitos visibles.",
        },
        {
          title: "Entrevistas",
          body: "Guiones, toma de notas, síntesis y preparación de preguntas de seguimiento.",
        },
        {
          title: "Informes",
          body: "Redacción estructurada de perfiles y comparación entre candidatos.",
        },
        {
          title: "Onboarding",
          body: "Preguntas frecuentes, checklists, recordatorios y navegación documental.",
        },
        {
          title: "Gestión documental",
          body: "Clasificación de archivos, detección de faltantes y alertas de vencimiento.",
        },
        {
          title: "Capacitación",
          body: "Tutores, materiales adaptados y formación práctica para equipos.",
        },
      ],
      pullQuote: {
        heading: "Un punto que se mantuvo estable",
        body: "Los estudios y marcos regulatorios siguieron favoreciendo un enfoque híbrido: la IA puede asistir, ordenar y explicar, mientras la evaluación final y las decisiones sensibles permanecen en manos humanas.",
      },
    },
    {
      kind: "timeline",
      number: "07",
      heading: "Argentina y Córdoba",
      intro: "La agenda local combinó formación, programas de adopción y búsqueda de aplicaciones concretas.",
      items: [
        {
          tag: "17 JUL · ECOSISTEMA LOCAL",
          title: "HackIA 2026 volvió a reunir pymes y casos de uso",
          body: [
            "ProCórdoba y organizaciones del ecosistema anunciaron una nueva edición de HackIA con actividades en Córdoba, Río Cuarto, San Francisco y Villa María.",
            "El programa refleja una etapa de adopción más práctica: las empresas empiezan a identificar procesos donde la IA puede incorporarse de manera concreta.",
          ],
        },
        {
          tag: "JULIO · POLÍTICA Y MERCADO",
          title: "La Economía del Conocimiento mantuvo líneas vinculadas con IA",
          body: [
            "Las convocatorias y programas nacionales continuaron incluyendo inteligencia artificial, software y proyectos asociativos dentro de la agenda de innovación.",
            "Estas iniciativas conviven con un mercado privado que busca perfiles híbridos de datos, automatización, desarrollo y conocimiento del negocio.",
          ],
        },
        {
          tag: "JULIO · FORMACIÓN",
          title: "Universidades y organizaciones ampliaron la formación",
          body: [
            "La UNC, la UNVM y otras instituciones de Córdoba continuaron ofreciendo cursos, diplomaturas y carreras vinculadas con inteligencia artificial, datos y aplicaciones sectoriales.",
            "La oferta educativa acompaña una demanda creciente de alfabetización, capacitación profesional y actualización para equipos no técnicos.",
          ],
        },
        {
          tag: "JULIO · SEÑAL SECTORIAL",
          title: "Los sectores productivos aparecieron como terreno de aplicación",
          body: [
            "Agroindustria, automotriz, metalmecánica, salud, educación, turismo, logística, construcción y servicios profesionales comparten procesos intensivos en documentos, consultas y coordinación.",
            "La conversación local se concentró menos en desarrollar modelos propios y más en utilizar herramientas existentes para resolver esos procesos.",
          ],
        },
      ],
    },
    {
      kind: "regions",
      number: "08",
      heading: "Qué discutió la comunidad tecnológica",
      intro:
        "Los creadores y desarrolladores ayudaron a mostrar cómo se vive la tecnología fuera de los anuncios oficiales.",
      items: [
        {
          region: "España",
          body: "Los canales hispanohablantes se concentraron en agentes de código, Claude Code, Codex, Cursor, OpenCode, Linux e IA local. La pregunta dominante fue cómo cambia el trabajo del programador y qué nuevas habilidades necesita para supervisar herramientas que producen código.",
        },
        {
          region: "Estados Unidos",
          body: "La conversación fue más acelerada y competitiva: comparaciones de modelos, startups, lanzamientos, controversias y nuevas funciones en productos de consumo. Los creadores técnicos también dedicaron espacio a la calidad real del código y a los costos de utilizar agentes durante jornadas completas.",
        },
        {
          region: "Japón",
          body: "Los contenidos japoneses mostraron aplicaciones paso a paso, programación controlada por voz, herramientas de productividad, backups y seguridad. La integración gradual dentro de procesos existentes tuvo más protagonismo que los titulares sobre reemplazo de empleos.",
        },
        {
          region: "China",
          body: "La conversación china tuvo un fuerte componente de chips, memoria, baterías, AI PC, modelos locales y dispositivos inteligentes. El foco estuvo en dónde corre la IA, cuánto consume, cuánto cuesta y qué parte de la tecnología puede producirse localmente.",
        },
      ],
      pullQuote: {
        heading: "Cómo interpretar estas conversaciones",
        body: "Los creadores no reemplazan a las fuentes oficiales, pero permiten detectar qué herramientas se prueban en la práctica, qué problemas aparecen después del lanzamiento y qué temas empiezan a llamar la atención de desarrolladores y usuarios.",
      },
    },
  ],
  sourcesHeading: "Fuentes principales consultadas",
  sources: [
    "OpenAI",
    "Anthropic",
    "Google AI",
    "GitHub Changelog",
    "Mistral",
    "n8n",
    "MCP",
    "NIST",
    "Unión Europea",
    "ProCórdoba",
  ],
  closingNote:
    "Cierre editorial: 31 de julio de 2026. Este boletín sintetiza las investigaciones realizadas durante el mes y presenta las novedades en un formato informativo. Las descripciones de capacidades comerciales se basan en anuncios de proveedores y deben leerse como información publicada por cada organización.",
};
