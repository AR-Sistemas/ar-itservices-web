import type { Lang } from "./language";
import { isIntermedio } from "@/lib/site-mode";
import { isNewBadgeActive } from "@/lib/event-banner";
import { getPublicSolutionSlug } from "@/lib/solution-slugs";

export type NavChild = { label: string; href: string; hint: string };

/**
 * Ítem del menú. `children` arma un panel desplegable (hoy solo "Soluciones",
 * lo completa getContent con los productos) y `badge` una etiqueta chica al lado.
 */
export type NavItem = {
  label: string;
  href: string;
  badge?: string;
  children?: NavChild[];
};

export type ServiceItem = {
  title: string;
  desc: string;
  cta: string;
  href: string;
};

export type ServiceGroup = {
  id: string;
  label: string;
  items: ServiceItem[];
};

export type SolutionProduct = {
  id: "aria" | "ario" | "meetingmate" | "sdd";
  name: string;
  /** Clasificación que se muestra como etiqueta en la tarjeta: marco de trabajo o producto. */
  kind: "framework" | "product";
  /** Título y descripción de la cabecera de la ficha. */
  tagline: string;
  short: string;
  /** Título y descripción de la tarjeta del home; si faltan, se usan `tagline` y `short`. */
  cardTitle?: string;
  cardDesc?: string;
  /** Texto del problema; los párrafos se separan con una línea en blanco. */
  problem: string;
  /** Sección extra después del problema (ARIA: "Cómo se aplica ARIA"). */
  apply?: { heading: string; body: string };
  /** Texto debajo del título de la sección de pasos. */
  howIntro?: string;
  /** Textos propios de los botones de la cabecera (si faltan: el título de la sección y `solutions.contactCta`). */
  howCta?: string;
  contactCta?: string;
  /** Título propio de la sección "A quién está dirigido". */
  audienceLabel?: string;
  /** Cierre de la ficha con título, texto y un botón que abre el formulario de contacto. */
  closing?: { heading: string; body: string; button: string };
  example?: string;
  steps: string[];
  features: { title: string; desc: string }[];
  audience?: string;
  /** Sobrescribe los títulos de sección de `solutions.labels` (p. ej. ARIA es un framework, no una app). */
  howLabel?: string;
  featuresLabel?: string;
  /** Si está, la CTA de la ficha abre el modal que envía el PDF por mail en vez de ir a #contacto. */
  requestCta?: string;
};

export type ServiceLinkCard = {
  label: string;
  title: string;
  desc: string;
  cta: string;
  href: string;
};

export type SiteContent = {
  nav: NavItem[];
  cta: { talk: string };
  eventBanner: { lead: string; dates: string; stand: string; cta: string; close: string };
  langLabel: string;
  hero: {
    eyebrow: string;
    h1: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    phrases: string[];
  };
  metrics: { value: number; suffix: string; label: string }[];
  services: {
    heading: string;
    hint: string;
    groups: ServiceGroup[];
    inquiryMessage: (area: string, services: string[]) => string;
  };
  cases: {
    heading: string;
    challengeLabel: string;
    resultLabel: string;
    items: { client: string; challenge: string; result: string }[];
  };
  stack: { heading: string; logoAlt: (name: string) => string };
  clients: { heading: string; logoAlt: (name: string) => string };
  newsTeaser: { eyebrow: string; cta: string };
  people: {
    heading: string;
    statement: string;
    ctaLink: string;
    /** Descripción de la página /nosotros (el home usa `statement`). */
    intro: string;
    items: { name: string; role: string; quote: string }[];
    portraitAlt: (name: string) => string;
    careersLink: string;
    years: string;
    yearsLabel: string;
    joinHeading: string;
  };
  contact: {
    heading: string;
    subtitle: string;
    /** Título y bajada según el tipo de formulario: "empresa" usa heading/subtitle. */
    candidateHeading: string;
    candidateSubtitle: string;
    generalHeading: string;
    generalSubtitle: string;
    typeLabels: { company: string; candidate: string; general: string };
    fields: {
      name: string;
      email: string;
      phone: string;
      company: string;
      country: string;
      projectType: string;
      position: string;
      resume: string;
      message: string;
    };
    countries: string[];
    projectOptions: string[];
    submit: string;
    submitting: string;
    success: string;
    error: string;
    /** Borrador del mensaje al postular a un aviso. `{puesto}` = nombre real. */
    applicationDraft: string;
    productLabel: string;
    productRemove: string;
    productMessage: (productName: string) => string;
  };
  solutions: {
    heading: string;
    subtitle: string;
    teaserCta: string;
    cardCta: string;
    navBadge: string;
    jumpLabel: string;
    contactCta: string;
    labels: { problem: string; example: string; how: string; features: string; audience: string };
    logoAlt: (name: string) => string;
    kindLabels: { framework: string; product: string };
    products: SolutionProduct[];
  };
  frameworkModal: {
    requestTitle: (frameworkTitle: string) => string;
    subtitle: string;
    fields: { name: string; email: string; company: string; companyOptional: string };
    submit: string;
    submitting: string;
    footnote: string;
    closeLabel: string;
    successToast: (frameworkTitle: string) => string;
    errorToast: string;
  };
  footer: {
    tagline: string;
    officesHeading: string;
    sectionsHeading: string;
    followHeading: string;
    legal: string;
    offices: { city: string; country: string; address: string }[];
  };
  iso: { certified: string };
  team: {
    eyebrow: string;
    heading: string;
    paragraph: string;
    disciplinesAria: string;
    proposed: string;
    person: string;
    people: string;
    empty: string;
    cta: string;
    /** Mensaje cuando se consulta sin haber elegido ningún perfil. */
    emptyProposalMessage: string;
    proposalMessage: (
      disciplines: string[],
      team: { role: string; qty: number }[],
      total: number,
    ) => string;
    disciplines: {
      id: string;
      label: string;
      roles: { role: string; qty: number }[];
    }[];
  };
  careers: {
    heading: string;
    intro: string;
    positionsHeading: string;
    emptyHeading: string;
    emptyBody: string;
    applyCta: string;
    positionCtaLabel: string;
    applySubmitLabel: string;
    mustHaveLabel: string;
    niceToHaveLabel: string;
    responsibilitiesLabel: string;
    aboutRoleLabel: string;
    filterAllLabel: string;
    filterEmptyMessage: string;
    // Buscador y filtros combinables (área × tecnología × ubicación)
    searchLabel: string;
    searchPlaceholder: string;
    clearSearchLabel: string;
    clearFiltersLabel: string;
    areaFilterLabel: string;
    techFilterLabel: string;
    locationFilterLabel: string;
    /**
     * Contador de resultados. Es una función porque el plural cambia con el
     * número: "1 búsqueda" / "3 búsquedas" / "Sin resultados". Un string con
     * `{n}` no alcanza para el caso 0.
     */
    resultsCount: (n: number) => string;
    // Etiquetas del feed público de avisos (consumido de AR Recruiting)
    detailCtaLabel: string;
    // Solo el estado de error de la lista lo usa: recargar el feed es lo
    // que resuelve un origen caído, y en el caso normal recargar la página
    // ya lo hace.
    refreshLabel: string;
    errorHeading: string;
    errorBody: string;
    vacancyOne: string;
    vacancyMany: string;
    publishedLabel: string;
    englishLevelLabel: string;
    enNoticeHeading: string;
    enNoticeBody: string;
  };
  news: {
    enNoticeHeading: string;
    enNoticeBody: string;
  };
};

const ES: SiteContent = {
  nav: [
    { label: "Soluciones", href: "/soluciones" },
    { label: "Servicios", href: "#servicios" },
    { label: "Casos de éxito", href: "#casos" },
    { label: "Novedades", href: "/novedades" },
    { label: "Nosotros", href: "/nosotros" },
    { label: "Trabajá con nosotros", href: "/trabaja-con-nosotros" },
  ],
  cta: { talk: "Hablemos" },
  eventBanner: {
    lead: "Estamos presentes",
    dates: "12 y 13 de noviembre",
    stand: "[stand_19]",
    cta: "Conocé nuestras soluciones",
    close: "Cerrar aviso",
  },
  langLabel: "Idioma",
  hero: {
    eyebrow: "AR IT Services · Dallas · Córdoba · Asunción",
    h1: "Armamos el equipo exacto que tu producto necesita, con datos e IA en el flujo, no como promesa.",
    subtitle:
      "25 años desarrollando software, modelos de datos y equipos dedicados para empresas y gobiernos, desde tres países.",
    ctaPrimary: "Hablemos de tu proyecto",
    ctaSecondary: "Ver casos de éxito",
    phrases: [
      "Ayudamos a las organizaciones a evolucionar hacia un modelo **AI-Native**, desde la estrategia hasta la implementación.",
      "Creamos el equipo que tu producto realmente necesita, con **datos e IA** integrados en el proceso.",
      "Todo comienza con los datos: convertimos información en **modelos, insights y decisiones** en las que podés confiar.",
    ],
  },
  metrics: [
    { value: 25, suffix: "+", label: "años de trayectoria" },
    { value: 2000, suffix: "+", label: "proyectos entregados" },
    { value: 3, suffix: "", label: "países con oficina propia" },
    { value: 2, suffix: "M+", label: "horas de ingeniería" },
  ],
  services: {
    heading: "Qué hacemos",
    hint: "// elegí un área para ver los servicios",
    groups: [
      {
        id: "ai",
        label: "IA & Agentes",
        items: [
          {
            title: "AI Gateway & Governance",
            desc: "Control centralizado del uso de IA en tu empresa: seguridad de datos, costos por equipo y trazabilidad completa para auditoría.",
            cta: "Conocé más",
            href: "#contacto",
          },
          {
            title: "AI Agents",
            desc: "Agentes que ejecutan tareas y procesos con autonomía, con el nivel de supervisión humana que cada caso de uso requiere.",
            cta: "Conocé más",
            href: "#contacto",
          },
          {
            title: "AI-Native Engineering / MLOps-LLMOps",
            desc: "Arquitectura, CI/CD y componentes reusables para llevar agentes e IA de un piloto a producción de forma sostenible.",
            cta: "Conocé más",
            href: "#contacto",
          },
        ],
      },
      {
        id: "data",
        label: "Datos & Analítica",
        items: [
          {
            title: "Data Architecture & RAG",
            desc: "La base de datos que permite escalar IA más allá de un piloto: RAG, embeddings y datos tratados como producto interno.",
            cta: "Conocé más",
            href: "#contacto",
          },
          {
            title: "Ciencia de Datos & BI",
            desc: "Modelos predictivos, machine learning aplicado y tableros en Power BI que se usan todos los días.",
            cta: "Conocé más",
            href: "#contacto",
          },
        ],
      },
      {
        id: "engineering",
        label: "Ingeniería de Producto",
        items: [
          {
            title: "Desarrollo Web & Mobile",
            desc: ".NET, React, iOS y Android. Productos que salen a producción y se mantienen, con equipos que conocen el negocio del cliente.",
            cta: "Conocé más",
            href: "#contacto",
          },
          {
            title: "QA & Testing",
            desc: "Automatización de pruebas y control de calidad integrado al ciclo de desarrollo.",
            cta: "Conocé más",
            href: "#contacto",
          },
          {
            title: "Automatización & DevOps",
            desc: "Flujos con n8n, pipelines de CI/CD y despliegues repetibles.",
            cta: "Conocé más",
            href: "#contacto",
          },
        ],
      },
      {
        id: "teams",
        label: "Equipos & Gestión",
        items: [
          {
            title: "Equipos dedicados & Scrum",
            desc: "Perfiles seleccionados, on-boarding rápido y ceremonias que se cumplen.",
            cta: "Conocé más",
            href: "#contacto",
          },
          {
            title: "Consultoría & Project Management",
            desc: "Planificamos, medimos y reportamos avance con números, no con impresiones.",
            cta: "Conocé más",
            href: "#contacto",
          },
        ],
      },
    ],
    inquiryMessage: (area, services) =>
      [
        `Hola, me gustaría conocer más sobre el área de ${area}.`,
        "",
        "Servicios que me interesan:",
        ...services.map((s) => `- ${s}`),
        "",
        "Quedo a la espera de que me contacten para conversarlo.",
      ].join("\n"),
  },
  cases: {
    heading: "Casos de éxito",
    challengeLabel: "Desafío",
    resultLabel: "Resultado",
    items: [
      {
        client: "Dirección de Inteligencia Fiscal de Córdoba",
        challenge:
          "Detectar patrones de fraude fiscal sobre grandes volúmenes de datos tributarios sin depender de revisiones manuales.",
        result:
          "Modelos de machine learning en producción que priorizan casos sospechosos y ordenan el trabajo de los equipos de fiscalización.",
      },
      {
        client: "Claro",
        challenge:
          "Sostener una demanda continua de desarrollo y soporte en múltiples países de LATAM con equipos que puedan escalar.",
        result:
          "Más de 2.000 proyectos entregados y 2M+ horas de ingeniería acumuladas trabajando junto a sus equipos en toda la región.",
      },
    ],
  },
  stack: { heading: "Stack con el que trabajamos", logoAlt: (n) => `Logo de ${n}` },
  clients: { heading: "Nuestros clientes", logoAlt: (n) => `Logo de ${n}` },
  newsTeaser: { eyebrow: "Novedades de IA", cta: "Leer boletín completo" },
  people: {
    heading: "Nuestra gente",
    statement:
      "Detrás de cada proyecto hay personas, respaldadas por más de 25 años de experiencia.",
    ctaLink: "Conocé a nuestra gente",
    portraitAlt: (n) => `Retrato de ${n}`,
    careersLink: "Ver vacantes abiertas",
    years: "25+",
    yearsLabel: "años de trayectoria",
    joinHeading: "¿Querés ser parte del equipo?",
    intro:
      "Conocé a las personas que lideran AR IT Services, una empresa con más de 25 años de trayectoria en servicios tecnológicos.",
    items: [
      {
        name: "Felix Melinsky",
        role: "Fundador & Presidente",
        quote:
          "Después de tantos años, sigo creyendo que lo más importante es cumplir con lo que nos comprometemos.",
      },
      {
        name: "Jose Romanutti",
        role: "Socio & CEO",
        quote: "El cliente no compra tecnología: compra un resultado que se pueda medir.",
      },
      {
        name: "Adrián Ferrari",
        role: "Socio & Director de Operaciones",
        quote: "Un equipo bien armado resuelve más que cualquier metodología de moda.",
      },
      {
        name: "Constanza Giordano",
        role: "Directora de Talento",
        quote:
          "Nos interesa lo que una persona sabe hacer, pero también sus ganas de aprender y crecer con otros.",
      },
    ],
  },
  contact: {
    heading: "Contanos tu proyecto",
    subtitle: "",
    candidateHeading: "Sumate al equipo",
    candidateSubtitle:
      "Dejanos tus datos y tu CV: te escribimos cuando haya una búsqueda que encaje con tu perfil.",
    generalHeading: "¿En qué podemos ayudarte?",
    generalSubtitle: "Escribinos y te respondemos a la brevedad.",
    typeLabels: {
      company: "Soy una empresa",
      candidate: "Busco trabajar con ustedes",
      general: "Otra consulta",
    },
    fields: {
      name: "Nombre",
      email: "Email",
      phone: "Teléfono",
      company: "Empresa",
      country: "País",
      projectType: "Tipo de proyecto",
      position: "Puesto de interés",
      resume: "Currículum (PDF o Word)",
      message: "Mensaje",
    },
    countries: [
      "Argentina",
      "Paraguay",
      "Estados Unidos",
      "España",
      "Uruguay",
      "Chile",
      "Brasil",
      "Bolivia",
      "Perú",
      "Colombia",
      "Ecuador",
      "Venezuela",
      "México",
      "Panamá",
      "Costa Rica",
      "Guatemala",
      "Honduras",
      "El Salvador",
      "Nicaragua",
      "República Dominicana",
      "Cuba",
      "Canadá",
      "Reino Unido",
      "Alemania",
      "Francia",
      "Italia",
      "Portugal",
      "Otro",
    ],
    projectOptions: ["Desarrollo web/mobile", "Data & BI", "Staffing / equipo dedicado", "Otro"],
    submit: "Enviar consulta",
    submitting: "Enviando…",
    success: "Gracias. Te vamos a contactar a la brevedad.",
    error: "No pudimos enviar tu mensaje. Probá de nuevo en unos minutos.",
    /**
     * Borrador para el mensaje cuando la postulación viene de un aviso del
     * feed (`?aviso={id}`). `{puesto}` se reemplaza por el nombre real.
     *
     * Es un andamiaje, no un texto cerrado: quien postula lo edita y lo envía
     * como si fuera propio. Va en primera persona y sin pedir datos que el
     * formulario ya pide (nombre, email, CV), para no repetir el formulario
     * dentro del mensaje.
     */
    applicationDraft:
      "Hola,\n\nMe interesa la posición de {puesto}. Soy [nombre] y trabajo con [herramientas] que me parecen un buen match.\n\nAdjunto mi CV y, si les sirve, podemos coordinar una conversación.\n\nGracias,\n[Nombre]",
    productLabel: "Producto de interés",
    productRemove: "Quitar producto",
    productMessage: (productName) =>
      [
        `Hola, me interesa el producto ${productName} y me gustaría conversar sobre mi proyecto.`,
        "",
        "Mi caso es el siguiente:",
        "",
        "Quedo a la espera de que me contacten para conversarlo.",
      ].join("\n"),
  },
  solutions: {
    heading: "Tecnología que se convierte en soluciones concretas",
    subtitle:
      "Desarrollamos productos propios y frameworks para acompañar a las organizaciones en la adopción y el uso efectivo de la inteligencia artificial.",
    teaserCta: "Ver todas las soluciones",
    cardCta: "Conocer más",
    navBadge: "Nuevo",
    jumpLabel: "Ir a una solución",
    contactCta: "Conversemos sobre tu proyecto",
    labels: {
      problem: "El problema",
      example: "Un ejemplo",
      how: "Cómo funciona",
      features: "Qué incluye",
      audience: "A quién está dirigido",
    },
    logoAlt: (n) => `Logo de ${n}`,
    kindLabels: { framework: "Framework", product: "Producto" },
    products: [
      {
        id: "aria",
        name: "ARIA",
        kind: "framework",
        tagline: "Planificá la adopción de IA en tu empresa.",
        short:
          "Un marco de trabajo para definir objetivos, identificar casos de uso, establecer responsables y evaluar resultados durante la incorporación de inteligencia artificial.",
        problem:
          "Incorporar herramientas de inteligencia artificial no significa necesariamente contar con una estrategia para utilizarlas.\n\nCuando las iniciativas se desarrollan de forma aislada, pueden aparecer dificultades para establecer prioridades, gestionar riesgos, preparar a los equipos y evaluar resultados.\n\nARIA permite abordar estas decisiones de manera coordinada, vinculando las iniciativas de IA con los objetivos y las capacidades de cada organización.",
        apply: {
          heading: "Cómo se aplica ARIA",
          body: "ARIA parte de un diagnóstico de la situación actual de la empresa. Se identifican las iniciativas existentes, las oportunidades de aplicación y los aspectos que necesitan atención.\n\nA partir de ese análisis, se priorizan las acciones y se define un plan de trabajo, con responsables, entregables e indicadores de seguimiento.\n\nLos nueve bloques se trabajan de manera coordinada. Su alcance y profundidad se ajustan a las necesidades y al nivel de preparación de cada organización.",
        },
        howLabel: "Los nueve bloques de ARIA",
        howIntro:
          "Una estrategia central y cuatro dimensiones complementarias permiten organizar la adopción de inteligencia artificial.",
        steps: [
          "Definir dónde y para qué utilizar inteligencia artificial.",
          "Establecer reglas y controles para el uso responsable de IA.",
          "Preparar a los equipos para trabajar con inteligencia artificial.",
          "Preparar los datos que necesitan las iniciativas de IA.",
          "Definir cómo desarrollar y mantener soluciones con IA.",
          "Compartir y reutilizar el conocimiento de los equipos.",
          "Evaluar nuevas aplicaciones de IA antes de implementarlas.",
          "Acompañar a las personas durante la incorporación de IA.",
          "Evaluar resultados y mejorar la adopción de IA.",
        ],
        features: [
          {
            title: "EA — Estrategia + IA",
            desc: "Identifica los objetivos empresariales y prioriza las iniciativas de IA según su impacto, esfuerzo y resultados esperados.\n\nDetalle: Incluye el análisis de oportunidades, la definición de responsables y el establecimiento de indicadores para evaluar cada iniciativa.",
          },
          {
            title: "GL — Governance y Límites",
            desc: "Define qué herramientas pueden utilizarse, cómo debe tratarse la información y quiénes son responsables de supervisar su uso.\n\nDetalle: Contempla políticas de uso, clasificación de datos, evaluación de riesgos, controles técnicos y procedimientos ante incidentes.",
          },
          {
            title: "PR — Personas y roles",
            desc: "Identifica las capacidades que necesita cada puesto de trabajo y establece las responsabilidades vinculadas al uso de IA.\n\nDetalle: Incluye el relevamiento de habilidades, la planificación de capacitaciones y la definición de nuevas funciones cuando sean necesarias.",
          },
          {
            title: "DA — Data",
            desc: "Evalúa la disponibilidad, calidad y accesibilidad de la información que se utilizará en los procesos y sistemas de inteligencia artificial.\n\nDetalle: Comprende la organización de fuentes de datos, los criterios de calidad, la trazabilidad y las condiciones de acceso y tratamiento de la información.",
          },
          {
            title: "IN — Ingeniería",
            desc: "Establece prácticas técnicas para diseñar, desarrollar, probar e implementar soluciones de inteligencia artificial.\n\nDetalle: Incluye criterios de arquitectura, integración, evaluación, despliegue y monitoreo de las soluciones desarrolladas.",
          },
          {
            title: "KS — Knowledge sharing",
            desc: "Organiza los aprendizajes y recursos generados durante el uso de IA para que puedan aprovecharse en otros proyectos.\n\nDetalle: Contempla la documentación y el mantenimiento de instrucciones, agentes, componentes y buenas prácticas, con criterios de actualización y reutilización.",
          },
          {
            title: "IC — Innovación controlada",
            desc: "Permite desarrollar pruebas y experimentos con objetivos definidos, recursos delimitados y criterios para evaluar los resultados.\n\nDetalle: Establece condiciones para iniciar, continuar, modificar o descartar iniciativas antes de su incorporación a los procesos habituales.",
          },
          {
            title: "GC — Gestión del cambio",
            desc: "Planifica las acciones necesarias para que los equipos comprendan y adopten los cambios en sus actividades y procesos de trabajo.\n\nDetalle: Incluye comunicación interna, formación, acompañamiento por áreas y seguimiento de la adopción.",
          },
          {
            title: "PM — Perfeccionamiento y madurez",
            desc: "Establece mecanismos de revisión para conocer los avances y adaptar las iniciativas a las necesidades de la organización.\n\nDetalle: Incluye el seguimiento de indicadores, la evaluación de capacidades y la actualización o finalización de iniciativas que dejaron de aportar resultados.",
          },
        ],
        closing: {
          heading: "¿Querés evaluar cómo incorporar IA en tu empresa?",
          body: "Conversemos sobre las iniciativas actuales, las oportunidades de aplicación y los aspectos que conviene abordar primero.",
          button: "Consultar sobre ARIA",
        },
        requestCta: "Descubrí el framework",
      },
      {
        id: "ario",
        name: "ARIO",
        kind: "product",
        tagline: "Tus documentos, convertidos en datos.",
        short:
          "ARIO utiliza inteligencia artificial para extraer y organizar información de distintos documentos, facilitando su uso en planillas y procesos administrativos.",
        cardTitle: "Convertí documentos en datos utilizables.",
        cardDesc:
          "Extrae y organiza información de facturas y otros documentos para que puedas revisarla y utilizarla en tus procesos de trabajo.",
        problem:
          "La carga manual de información de facturas y otros documentos demanda tiempo y requiere revisar cada dato antes de incorporarlo a una planilla o sistema.\n\nARIO permite realizar la extracción de forma automática y revisar los resultados desde un mismo proceso de trabajo.",
        example:
          "Un equipo administrativo recibe 200 facturas de proveedores y necesita registrar los datos de cada comprobante.\n\nEn lugar de copiar manualmente el CUIT, las fechas, los números y los importes, puede cargar los archivos en ARIO, obtener la información organizada y revisar los resultados antes de exportarlos.",
        steps: [
          "Seleccioná uno o varios documentos en formato PDF o imagen y cargalos en ARIO.",
          "Elegí una plantilla disponible o definí qué información necesitás extraer.",
          "ARIO utiliza inteligencia artificial para identificar y extraer los datos solicitados de los documentos.",
          "Revisá la información obtenida y corregí los campos que lo requieran.",
          "Exportá los resultados organizados para utilizarlos en tus procesos de trabajo.",
        ],
        features: [
          {
            title: "Extracción de información",
            desc: "Identifica datos en documentos digitales y archivos escaneados compatibles.",
          },
          {
            title: "Plantillas de documentos",
            desc: "Incluye opciones preconfiguradas para facturas y documentos de identidad.",
          },
          {
            title: "Campos personalizados",
            desc: "Permite definir qué información necesitás extraer según el documento.",
          },
          {
            title: "Procesamiento por lotes",
            desc: "Admite la carga de varios archivos para procesarlos en una misma operación.",
          },
          {
            title: "Revisión de resultados",
            desc: "Permite consultar y corregir los datos extraídos antes de exportarlos.",
          },
          {
            title: "Exportación de datos",
            desc: "Organiza los resultados para su utilización posterior en planillas y otros procesos.",
          },
        ],
        howCta: "Conocer cómo funciona",
        contactCta: "Consultar sobre ARIO",
        audienceLabel: "¿A quién está dirigido?",
        audience:
          "ARIO está pensado para empresas y equipos que necesitan registrar información de manera recurrente a partir de documentos.\n\nPuede aplicarse en tareas administrativas, contables y operativas que requieran extraer, revisar y organizar datos de facturas, comprobantes y otros archivos compatibles.",
      },
      {
        id: "meetingmate",
        name: "MeetingMate",
        kind: "product",
        tagline: "Identificá lo importante durante cada reunión.",
        short:
          "MeetingMate es un asistente de inteligencia artificial que analiza conversaciones y sugiere preguntas, posibles riesgos y acciones mientras la reunión está en curso.",
        cardTitle: "Identificá lo importante de cada reunión.",
        cardDesc:
          "Analiza la conversación y sugiere preguntas, posibles riesgos y acciones mientras el equipo se reúne.",
        problem:
          "Durante una reunión pueden surgir cambios, decisiones y compromisos que no siempre quedan registrados o se revisan a tiempo.\n\nTomar notas y participar de la conversación al mismo tiempo puede resultar difícil. Revisar lo sucedido después permite recuperar información, pero no abordar los temas mientras se están tratando.\n\nMeetingMate ayuda a identificar estas situaciones durante la reunión para que el equipo pueda evaluarlas en el momento.",
        example:
          "Durante una reunión de seguimiento, un cliente menciona que cambió un requisito del proyecto.\n\nMeetingMate puede identificar ese cambio como un posible riesgo y sugerir que el equipo revise su impacto, aclare el alcance y defina los próximos pasos antes de finalizar la reunión.",
        steps: [
          "Prepará la reunión con el objetivo, los participantes y la información de referencia del proyecto.",
          "Iniciá la captura de audio desde el micrófono o la computadora, según el tipo de reunión.",
          "MeetingMate transcribe la conversación y utiliza inteligencia artificial para analizarla con el contexto disponible.",
          "Durante la reunión, muestra sugerencias de preguntas, posibles riesgos y acciones para que el equipo pueda revisarlas.",
          "El equipo puede atender, descartar o reabrir las sugerencias y consultar su historial.",
        ],
        features: [
          {
            title: "Captura en vivo",
            desc: "Registra el audio desde el micrófono o la computadora para analizar reuniones presenciales y virtuales.",
          },
          {
            title: "Identificación de oradores",
            desc: "Organiza las intervenciones por orador para facilitar la revisión de la conversación y su asociación con los participantes.",
          },
          {
            title: "Tarjetas de preguntas, riesgos y acciones",
            desc: "Presenta sugerencias generadas mediante inteligencia artificial durante la reunión, para que el equipo pueda evaluarlas.",
          },
          {
            title: "Contexto del proyecto",
            desc: "Considera los objetivos, participantes y documentos de referencia disponibles para generar sugerencias relacionadas con los temas de la reunión.",
          },
          {
            title: "Seguimiento de sugerencias",
            desc: "Permite consultar el estado y el historial de las sugerencias, así como revisarlas o reabrirlas cuando sea necesario.",
          },
          {
            title: "También con audios grabados",
            desc: "Permite cargar un archivo de audio previamente grabado y obtener su transcripción para revisarla posteriormente.",
          },
        ],
        contactCta: "Consultar sobre MeetingMate",
        audience:
          "MeetingMate está pensado para equipos que realizan reuniones periódicas de planificación, seguimiento y coordinación.\n\nPuede utilizarse en la gestión de proyectos, el desarrollo de software, la consultoría y otras actividades que requieran identificar riesgos, revisar decisiones y coordinar acciones durante las reuniones.",
      },
      {
        id: "sdd",
        name: "CriterIA",
        kind: "framework",
        tagline: "Un criterio compartido para desarrollar con agentes de IA.",
        short:
          "CriterIA propone una forma de trabajo compartida para integrar agentes de inteligencia artificial al desarrollo de software. Junto a cada equipo, se definen criterios de delegación, contexto, revisión y registro de decisiones, según las necesidades del proyecto.",
        cardDesc:
          "Un marco de trabajo para que los equipos definan instrucciones, registren decisiones y establezcan prácticas de revisión al desarrollar software con agentes de inteligencia artificial.",
        problem:
          "Un mismo equipo puede utilizar agentes de IA con instrucciones, referencias y formas de trabajo diferentes.\n\nLos resultados pueden requerir correcciones al integrarse porque no consideran decisiones vigentes, restricciones del proyecto o el trabajo de otros integrantes.\n\nAdemás, parte del conocimiento queda disperso en conversaciones y herramientas, lo que dificulta que otra persona pueda continuar una tarea.",
        steps: [
          "Descubrir: relevamos junto al equipo un caso real, las herramientas que utiliza, sus responsabilidades y las dificultades de su forma de trabajo actual.",
          "Acordar: definimos qué tareas conviene delegar a los agentes, qué contexto compartir, quién revisa los resultados y cómo registrar las decisiones.",
          "Preparar lo necesario: adaptamos instrucciones, referencias y verificaciones a las herramientas existentes. Incorporamos componentes técnicos adicionales solo cuando el proyecto los necesita.",
          "Probar: aplicamos la práctica a tareas acotadas, con criterios de aceptación y revisiones acordadas junto al equipo.",
          "Evaluar y continuar: comparamos calidad, correcciones y esfuerzo total con la práctica anterior. Registramos los aprendizajes para mantener y mejorar la forma de trabajo.",
        ],
        features: [
          {
            title: "Acuerdos y contexto compartido",
            desc: "Definimos con cada equipo qué tareas delegar, qué información utilizar, quién revisa los resultados y cómo conservar las decisiones del proyecto.",
          },
          {
            title: "Agentes, skills y verificaciones",
            desc: "Revisamos las herramientas y los agentes que utiliza el equipo. Ajustamos instrucciones, incorporamos recursos reutilizables y definimos verificaciones según las necesidades del proyecto.",
          },
          {
            title: "Revisión humana proporcional",
            desc: "Establecemos quién revisa y acepta las contribuciones de los agentes, con controles adecuados a la complejidad y al riesgo de cada tarea.",
          },
          {
            title: "Límites y permisos",
            desc: "Acordamos qué acciones pueden realizar los agentes y cuáles requieren autorización. Los permisos efectivos deben aplicarse en las herramientas y servicios correspondientes.",
          },
          {
            title: "Acompañamiento y mejora continua",
            desc: "Probamos la práctica junto al equipo, evaluamos sus resultados y registramos decisiones y aprendizajes para facilitar su continuidad.",
          },
        ],
        audience:
          "CriterIA está orientado a equipos de desarrollo de software que buscan incorporar agentes de inteligencia artificial o mejorar la forma en que ya trabajan con ellos.\n\nPuede aplicarse a equipos internos y de clientes, involucrando a responsables de proyecto, desarrolladores, QA, arquitectura y otras especialidades según las necesidades de cada caso.",
      },
    ],
  },
  frameworkModal: {
    requestTitle: (frameworkTitle) => `Solicitá ${frameworkTitle}`,
    subtitle: "Dejanos tus datos y te mandamos el material completo por mail.",
    fields: {
      name: "Nombre",
      email: "Email",
      company: "Empresa",
      companyOptional: "(opcional)",
    },
    submit: "Solicitar por mail",
    submitting: "Enviando…",
    footnote: "Te va a llegar un mail con el material adjunto en un momento.",
    closeLabel: "Cerrar",
    successToast: (frameworkTitle) => `Listo, te enviamos ${frameworkTitle} por mail.`,
    errorToast: "No pudimos enviar el material. Probá de nuevo en unos minutos.",
  },
  footer: {
    tagline: "Software, datos y equipos dedicados desde 2001.",
    officesHeading: "Oficinas",
    sectionsHeading: "Secciones",
    followHeading: "Seguinos",
    legal: "© 2026 AR IT Services SRL. Todos los derechos reservados.",
    offices: [
      { city: "Dallas", country: "Estados Unidos", address: "Dallas, Texas" },
      { city: "Córdoba", country: "Argentina", address: "Córdoba Capital" },
      { city: "Asunción", country: "Paraguay", address: "Asunción" },
    ],
  },
  iso: { certified: "Certificados" },
  team: {
    eyebrow: "// selecciona las disciplinas",
    heading: "Armá el equipo que tu proyecto necesita",
    paragraph:
      "Seleccioná las especialidades y visualizá una propuesta inicial de equipo. Te ayudamos a definir los perfiles y la cantidad de profesionales según las necesidades y el alcance de tu proyecto.",
    disciplinesAria: "Disciplinas",
    proposed: "// equipo propuesto",
    person: "persona",
    people: "personas",
    empty: "Seleccioná al menos una disciplina para ver tu equipo.",
    cta: "Agendá una reunión para definir tu equipo",
    emptyProposalMessage:
      "Hola, me gustaría conversar sobre armar un equipo para mi proyecto. Todavía no tengo definidos los perfiles: me ayudarían a pensarlos.",
    proposalMessage: (disciplines, team, total) =>
      [
        "Hola, me gustaría agendar una llamada para conversar sobre el siguiente equipo:",
        "",
        `Tecnologías / disciplinas: ${disciplines.join(", ")}`,
        "",
        "Perfiles:",
        ...team.map((m) => `- ${m.role} x${m.qty}`),
        "",
        `Total: ${total} ${total === 1 ? "persona" : "personas"}`,
      ].join("\n"),
    disciplines: [
      {
        id: "dotnet-react",
        label: ".NET & React",
        roles: [
          { role: "Dev .NET Senior", qty: 1 },
          { role: "Dev React", qty: 1 },
        ],
      },
      {
        id: "data-bi",
        label: "Data & Power BI",
        roles: [
          { role: "Data Engineer", qty: 1 },
          { role: "Analista Power BI", qty: 1 },
        ],
      },
      { id: "qa", label: "QA & Testing", roles: [{ role: "QA Automation", qty: 1 }] },
      { id: "scrum", label: "Scrum Master", roles: [{ role: "Scrum Master", qty: 1 }] },
      { id: "mobile", label: "Mobile", roles: [{ role: "Dev iOS / Android", qty: 2 }] },
      {
        id: "devops",
        label: "DevOps & n8n",
        roles: [
          { role: "DevOps Engineer", qty: 1 },
          { role: "Especialista Automatización", qty: 1 },
        ],
      },
      { id: "pm", label: "Project Manager", roles: [{ role: "Project Manager", qty: 1 }] },
    ],
  },
  careers: {
    heading: "Sumate al equipo",
    intro:
      "25 años armando equipos que se quedan. Buscamos gente con ganas de resolver problemas reales, no perfiles que encajen en una grilla.",
    positionsHeading: "Búsquedas abiertas",
    emptyHeading: "Por ahora no tenemos búsquedas puntuales",
    emptyBody:
      "Pero eso cambia seguido. Dejanos tu perfil y te tenemos en cuenta apenas abramos una posición que matchee.",
    applyCta: "Dejanos tu CV",
    positionCtaLabel: "Postularme",
    applySubmitLabel: "Enviar postulación",
    mustHaveLabel: "¿Qué buscamos?",
    niceToHaveLabel: "Valoramos",
    responsibilitiesLabel: "Responsabilidades",
    aboutRoleLabel: "La posición",
    detailCtaLabel: "Ver más",
    filterAllLabel: "Todas",
    filterEmptyMessage: "No hay búsquedas que coincidan con esos filtros.",
    searchLabel: "Buscar búsquedas abiertas",
    searchPlaceholder: "Buscar por puesto, tecnología o ciudad…",
    clearSearchLabel: "Limpiar la búsqueda",
    clearFiltersLabel: "Limpiar filtros",
    areaFilterLabel: "Área",
    techFilterLabel: "Tecnología",
    locationFilterLabel: "Ubicación",
    resultsCount: (n) => (n === 0 ? "Sin resultados" : n === 1 ? "1 búsqueda" : `${n} búsquedas`),
    refreshLabel: "Reintentar",
    errorHeading: "No pudimos cargar las búsquedas",
    errorBody:
      "Estamos teniendo problemas para conectarnos con el sistema de búsquedas. Probá de nuevo en un momento.",
    vacancyOne: "1 vacante disponible",
    vacancyMany: "vacantes disponibles",
    publishedLabel: "Publicada",
    englishLevelLabel: "Inglés requerido",
    enNoticeHeading: "Las búsquedas se publican en español",
    enNoticeBody:
      "Los avisos vienen directo de nuestro sistema de reclutamiento, que los publica en español. Mandanos tu CV en español y te respondemos.",
  },
  news: {
    enNoticeHeading: "Este boletín se publica en español",
    enNoticeBody:
      "Nuestro boletín mensual de IA está escrito para el mercado hispanohablante. Cambiá a ES arriba para leer la última edición.",
  },
};

const EN: SiteContent = {
  nav: [
    { label: "Solutions", href: "/soluciones" },
    { label: "Services", href: "#servicios" },
    { label: "Success stories", href: "#casos" },
    { label: "News", href: "/novedades" },
    { label: "About us", href: "/nosotros" },
    { label: "Work with us", href: "/trabaja-con-nosotros" },
  ],
  cta: { talk: "Let's talk" },
  eventBanner: {
    lead: "We'll be there",
    dates: "November 12–13",
    stand: "[stand_19]",
    cta: "Discover our solutions",
    close: "Close notice",
  },
  langLabel: "Language",
  hero: {
    eyebrow: "AR IT Services · Dallas · Córdoba · Asunción",
    h1: "We build the exact team your product needs, with data and AI in the workflow, not as a promise.",
    subtitle:
      "25 years building software, data models and dedicated teams for companies and governments, from three countries.",
    ctaPrimary: "Let's talk about your project",
    ctaSecondary: "See success stories",
    phrases: [
      "We help organizations become **AI-native companies**, from strategy to implementation and scale.",
      "We build the team your product really needs: **data and artificial intelligence** integrated into the workflow, not just in theory.",
      "Data is where AI begins: we turn raw information into **models, insights, and decisions** you can rely on.",
    ],
  },
  metrics: [
    { value: 25, suffix: "+", label: "years in business" },
    { value: 2000, suffix: "+", label: "projects delivered" },
    { value: 3, suffix: "", label: "countries with our own office" },
    { value: 2, suffix: "M+", label: "engineering hours" },
  ],
  services: {
    heading: "What we do",
    hint: "// pick an area to see the services",
    groups: [
      {
        id: "ai",
        label: "AI & Agents",
        items: [
          {
            title: "AI Gateway & Governance",
            desc: "Centralized control over AI usage in your company: data security, cost per team and full traceability for auditing.",
            cta: "Learn more",
            href: "#contacto",
          },
          {
            title: "AI Agents",
            desc: "Agents that execute tasks and processes autonomously, with the level of human oversight each use case requires.",
            cta: "Learn more",
            href: "#contacto",
          },
          {
            title: "AI-Native Engineering / MLOps-LLMOps",
            desc: "Architecture, CI/CD and reusable components to take agents and AI from pilot to production sustainably.",
            cta: "Learn more",
            href: "#contacto",
          },
        ],
      },
      {
        id: "data",
        label: "Data & Analytics",
        items: [
          {
            title: "Data Architecture & RAG",
            desc: "The data foundation that lets AI scale beyond a pilot: RAG, embeddings and data treated as an internal product.",
            cta: "Learn more",
            href: "#contacto",
          },
          {
            title: "Data Science & BI",
            desc: "Predictive models, applied machine learning and Power BI dashboards used every day.",
            cta: "Learn more",
            href: "#contacto",
          },
        ],
      },
      {
        id: "engineering",
        label: "Product Engineering",
        items: [
          {
            title: "Web & Mobile Development",
            desc: ".NET, React, iOS and Android. Products that ship to production and are maintained, with teams that understand the client's business.",
            cta: "Learn more",
            href: "#contacto",
          },
          {
            title: "QA & Testing",
            desc: "Test automation and quality control integrated into the development cycle.",
            cta: "Learn more",
            href: "#contacto",
          },
          {
            title: "Automation & DevOps",
            desc: "n8n workflows, CI/CD pipelines and repeatable deployments.",
            cta: "Learn more",
            href: "#contacto",
          },
        ],
      },
      {
        id: "teams",
        label: "Teams & Management",
        items: [
          {
            title: "Dedicated teams & Scrum",
            desc: "Hand-picked profiles, fast onboarding and ceremonies that actually happen.",
            cta: "Learn more",
            href: "#contacto",
          },
          {
            title: "Consulting & Project Management",
            desc: "We plan, measure and report progress with numbers, not impressions.",
            cta: "Learn more",
            href: "#contacto",
          },
        ],
      },
    ],
    inquiryMessage: (area, services) =>
      [
        `Hi, I'd like to learn more about your ${area} area.`,
        "",
        "Services I'm interested in:",
        ...services.map((s) => `- ${s}`),
        "",
        "I look forward to hearing from you.",
      ].join("\n"),
  },
  cases: {
    heading: "Success stories",
    challengeLabel: "Challenge",
    resultLabel: "Result",
    items: [
      {
        client: "Córdoba Tax Intelligence Directorate",
        challenge:
          "Detect tax-fraud patterns across large volumes of tax data without relying on manual reviews.",
        result:
          "Machine learning models in production that prioritize suspicious cases and organize the work of the auditing teams.",
      },
      {
        client: "Claro",
        challenge:
          "Sustain continuous development and support demand across multiple LATAM countries with teams that can scale.",
        result:
          "Over 2,000 projects delivered and 2M+ accumulated engineering hours working alongside their teams across the region.",
      },
    ],
  },
  stack: { heading: "The stack we work with", logoAlt: (n) => `${n} logo` },
  clients: { heading: "Our clients", logoAlt: (n) => `${n} logo` },
  newsTeaser: { eyebrow: "AI Newsletter", cta: "Read the full issue" },
  people: {
    heading: "Our people",
    statement: "Behind every project, there are people backed by more than 25 years of experience.",
    ctaLink: "Meet our people",
    portraitAlt: (n) => `Portrait of ${n}`,
    careersLink: "See open positions",
    years: "25+",
    yearsLabel: "years of experience",
    joinHeading: "Want to be part of the team?",
    intro:
      "Meet the people who lead AR IT Services, a company with more than 25 years of experience in technology services.",
    items: [
      {
        name: "Felix Melinsky",
        role: "Founder & President",
        quote:
          "After so many years, I still believe the most important thing is to deliver on what we commit to.",
      },
      {
        name: "Jose Romanutti",
        role: "Partner & CEO",
        quote: "Clients don't buy technology: they buy a result that can be measured.",
      },
      {
        name: "Adrián Ferrari",
        role: "Partner & COO",
        quote: "A well-built team solves more than any trendy methodology.",
      },
      {
        name: "Constanza Giordano",
        role: "Head of Talent",
        quote:
          "We care about what a person knows how to do, but also about their drive to learn and grow with others.",
      },
    ],
  },
  contact: {
    heading: "Tell us about your project",
    subtitle: "",
    candidateHeading: "Join the team",
    candidateSubtitle:
      "Leave us your details and your CV: we'll get in touch when a search matches your profile.",
    generalHeading: "How can we help?",
    generalSubtitle: "Write to us and we'll get back to you shortly.",
    typeLabels: {
      company: "I'm a company",
      candidate: "I'm looking to join the team",
      general: "Other inquiry",
    },
    fields: {
      name: "Name",
      email: "Email",
      phone: "Phone",
      company: "Company",
      country: "Country",
      projectType: "Project type",
      position: "Position of interest",
      resume: "Resume (PDF or Word)",
      message: "Message",
    },
    countries: [
      "Argentina",
      "Paraguay",
      "United States",
      "Spain",
      "Uruguay",
      "Chile",
      "Brazil",
      "Bolivia",
      "Peru",
      "Colombia",
      "Ecuador",
      "Venezuela",
      "Mexico",
      "Panama",
      "Costa Rica",
      "Guatemala",
      "Honduras",
      "El Salvador",
      "Nicaragua",
      "Dominican Republic",
      "Cuba",
      "Canada",
      "United Kingdom",
      "Germany",
      "France",
      "Italy",
      "Portugal",
      "Other",
    ],
    projectOptions: ["Web/mobile development", "Data & BI", "Staffing / dedicated team", "Other"],
    submit: "Send inquiry",
    submitting: "Sending…",
    success: "Thanks. We'll get in touch shortly.",
    error: "We couldn't send your message. Please try again in a few minutes.",
    applicationDraft: `Hi,\n\nI'm interested in the {puesto} position. I'm [name] and I work with [tools] that seem like a good match.\n\nI'm attaching my CV and, if it works for you, we can set up a conversation.\n\nThanks,\n[Name]`,
    productLabel: "Product of interest",
    productRemove: "Remove product",
    productMessage: (productName) =>
      [
        `Hi, I'm interested in the ${productName} product and I'd like to discuss my project.`,
        "",
        "My case is as follows:",
        "",
        "I look forward to hearing from you to discuss it.",
      ].join("\n"),
  },
  solutions: {
    heading: "Technology that turns into concrete solutions",
    subtitle:
      "We develop our own products and frameworks to support organizations in the adoption and effective use of artificial intelligence.",
    teaserCta: "See all solutions",
    cardCta: "Learn more",
    navBadge: "New",
    jumpLabel: "Jump to a solution",
    contactCta: "Let's talk about your project",
    labels: {
      problem: "The problem",
      example: "An example",
      how: "How it works",
      features: "What it includes",
      audience: "Who it's for",
    },
    logoAlt: (n) => `${n} logo`,
    kindLabels: { framework: "Framework", product: "Product" },
    products: [
      {
        id: "aria",
        name: "ARIA",
        kind: "framework",
        tagline: "Plan AI adoption in your company.",
        short:
          "A framework to define objectives, identify use cases, assign owners and evaluate results while artificial intelligence is brought into the company.",
        problem:
          "Adopting artificial intelligence tools does not necessarily mean having a strategy for using them.\n\nWhen initiatives are developed in isolation, it can become hard to set priorities, manage risks, prepare teams and evaluate results.\n\nARIA makes it possible to address these decisions in a coordinated way, linking AI initiatives with each organization's goals and capabilities.",
        apply: {
          heading: "How ARIA is applied",
          body: "ARIA starts with a diagnosis of the company's current situation. Existing initiatives, opportunities for application and areas that need attention are identified.\n\nBased on that analysis, actions are prioritized and a work plan is defined, with owners, deliverables and follow-up indicators.\n\nThe nine blocks are worked on in a coordinated way. Their scope and depth are adjusted to each organization's needs and level of readiness.",
        },
        howLabel: "The nine blocks of ARIA",
        howIntro:
          "One central strategy and four complementary dimensions help organize the adoption of artificial intelligence.",
        steps: [
          "Define where and what for to use artificial intelligence.",
          "Set rules and controls for the responsible use of AI.",
          "Prepare teams to work with artificial intelligence.",
          "Prepare the data AI initiatives need.",
          "Define how to build and maintain AI solutions.",
          "Share and reuse the teams' knowledge.",
          "Evaluate new AI applications before implementing them.",
          "Support people during the adoption of AI.",
          "Evaluate results and improve AI adoption.",
        ],
        features: [
          {
            title: "EA — Strategy + AI",
            desc: "Identifies business objectives and prioritizes AI initiatives by their impact, effort and expected results.\n\nDetail: Includes opportunity analysis, defining owners and setting indicators to evaluate each initiative.",
          },
          {
            title: "GL — Governance and Limits",
            desc: "Defines which tools can be used, how information must be handled and who is responsible for overseeing its use.\n\nDetail: Covers usage policies, data classification, risk assessment, technical controls and incident procedures.",
          },
          {
            title: "PR — People and roles",
            desc: "Identifies the capabilities each position needs and sets the responsibilities tied to the use of AI.\n\nDetail: Includes a skills assessment, training planning and the definition of new roles when needed.",
          },
          {
            title: "DA — Data",
            desc: "Assesses the availability, quality and accessibility of the information that will be used in artificial intelligence processes and systems.\n\nDetail: Covers the organization of data sources, quality criteria, traceability and the conditions for accessing and handling information.",
          },
          {
            title: "IN — Engineering",
            desc: "Sets technical practices to design, develop, test and deploy artificial intelligence solutions.\n\nDetail: Includes criteria for architecture, integration, evaluation, deployment and monitoring of the solutions built.",
          },
          {
            title: "KS — Knowledge sharing",
            desc: "Organizes the learnings and resources generated while using AI so they can be leveraged in other projects.\n\nDetail: Covers documenting and maintaining instructions, agents, components and good practices, with criteria for updating and reuse.",
          },
          {
            title: "IC — Controlled innovation",
            desc: "Allows tests and experiments with defined objectives, bounded resources and criteria to evaluate the results.\n\nDetail: Sets conditions to start, continue, modify or discard initiatives before they are incorporated into regular processes.",
          },
          {
            title: "GC — Change management",
            desc: "Plans the actions needed for teams to understand and adopt the changes in their activities and work processes.\n\nDetail: Includes internal communication, training, support by area and follow-up of adoption.",
          },
          {
            title: "PM — Improvement and maturity",
            desc: "Sets review mechanisms to track progress and adapt initiatives to the organization's needs.\n\nDetail: Includes tracking indicators, assessing capabilities and updating or ending initiatives that stopped delivering results.",
          },
        ],
        closing: {
          heading: "Want to evaluate how to bring AI into your company?",
          body: "Let's talk about current initiatives, opportunities for application and what is best to address first.",
          button: "Ask about ARIA",
        },
        requestCta: "Discover the framework",
      },
      {
        id: "ario",
        name: "ARIO",
        kind: "product",
        tagline: "Your documents, turned into data.",
        short:
          "ARIO uses artificial intelligence to extract and organize information from different documents, making it easier to use in spreadsheets and administrative processes.",
        cardTitle: "Turn documents into usable data.",
        cardDesc:
          "Extracts and organizes information from invoices and other documents so you can review it and use it in your work processes.",
        problem:
          "Manually entering information from invoices and other documents takes time and requires checking each piece of data before adding it to a spreadsheet or system.\n\nARIO extracts the information automatically and lets you review the results within the same work process.",
        example:
          "An administrative team receives 200 supplier invoices and needs to record the data from each one.\n\nInstead of manually copying the tax ID, dates, numbers and amounts, they can upload the files to ARIO, get the information organized and review the results before exporting them.",
        steps: [
          "Select one or more documents in PDF or image format and upload them to ARIO.",
          "Choose an available template or define what information you need to extract.",
          "ARIO uses artificial intelligence to identify and extract the requested data from the documents.",
          "Review the information obtained and correct any fields that need it.",
          "Export the organized results to use them in your work processes.",
        ],
        features: [
          {
            title: "Information extraction",
            desc: "Identifies data in digital documents and compatible scanned files.",
          },
          {
            title: "Document templates",
            desc: "Includes preconfigured options for invoices and identity documents.",
          },
          {
            title: "Custom fields",
            desc: "Lets you define what information you need to extract depending on the document.",
          },
          {
            title: "Batch processing",
            desc: "Supports uploading several files to process them in a single operation.",
          },
          {
            title: "Results review",
            desc: "Lets you check and correct the extracted data before exporting it.",
          },
          {
            title: "Data export",
            desc: "Organizes the results for later use in spreadsheets and other processes.",
          },
        ],
        howCta: "See how it works",
        contactCta: "Ask about ARIO",
        audience:
          "ARIO is designed for companies and teams that need to record information on a recurring basis from documents.\n\nIt can be applied to administrative, accounting and operational tasks that require extracting, reviewing and organizing data from invoices, receipts and other compatible files.",
      },
      {
        id: "meetingmate",
        name: "MeetingMate",
        kind: "product",
        tagline: "Spot what matters during every meeting.",
        short:
          "MeetingMate is an artificial intelligence assistant that analyzes conversations and suggests questions, possible risks and actions while the meeting is under way.",
        cardTitle: "Spot what matters in every meeting.",
        cardDesc:
          "Analyzes the conversation and suggests questions, possible risks and actions while the team is meeting.",
        problem:
          "During a meeting, changes, decisions and commitments can come up that are not always recorded or reviewed in time.\n\nTaking notes while taking part in the conversation can be hard. Reviewing what happened afterwards lets you recover information, but not address topics while they are being discussed.\n\nMeetingMate helps identify these situations during the meeting so the team can assess them on the spot.",
        example:
          "During a follow-up meeting, a client mentions that a project requirement has changed.\n\nMeetingMate can flag that change as a possible risk and suggest that the team review its impact, clarify the scope and define next steps before the meeting ends.",
        steps: [
          "Prepare the meeting with the objective, the participants and the project's reference information.",
          "Start audio capture from the microphone or the computer, depending on the type of meeting.",
          "MeetingMate transcribes the conversation and uses artificial intelligence to analyze it with the available context.",
          "During the meeting, it shows suggestions for questions, possible risks and actions so the team can review them.",
          "The team can address, dismiss or reopen the suggestions and check their history.",
        ],
        features: [
          {
            title: "Live capture",
            desc: "Records audio from the microphone or the computer to analyze in-person and virtual meetings.",
          },
          {
            title: "Speaker identification",
            desc: "Organizes contributions by speaker to make it easier to review the conversation and link it to participants.",
          },
          {
            title: "Question, risk and action cards",
            desc: "Presents suggestions generated by artificial intelligence during the meeting, so the team can assess them.",
          },
          {
            title: "Project context",
            desc: "Takes into account the available objectives, participants and reference documents to generate suggestions related to the meeting's topics.",
          },
          {
            title: "Suggestion tracking",
            desc: "Lets you check the status and history of suggestions, and review or reopen them when needed.",
          },
          {
            title: "Works with recorded audio too",
            desc: "Lets you upload a previously recorded audio file and get its transcript to review later.",
          },
        ],
        contactCta: "Ask about MeetingMate",
        audience:
          "MeetingMate is designed for teams that hold regular planning, follow-up and coordination meetings.\n\nIt can be used in project management, software development, consulting and other activities that require identifying risks, reviewing decisions and coordinating actions during meetings.",
      },
      {
        id: "sdd",
        name: "CriterIA",
        kind: "framework",
        tagline: "A shared criterion for developing with AI agents.",
        short:
          "CriterIA proposes a shared way of working to bring artificial intelligence agents into software development. Together with each team, criteria for delegation, context, review and decision logging are defined, according to the project's needs.",
        cardDesc:
          "A framework for teams to define instructions, record decisions and set review practices when developing software with artificial intelligence agents.",
        problem:
          "The same team may use AI agents with different instructions, references and ways of working.\n\nResults may need corrections when integrated because they do not take into account current decisions, project constraints or the work of other team members.\n\nIn addition, part of the knowledge ends up scattered across conversations and tools, which makes it hard for someone else to continue a task.",
        steps: [
          "Discover: together with the team we map a real case, the tools it uses, its responsibilities and the difficulties of its current way of working.",
          "Agree: we define which tasks are worth delegating to agents, what context to share, who reviews the results and how to record decisions.",
          "Prepare what is needed: we adapt instructions, references and checks to the existing tools. We add technical components only when the project needs them.",
          "Test: we apply the practice to focused tasks, with acceptance criteria and reviews agreed with the team.",
          "Evaluate and continue: we compare quality, corrections and total effort against the previous practice. We record the learnings to maintain and improve the way of working.",
        ],
        features: [
          {
            title: "Agreements and shared context",
            desc: "With each team we define which tasks to delegate, what information to use, who reviews the results and how to keep the project's decisions.",
          },
          {
            title: "Agents, skills and checks",
            desc: "We review the tools and agents the team uses. We adjust instructions, add reusable resources and define checks according to the project's needs.",
          },
          {
            title: "Proportional human review",
            desc: "We establish who reviews and accepts the agents' contributions, with controls suited to the complexity and risk of each task.",
          },
          {
            title: "Limits and permissions",
            desc: "We agree on which actions agents can take and which require authorization. Effective permissions must be applied in the corresponding tools and services.",
          },
          {
            title: "Support and continuous improvement",
            desc: "We try the practice together with the team, evaluate its results and record decisions and learnings to make it easier to continue.",
          },
        ],
        audience:
          "CriterIA is aimed at software development teams that want to bring artificial intelligence agents in or improve how they already work with them.\n\nIt can be applied to internal and client teams, involving project leads, developers, QA, architecture and other specialties according to each case's needs.",
      },
    ],
  },
  frameworkModal: {
    requestTitle: (frameworkTitle) => `Request ${frameworkTitle}`,
    subtitle: "Leave us your details and we'll send you the full material by email.",
    fields: {
      name: "Name",
      email: "Email",
      company: "Company",
      companyOptional: "(optional)",
    },
    submit: "Request by email",
    submitting: "Sending…",
    footnote: "You'll get an email with the material attached in a moment.",
    closeLabel: "Close",
    successToast: (frameworkTitle) => `Done. We sent you ${frameworkTitle} by email.`,
    errorToast: "We couldn't send the material. Please try again in a few minutes.",
  },
  footer: {
    tagline: "Software, data and dedicated teams since 2001.",
    officesHeading: "Offices",
    sectionsHeading: "Sections",
    followHeading: "Follow us",
    legal: "© 2026 AR IT Services SRL. All rights reserved.",
    offices: [
      { city: "Dallas", country: "United States", address: "Dallas, Texas" },
      { city: "Córdoba", country: "Argentina", address: "Córdoba" },
      { city: "Asunción", country: "Paraguay", address: "Asunción" },
    ],
  },
  iso: { certified: "Certified" },
  team: {
    eyebrow: "// select the disciplines",
    heading: "Build the team your project needs",
    paragraph:
      "Select the specialties and see an initial team proposal. We help you define the profiles and the number of professionals based on the needs and scope of your project.",
    disciplinesAria: "Disciplines",
    proposed: "// proposed team",
    person: "person",
    people: "people",
    empty: "Select at least one discipline to see your team.",
    cta: "Book a meeting to define your team",
    emptyProposalMessage:
      "Hi, I'd like to talk about building a team for my project. I haven't defined the profiles yet, so I'd appreciate your help working them out.",
    proposalMessage: (disciplines, team, total) =>
      [
        "Hi, I'd like to schedule a call to talk about the following team:",
        "",
        `Technologies / disciplines: ${disciplines.join(", ")}`,
        "",
        "Profiles:",
        ...team.map((m) => `- ${m.role} x${m.qty}`),
        "",
        `Total: ${total} ${total === 1 ? "person" : "people"}`,
      ].join("\n"),
    disciplines: [
      {
        id: "dotnet-react",
        label: ".NET & React",
        roles: [
          { role: "Senior .NET Dev", qty: 1 },
          { role: "React Dev", qty: 1 },
        ],
      },
      {
        id: "data-bi",
        label: "Data & Power BI",
        roles: [
          { role: "Data Engineer", qty: 1 },
          { role: "Power BI Analyst", qty: 1 },
        ],
      },
      { id: "qa", label: "QA & Testing", roles: [{ role: "QA Automation", qty: 1 }] },
      { id: "scrum", label: "Scrum Master", roles: [{ role: "Scrum Master", qty: 1 }] },
      { id: "mobile", label: "Mobile", roles: [{ role: "iOS / Android Dev", qty: 2 }] },
      {
        id: "devops",
        label: "DevOps & n8n",
        roles: [
          { role: "DevOps Engineer", qty: 1 },
          { role: "Automation Specialist", qty: 1 },
        ],
      },
      { id: "pm", label: "Project Manager", roles: [{ role: "Project Manager", qty: 1 }] },
    ],
  },
  careers: {
    heading: "Join the team",
    intro:
      "25 years building teams that stay. We look for people who want to solve real problems, not profiles that fit a checklist.",
    positionsHeading: "Open positions",
    emptyHeading: "No open positions right now",
    emptyBody:
      "That changes often. Send us your profile and we'll reach out when something matches.",
    applyCta: "Send us your CV",
    positionCtaLabel: "Apply",
    applySubmitLabel: "Send application",
    mustHaveLabel: "What we're looking for",
    niceToHaveLabel: "Nice to have",
    responsibilitiesLabel: "Responsibilities",
    aboutRoleLabel: "The role",
    detailCtaLabel: "See more",
    filterAllLabel: "All",
    filterEmptyMessage: "No positions match those filters.",
    searchLabel: "Search open positions",
    searchPlaceholder: "Search by role, technology or city…",
    clearSearchLabel: "Clear the search",
    clearFiltersLabel: "Clear filters",
    areaFilterLabel: "Area",
    techFilterLabel: "Technology",
    locationFilterLabel: "Location",
    resultsCount: (n) => (n === 0 ? "No results" : n === 1 ? "1 position" : `${n} positions`),
    refreshLabel: "Retry",
    errorHeading: "We couldn't load the positions",
    errorBody: "We're having trouble reaching our recruiting system. Please try again in a moment.",
    vacancyOne: "1 opening available",
    vacancyMany: "openings available",
    publishedLabel: "Posted",
    englishLevelLabel: "English level required",
    enNoticeHeading: "Open positions are published in Spanish",
    enNoticeBody:
      "These listings come straight from our recruiting system, which publishes them in Spanish. Send us your CV in Spanish and we'll get back to you.",
  },
  news: {
    enNoticeHeading: "This newsletter is published in Spanish",
    enNoticeBody:
      "Our monthly AI newsletter is written for the Spanish-speaking market. Switch to ES above to read the latest issue.",
  },
};

// Rutas que la versión "intermedia" no expone en el menú ni en el footer
// (los archivos de ruta y su contenido siguen intactos en el repo).
const HIDDEN_IN_INTERMEDIO = ["/novedades", "#casos"];

export function getContent(lang: Lang): SiteContent {
  const base = lang === "EN" ? EN : ES;
  // "Soluciones" lleva el panel desplegable con los productos y, mientras dure,
  // la etiqueta de novedad. Se arma acá para no duplicar los textos del menú.
  const withSolutions = base.nav.map((n): NavItem =>
    n.href === "/soluciones"
      ? {
          ...n,
          href: "/#soluciones",
          children: base.solutions.products.map((p) => ({
            label: p.name,
            href: `/solucion/${getPublicSolutionSlug(p.id)}`,
            hint: p.tagline,
          })),
          ...(isNewBadgeActive() ? { badge: base.solutions.navBadge } : {}),
        }
      : n,
  );
  if (!isIntermedio) return { ...base, nav: withSolutions };
  return { ...base, nav: withSolutions.filter((n) => !HIDDEN_IN_INTERMEDIO.includes(n.href)) };
}
