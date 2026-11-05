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
  tagline: string;
  short: string;
  problem: string;
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
    items: [
      {
        name: "Felix Melinsky",
        role: "Fundador & Presidente",
        quote: "Empezamos hace 25 años haciendo el trabajo. Seguimos haciéndolo.",
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
        quote: "Buscamos gente que quiera quedarse, no perfiles que encajen en una grilla.",
      },
    ],
  },
  contact: {
    heading: "Contanos tu proyecto",
    subtitle: "Respondemos con una propuesta de equipo, no con un folleto.",
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
          "Convertir «usar IA» en «ganar terreno de negocio con IA» requiere que todas las piezas de la organización apunten hacia el mismo lado. Sin un núcleo estratégico claro, los bloques restantes optimizan hacia direcciones distintas, y una falla persistente en cualquiera degrada al conjunto.",
        howLabel: "Cómo se articulan los 9 bloques",
        featuresLabel: "Los 9 bloques",
        steps: [
          "EA · Estrategia + IA es el núcleo: define para qué, para quién y con qué éxito, y prioriza las iniciativas.",
          "GL · Governance y Límites pone las reglas del juego y los controles sobre cómo se usa la IA.",
          "PR · Personas y roles define las capacidades, el entrenamiento y los roles nuevos que hacen falta.",
          "DA · Data aporta datos de calidad y con linaje: la base sobre la que corre la IA.",
          "IN · Ingeniería construye sobre esa base, con arquitectura de referencia y prácticas AI-native.",
          "KS · Knowledge sharing hace que lo aprendido (prompts, agentes, patrones) se comparta y se reutilice.",
          "IC · Innovación controlada prueba ideas nuevas en experimentos acotados antes de llevarlas a producción.",
          "GC · Gestión del cambio acompaña la adopción de las personas, por etapas y con comunicación constante.",
          "PM · Perfeccionamiento y madurez revisa, retira lo obsoleto y hace evolucionar el sistema completo.",
        ],
        features: [
          {
            title: "EA · Estrategia + IA",
            desc: "Define para qué, para quién y con qué éxito medible. Prioriza el portfolio de iniciativas y establece ownership ejecutivo.",
          },
          {
            title: "GL · Governance y Límites",
            desc: "Reglas del juego y controles operativos: catálogo autorizado, políticas de datos, guardrails técnicos, monitoreo e incident response.",
          },
          {
            title: "PR · Personas y roles",
            desc: "Capacidades esperadas por rol, entrenamiento por nivel, roles nuevos (AI PO, MLOps, evaluadores) y modelo de madurez individual.",
          },
          {
            title: "DA · Data",
            desc: "Arquitectura, calidad y linaje de datos, data como producto interno y patrones para IA (RAG, embeddings, vector stores).",
          },
          {
            title: "IN · Ingeniería",
            desc: "Arquitectura de referencia, MLOps/LLMOps y prácticas AI-native (Copilot, spec-driven, componentes reusables).",
          },
          {
            title: "KS · Knowledge sharing",
            desc: "Marketplace interno curado de prompts, agentes y patrones, con versionado y comunidades de práctica.",
          },
          {
            title: "IC · Innovación controlada",
            desc: "Portfolio acotado de experimentos, sandbox aislado y gates formales de prototipo a piloto y de piloto a producción.",
          },
          {
            title: "GC · Gestión del cambio",
            desc: "Adopción escalonada por waves, comunicación consistente, champions locales y manejo de resistencias.",
          },
          {
            title: "PM · Perfeccionamiento y madurez",
            desc: "Revisión periódica del portfolio, retiro disciplinado de lo obsoleto, evolución del framework y escalamiento del nivel de madurez.",
          },
        ],
        requestCta: "Descubrí el framework",
      },
      {
        id: "ario",
        name: "ARIO",
        kind: "product",
        tagline: "Convertí documentos en datos utilizables.",
        short:
          "Extrae y organiza información de facturas y otros documentos para que puedas revisarla y utilizarla en tus procesos de trabajo.",
        problem:
          "Muchas empresas siguen pasando a mano los datos de facturas, comprobantes y documentos de identidad. Es lento, repetitivo y genera errores.",
        example:
          "Una administración recibe 200 facturas de proveedores a fin de mes y alguien tiene que copiar CUIT, fecha, número e importes una por una en una planilla. Con ARIO las sube todas juntas y recibe los datos ordenados.",
        steps: [
          "Subís uno o varios documentos (PDF o foto).",
          "Elegís qué tipo de documento es: general, DNI, Factura ARCA o uno con tus propios campos.",
          "ARIO lee el documento y saca los datos automáticamente.",
          "Revisás y corregís lo que haga falta.",
          "Exportás los datos listos para usar.",
        ],
        features: [
          {
            title: "Lectura inteligente",
            desc: "Entiende PDFs y fotos, incluso escaneados.",
          },
          {
            title: "Plantillas para Argentina",
            desc: "Reconoce Factura ARCA y DNI sin configurar nada.",
          },
          {
            title: "Campos personalizados",
            desc: "Se adapta a cualquier documento de tu negocio.",
          },
          { title: "Carga en lote", desc: "Procesa muchos documentos de una sola vez." },
          {
            title: "Validación humana",
            desc: "Una persona revisa antes de usar los datos, así hay control y confianza.",
          },
          {
            title: "Exportación",
            desc: "Los datos salen listos para planillas u otros sistemas.",
          },
        ],
        audience:
          "PyMEs y equipos administrativos, contables y de operaciones que manejan muchos documentos.",
      },
      {
        id: "meetingmate",
        name: "MeetingMate",
        kind: "product",
        tagline: "Identificá lo importante de cada reunión.",
        short:
          "Analiza la conversación y sugiere preguntas, posibles riesgos y acciones mientras el equipo se reúne.",
        problem:
          "En las reuniones se habla rápido y lo importante se pierde: una pregunta que nadie hizo, un riesgo que quedó en el aire, un compromiso sin responsable. Hoy alguien toma notas a mano y se pierde parte de la charla, o se revisa todo recién después, cuando ya no se puede reaccionar.",
        example:
          "En una reunión de seguimiento de proyecto el cliente menciona de pasada que cambió un requisito. Nadie lo anota y dos semanas después aparece como un retraso. MeetingMate lo muestra en pantalla como un riesgo en el momento, cuando todavía se puede aclarar.",
        steps: [
          "Se prepara la reunión: se carga el proyecto, el objetivo, los participantes y los documentos de referencia.",
          "Se graba: MeetingMate toma el audio del micrófono (reuniones presenciales) o también el de la computadora (reuniones virtuales).",
          "Se transcribe y se analiza: la IA revisa la conversación con todo el contexto del proyecto.",
          "Aparecen tarjetas: preguntas, riesgos y acciones, visibles para todos los presentes.",
          "El equipo reacciona: atiende, descarta (indicando el motivo) o reabre cada tarjeta, y queda todo registrado.",
        ],
        features: [
          {
            title: "Captura en vivo",
            desc: "Graba micrófono y audio de la computadora, así funciona en reuniones presenciales y virtuales.",
          },
          {
            title: "Identificación de oradores",
            desc: "Cada intervención queda registrada y asociable a un participante.",
          },
          {
            title: "Tarjetas de pregunta, riesgo y acción",
            desc: "Lo importante aparece en pantalla sin que nadie tenga que anotarlo.",
          },
          {
            title: "Contexto del proyecto",
            desc: "Usa objetivos, roles, participantes, documentos y reuniones previas para sugerir con criterio.",
          },
          {
            title: "Seguimiento automático",
            desc: "Evita tarjetas repetidas y marca como resueltas las que la conversación ya cerró, con historial para revisarlas o reabrirlas.",
          },
          {
            title: "También con audios grabados",
            desc: "Se puede subir un archivo de audio y obtener su transcripción.",
          },
        ],
        audience:
          "Equipos que se reparten el trabajo en reuniones recurrentes: líderes de proyecto, scrum masters, project managers, áreas comerciales y de cuentas, consultoras y equipos de producto o IT.",
      },
      {
        id: "sdd",
        name: "CriterIA",
        kind: "framework",
        tagline: "Un criterio compartido para desarrollar con agentes de IA.",
        short:
          "Un marco de trabajo para que los equipos definan instrucciones, registren decisiones y establezcan prácticas de revisión al desarrollar software con agentes de inteligencia artificial.",
        problem:
          "Un mismo equipo puede usar agentes con instrucciones, fuentes y hábitos distintos. Cada resultado parece útil por separado, pero al integrarlo hay que corregirlo porque no consideró una decisión vigente o el trabajo de otra persona, y el conocimiento queda atrapado en conversaciones aisladas.",
        steps: [
          "Descubrir: relevamos con el equipo un caso real, quiénes participan, qué herramientas de IA usan, dónde deciden y cómo validan.",
          "Acordar: definimos juntos qué se delega a los agentes, qué contexto se comparte, quién revisa y quién acepta el trabajo.",
          "Implementar lo necesario: preparamos el contexto, las reglas y las decisiones e implementamos agentes, skills, verificaciones y buenas prácticas en las herramientas existentes, ajustados a cada rol. La arquitectura propia, solo si el caso la requiere.",
          "Probar: aplicamos la práctica a tareas acotadas y reversibles, con pruebas y observaciones del equipo.",
          "Evaluar y mejorar: comparamos calidad, retrabajo y esfuerzo total con la práctica anterior y actualizamos agentes, skills y referencias con lo aprendido.",
        ],
        features: [
          {
            title: "Acuerdos y contexto compartido",
            desc: "Definimos qué delegar, quién revisa y decide, y qué referencias y decisiones vigentes comparte el equipo.",
          },
          {
            title: "Agentes, skills y verificaciones",
            desc: "Los configuramos para cada proyecto y rol, en las herramientas que el equipo ya usa.",
          },
          {
            title: "Revisión humana proporcional",
            desc: "El equipo conserva el criterio y la responsabilidad; los controles se ajustan a la tarea y al riesgo.",
          },
          {
            title: "Límites y permisos",
            desc: "El acceso se controla en las herramientas y las acciones relevantes requieren aprobación previa.",
          },
          {
            title: "Acompañamiento y mejora continua",
            desc: "Registramos decisiones, probamos en un caso acotado y ajustamos la práctica junto al equipo.",
          },
        ],
        audience:
          "Equipos de desarrollo internos y de clientes que ya usan IA de manera individual y quieren una práctica compartida: dirección, responsables de proyecto, ingeniería, QA, arquitectura, datos y seguridad.",
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
    legal: "© 2026 AR Consultores SRL. Todos los derechos reservados.",
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
      "Tocá las disciplinas y mirá cómo se arma el equipo. Es exactamente lo que hacemos con nuestros clientes: perfiles concretos, cantidades concretas.",
    disciplinesAria: "Disciplinas",
    proposed: "// equipo propuesto",
    person: "persona",
    people: "personas",
    empty: "Seleccioná al menos una disciplina para ver tu equipo.",
    cta: "Agendar una llamada con tu equipo propuesto",
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
    items: [
      {
        name: "Felix Melinsky",
        role: "Founder & President",
        quote: "We started 25 years ago doing the work. We still do.",
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
        quote: "We look for people who want to stay, not profiles that fit a grid.",
      },
    ],
  },
  contact: {
    heading: "Tell us about your project",
    subtitle: "We reply with a team proposal, not a brochure.",
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
          "Turning “using AI” into “gaining business ground with AI” takes every part of the organization pulling the same way. Without a clear strategic core, the other blocks optimize in different directions, and a persistent failure in any one of them degrades the whole.",
        howLabel: "How the 9 blocks fit together",
        featuresLabel: "The 9 blocks",
        steps: [
          "EA · Strategy + AI is the core: it defines what for, for whom and with what success, and prioritizes initiatives.",
          "GL · Governance and Limits sets the rules of the game and the controls on how AI is used.",
          "PR · People and roles defines the capabilities, training and new roles that are needed.",
          "DA · Data provides quality data with lineage: the base AI runs on.",
          "IN · Engineering builds on that base, with a reference architecture and AI-native practices.",
          "KS · Knowledge sharing makes what is learned (prompts, agents, patterns) shared and reusable.",
          "IC · Controlled innovation tests new ideas in bounded experiments before taking them to production.",
          "GC · Change management supports people through adoption, in stages and with steady communication.",
          "PM · Improvement and maturity reviews, retires what is obsolete and evolves the whole system.",
        ],
        features: [
          {
            title: "EA · Strategy + AI",
            desc: "Defines what for, for whom and with what measurable success. Prioritizes the initiative portfolio and sets executive ownership.",
          },
          {
            title: "GL · Governance and Limits",
            desc: "Rules of the game plus operational controls: authorized catalog, data policies, technical guardrails, monitoring and incident response.",
          },
          {
            title: "PR · People and roles",
            desc: "Expected capabilities by role, training by level, new roles (AI PO, MLOps, evaluators) and an individual maturity model.",
          },
          {
            title: "DA · Data",
            desc: "Data architecture, quality and lineage, data as an internal product, and patterns for AI (RAG, embeddings, vector stores).",
          },
          {
            title: "IN · Engineering",
            desc: "Reference architecture, MLOps/LLMOps and AI-native practices (Copilot, spec-driven, reusable components).",
          },
          {
            title: "KS · Knowledge sharing",
            desc: "A curated internal marketplace of prompts, agents and patterns, with versioning and communities of practice.",
          },
          {
            title: "IC · Controlled innovation",
            desc: "A bounded portfolio of experiments, an isolated sandbox, and formal gates from prototype to pilot and from pilot to production.",
          },
          {
            title: "GC · Change management",
            desc: "Staged adoption in waves, consistent communication, local champions and handling of resistance.",
          },
          {
            title: "PM · Improvement and maturity",
            desc: "Periodic portfolio review, disciplined retirement of the obsolete, evolution of the framework itself and a rising global maturity level.",
          },
        ],
        requestCta: "Discover the framework",
      },
      {
        id: "ario",
        name: "ARIO",
        kind: "product",
        tagline: "Turn documents into usable data.",
        short:
          "Extracts and organizes information from invoices and other documents so you can review it and use it in your work processes.",
        problem:
          "Many companies still copy data by hand from invoices, receipts and ID documents. It is slow, repetitive and error-prone.",
        example:
          "An accounting office receives 200 supplier invoices at the end of the month, and someone has to copy tax ID, date, number and amounts one by one into a spreadsheet. With ARIO they upload them all together and get the data back, organized.",
        steps: [
          "You upload one or several documents (PDF or photo).",
          "You choose the document type: general, ID card, ARCA invoice or one with your own fields.",
          "ARIO reads the document and extracts the data automatically.",
          "You review and correct whatever is needed.",
          "You export the data, ready to use.",
        ],
        features: [
          {
            title: "Smart reading",
            desc: "Understands PDFs and photos, even scanned ones.",
          },
          {
            title: "Templates for Argentina",
            desc: "Recognizes ARCA invoices and ID cards with no setup.",
          },
          {
            title: "Custom fields",
            desc: "Adapts to any document in your business.",
          },
          { title: "Batch upload", desc: "Processes many documents at once." },
          {
            title: "Human validation",
            desc: "A person reviews the data before it is used, so there is control and trust.",
          },
          {
            title: "Export",
            desc: "Data comes out ready for spreadsheets or other systems.",
          },
        ],
        audience:
          "SMEs and administrative, accounting and operations teams that handle many documents.",
      },
      {
        id: "meetingmate",
        name: "MeetingMate",
        kind: "product",
        tagline: "Spot what matters in every meeting.",
        short:
          "Analyzes the conversation and suggests questions, possible risks and actions while the team is meeting.",
        problem:
          "In meetings people talk fast and what matters gets lost: a question nobody asked, a risk left hanging, a commitment with no owner. Today someone takes notes by hand and misses part of the conversation, or everything is reviewed only afterwards, when it is too late to react.",
        example:
          "In a project follow-up meeting the client mentions in passing that a requirement changed. Nobody writes it down, and two weeks later it shows up as a delay. MeetingMate shows it on screen as a risk in the moment, while it can still be clarified.",
        steps: [
          "The meeting is prepared: the project, goal, participants and reference documents are loaded.",
          "It is recorded: MeetingMate captures microphone audio (in-person meetings) and also computer audio (virtual meetings).",
          "It is transcribed and analyzed: the AI reviews the conversation with the full project context.",
          "Cards appear: questions, risks and actions, visible to everyone in the room.",
          "The team reacts: it addresses, dismisses (stating the reason) or reopens each card, and everything is recorded.",
        ],
        features: [
          {
            title: "Live capture",
            desc: "Records microphone and computer audio, so it works in in-person and virtual meetings.",
          },
          {
            title: "Speaker identification",
            desc: "Each contribution is recorded and can be linked to a participant.",
          },
          {
            title: "Question, risk and action cards",
            desc: "What matters shows up on screen without anyone having to write it down.",
          },
          {
            title: "Project context",
            desc: "Uses goals, roles, participants, documents and previous meetings to suggest with judgment.",
          },
          {
            title: "Automatic follow-up",
            desc: "Avoids repeated cards and marks as resolved those the conversation already closed, with a history to review or reopen them.",
          },
          {
            title: "Works with recorded audio too",
            desc: "You can upload an audio file and get its transcript.",
          },
        ],
        audience:
          "Teams that share work across recurring meetings: project leads, scrum masters, project managers, sales and account teams, consultancies, and product or IT teams.",
      },
      {
        id: "sdd",
        name: "CriterIA",
        kind: "framework",
        tagline: "A shared criterion for developing with AI agents.",
        short:
          "A framework for teams to define instructions, record decisions and set review practices when developing software with artificial intelligence agents.",
        problem:
          "The same team can use agents with different instructions, sources and habits. Each output looks useful on its own, but needs fixing when integrated because it ignored a current decision or someone else's work, and knowledge gets stuck in isolated conversations.",
        steps: [
          "Discover: together with the team we map a real case, who takes part, which tools they use, where they decide and how they validate.",
          "Agree: we define what is delegated, what context is shared, who reviews and who accepts the work.",
          "Implement what is needed: we prepare context, rules and decisions and implement agents, skills, checks and good practices in existing tools for each role. Custom architecture only if the case requires it.",
          "Test: the practice is applied to focused, reversible tasks, with tests and the team's observations.",
          "Evaluate and improve: we compare quality, rework and total effort with the previous practice and use what we learn to update agents, skills and references.",
        ],
        features: [
          {
            title: "Agreements and shared context",
            desc: "Together we define what to delegate, who reviews and decides, and the current references and decisions the team shares.",
          },
          {
            title: "Agents, skills and checks",
            desc: "Configured for each project and role in the tools the team already uses.",
          },
          {
            title: "Proportional human review",
            desc: "The team keeps judgment and responsibility; controls scale with the task and the risk.",
          },
          {
            title: "Limits and permissions",
            desc: "Access is controlled in tools and significant actions require prior approval.",
          },
          {
            title: "Ongoing support and improvement",
            desc: "We record decisions, test in a focused case and adjust the practice together with the team.",
          },
        ],
        audience:
          "Internal and client development teams that already use AI individually and want a shared practice: leadership, project leads, engineering, QA, architecture, data and security.",
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
    legal: "© 2026 AR Consultores SRL. All rights reserved.",
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
      "Tap the disciplines and watch the team come together. It's exactly what we do with our clients: concrete profiles, concrete numbers.",
    disciplinesAria: "Disciplines",
    proposed: "// proposed team",
    person: "person",
    people: "people",
    empty: "Select at least one discipline to see your team.",
    cta: "Book a call with your proposed team",
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
