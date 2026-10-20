import type { Lang } from "./language";
import { isIntermedio } from "@/lib/site-mode";

export type NavItem = { label: string; href: string };

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
  id: "ario" | "meetingmate" | "sdd";
  name: string;
  tagline: string;
  short: string;
  problem: string;
  example?: string;
  steps: string[];
  features: { title: string; desc: string }[];
  audience: string;
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
    framework: ServiceLinkCard;
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
    backLink: string;
    items: { name: string; role: string; quote: string }[];
    portraitAlt: (name: string) => string;
    careersLink: string;
  };
  finalCta: { heading: string; button: string };
  contact: {
    heading: string;
    subtitle: string;
    typeLabels: { company: string; candidate: string; general: string };
    fields: {
      name: string;
      email: string;
      phone: string;
      company: string;
      country: string;
      projectType: string;
      position: string;
      positionOther: string;
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
    backLink: string;
    teaserCta: string;
    cardCta: string;
    contactCta: string;
    labels: { problem: string; example: string; how: string; features: string; audience: string };
    logoAlt: (name: string) => string;
    products: SolutionProduct[];
  };
  frameworkModal: {
    eyebrow: string;
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
    backLink: string;
    /** Label del BackButton en la PD: vuelve al listado, no al home. */
    backToPositionsLabel: string;
    intro: string;
    positionsHeading: string;
    emptyHeading: string;
    emptyBody: string;
    applyCta: string;
    positionCtaLabel: string;
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
    refreshingLabel: string;
    updatedLabel: string;
    errorHeading: string;
    errorBody: string;
    vacancyOne: string;
    vacancyMany: string;
    publishedLabel: string;
    englishLevelLabel: string;
    enNoticeHeading: string;
    enNoticeBody: string;
    positions: {
      title: string;
      category: string;
      location: string;
      modality: string;
      seniority: string;
      stack: string[];
      intro: string;
      mustHave: string[];
      niceToHave: string[];
    }[];
  };
  news: {
    backLink: string;
    enNoticeHeading: string;
    enNoticeBody: string;
  };
};

const ES: SiteContent = {
  nav: [
    { label: "Servicios", href: "#servicios" },
    { label: "Soluciones", href: "/soluciones" },
    { label: "Casos de éxito", href: "#casos" },
    { label: "Novedades", href: "/novedades" },
    { label: "Nosotros", href: "/nosotros" },
    { label: "Trabajá con nosotros", href: "/trabaja-con-nosotros" },
  ],
  cta: { talk: "Hablemos" },
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
    { value: 2, suffix: "M+", label: "horas-hombre" },
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
    framework: {
      label: "Framework propio",
      title: "ARIA",
      desc: "Adopción Responsable de Inteligencia Artificial: nuestro framework de 9 bloques para diseñar la empresa AI-Native del mediano y largo plazo, no un catálogo de herramientas para el corto plazo.",
      cta: "Descubrí el framework",
      href: "#contacto",
    },
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
          "Más de 2.000 proyectos entregados y 2M+ horas-hombre acumuladas trabajando junto a sus equipos en toda la región.",
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
    backLink: "Volver al inicio",
    portraitAlt: (n) => `Retrato de ${n}`,
    careersLink: "Ver vacantes abiertas",
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
  finalCta: {
    heading: "¿Armamos el equipo que tu proyecto necesita?",
    button: "Escribinos",
  },
  contact: {
    heading: "Contanos tu proyecto",
    subtitle: "Respondemos con una propuesta de equipo, no con un folleto.",
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
      positionOther: "Otro / no está en la lista",
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
      "Productos propios de AR IT Services para resolver problemas reales de equipos y empresas.",
    backLink: "Volver al inicio",
    teaserCta: "Ver todas las soluciones",
    cardCta: "Conocer más",
    contactCta: "Conversemos sobre tu proyecto",
    labels: {
      problem: "El problema",
      example: "Un ejemplo",
      how: "Cómo funciona",
      features: "Qué incluye",
      audience: "A quién está dirigido",
    },
    logoAlt: (n) => `Logo de ${n}`,
    products: [
      {
        id: "ario",
        name: "Ario",
        tagline: "Tus documentos, convertidos en datos.",
        short:
          "Ario lee tus documentos y convierte facturas, DNI y PDFs en datos listos para usar, en segundos.",
        problem:
          "Muchas empresas siguen pasando a mano los datos de facturas, comprobantes y documentos de identidad. Es lento, repetitivo y genera errores.",
        example:
          "Una administración recibe 200 facturas de proveedores a fin de mes y alguien tiene que copiar CUIT, fecha, número e importes una por una en una planilla. Con Ario las sube todas juntas y recibe los datos ordenados.",
        steps: [
          "Subís uno o varios documentos (PDF o foto).",
          "Elegís qué tipo de documento es: general, DNI, Factura ARCA o uno con tus propios campos.",
          "Ario lee el documento y saca los datos automáticamente.",
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
        tagline: "Tu reunión, con copiloto.",
        short:
          "El compañero de reunión con IA que escucha la conversación y te sugiere en pantalla preguntas, riesgos y acciones mientras la reunión sigue.",
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
        name: "AR SDD",
        tagline: "Del pedido a un cambio verificable.",
        short:
          "Un método de desarrollo con IA y un kit técnico para transformar pedidos de software en cambios definidos, revisados y verificables.",
        problem:
          "El uso de agentes de IA puede acelerar modificaciones de código, pero sin un marco compartido resulta difícil saber qué se pidió, quién lo aprobó, qué fue validado y si una evidencia sigue vigente.",
        steps: [
          "Contexto: se seleccionan y validan las fuentes pertinentes del proyecto para que los agentes trabajen con el contexto correcto.",
          "Especificación: el pedido se convierte en un spec, un contrato revisable y aprobable de un cambio.",
          "Roles: implementador, verificador, reviewer y consolidador trabajan coordinados, cada uno con su responsabilidad.",
          "Controles: antes de avanzar, los gates comprueban los requisitos y las aprobaciones quedan vinculadas a cada versión.",
          "Aceptación: QA conserva la validación de calidad y la decisión final queda en manos del equipo.",
        ],
        features: [
          {
            title: "Ingeniería de contexto",
            desc: "Selección y validación de las fuentes pertinentes del proyecto.",
          },
          {
            title: "Especificaciones revisables",
            desc: "Cada cambio parte de un contrato claro que el equipo puede revisar y aprobar.",
          },
          {
            title: "Roles diferenciados",
            desc: "Implementación, verificación, revisión y consolidación, con un coordinador central.",
          },
          {
            title: "Control humano",
            desc: "Los gates y las aprobaciones por versión mantienen la autoridad en el equipo.",
          },
          {
            title: "Adopción por proyecto",
            desc: "Se incorpora de forma selectiva sobre un proyecto existente, empezando por un cambio acotado.",
          },
        ],
        audience:
          "Equipos de desarrollo internos y consultoras que ya usan asistentes de IA y necesitan más control sobre los cambios: CTO, líderes técnicos, desarrolladores y QA.",
      },
    ],
  },
  frameworkModal: {
    eyebrow: "Framework propio",
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
    backLink: "Volver al inicio",
    // El `BackButton` de la PD vuelve al listado, no al home: usar `backLink`
    // ("Volver al inicio") mentía sobre el destino.
    backToPositionsLabel: "Volver a las búsquedas",
    intro:
      "25 años armando equipos que se quedan. Buscamos gente con ganas de resolver problemas reales, no perfiles que encajen en una grilla.",
    positionsHeading: "Búsquedas abiertas",
    emptyHeading: "Por ahora no tenemos búsquedas puntuales",
    emptyBody:
      "Pero eso cambia seguido. Dejanos tu perfil y te tenemos en cuenta apenas abramos una posición que matchee.",
    applyCta: "Dejanos tu CV",
    positionCtaLabel: "Postularme",
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
    refreshingLabel: "Actualizando…",
    updatedLabel: "Actualizado",
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
    positions: [
      {
        title: "Desarrollador/a .NET Senior",
        category: "Full Stack",
        location: "Córdoba, Argentina",
        modality: "Híbrida (remoto + oficina cuando se requiera)",
        seniority: "Senior",
        stack: [".NET", "C#", "React", "SQL Server"],
        intro:
          "Buscamos incorporar un/a Desarrollador/a .NET Senior para sumarse a un equipo que trabaja en productos que salen a producción y se mantienen en el tiempo, no solo prototipos.",
        mustHave: [
          "+5 años de experiencia en desarrollo .NET y C#.",
          "Experiencia con React en el frontend.",
          "Manejo de SQL Server y diseño de bases de datos relacionales.",
          "Familiaridad con metodologías ágiles (Scrum/Kanban).",
          "Perfil autónomo, con capacidad de tomar decisiones técnicas.",
        ],
        niceToHave: [
          "Experiencia con Azure o AWS.",
          "Uso de herramientas de AI Coding (Copilot, Claude Code) en el día a día.",
          "Experiencia liderando equipos chicos o mentoreando devs junior.",
        ],
      },
      {
        title: "Data Engineer",
        category: "Data",
        location: "Remoto (Argentina)",
        modality: "100% remoto",
        seniority: "Semi Senior / Senior",
        stack: ["Python", "SQL", "Power BI", "Apache Airflow"],
        intro:
          "Buscamos un/a Data Engineer para diseñar y mantener pipelines de datos que alimentan modelos predictivos y tableros que las áreas de negocio de nuestros clientes usan todos los días.",
        mustHave: [
          "+3 años de experiencia trabajando con pipelines de datos en Python.",
          "Experiencia con SQL avanzado y modelado de datos.",
          "Manejo de Power BI o una herramienta de BI equivalente.",
          "Conocimientos de orquestación de procesos (Airflow o similar).",
          "Perfil analítico, con atención al detalle en la calidad del dato.",
        ],
        niceToHave: [
          "Experiencia con machine learning aplicado.",
          "Manejo de servicios cloud de datos (BigQuery, Redshift, Synapse).",
          "Inglés técnico para lectura de documentación.",
        ],
      },
      {
        title: "QA Automation Engineer",
        category: "QA",
        location: "Córdoba, Argentina",
        modality: "Híbrida (remoto + oficina cuando se requiera)",
        seniority: "Semi Senior",
        stack: ["Java", "Playwright", "Cypress", "CI/CD"],
        intro:
          "Buscamos un/a QA Automation Engineer para diseñar estrategias de testing y automatizar la validación de productos antes de que lleguen a producción.",
        mustHave: [
          "+3 años de experiencia en QA Automation.",
          "Experiencia sólida en testing funcional.",
          "Desarrollo de automatizaciones con Java y/o Python.",
          "Manejo de Jira y herramientas de gestión de bugs.",
          "Perfil proactivo, orientado a la mejora continua.",
        ],
        niceToHave: [
          "Experiencia con Playwright, Cypress o Selenium.",
          "Integración de tests en pipelines de CI/CD.",
          "Conocimientos de testing de APIs (Postman).",
        ],
      },
      {
        title: "Mobile Developer (iOS / Android)",
        category: "Mobile",
        location: "Remoto (Argentina / LatAm)",
        modality: "100% remoto",
        seniority: "Semi Senior",
        stack: ["React Native", "TypeScript", "iOS", "Android"],
        intro:
          "Buscamos un/a Mobile Developer para trabajar en apps que ya están en producción, con usuarios reales, no solo en fase de prototipo.",
        mustHave: [
          "+3 años de experiencia en desarrollo mobile con React Native.",
          "Conocimientos sólidos de TypeScript.",
          "Experiencia publicando apps en App Store y Google Play.",
          "Manejo de control de versiones (Git) y flujos de PR/code review.",
        ],
        niceToHave: [
          "Experiencia con desarrollo nativo (Swift o Kotlin).",
          "Conocimientos de CI/CD para mobile (Fastlane, EAS).",
          "Experiencia con testing automatizado en mobile.",
        ],
      },
      {
        title: "DevOps Engineer",
        category: "DevOps",
        location: "Córdoba, Argentina",
        modality: "Híbrida (remoto + oficina cuando se requiera)",
        seniority: "Senior",
        stack: ["AWS", "Docker", "Kubernetes", "n8n"],
        intro:
          "Buscamos un/a DevOps Engineer para mantener y mejorar la infraestructura y los pipelines de despliegue de nuestros equipos y clientes.",
        mustHave: [
          "+4 años de experiencia en roles de DevOps o SRE.",
          "Experiencia con AWS (o equivalente en otra nube).",
          "Manejo de Docker y orquestación con Kubernetes.",
          "Experiencia diseñando pipelines de CI/CD.",
          "Perfil resolutivo, cómodo con guardias/soporte productivo.",
        ],
        niceToHave: [
          "Experiencia con Terraform o infraestructura como código.",
          "Conocimientos de n8n u otras herramientas de automatización de workflows.",
          "Certificaciones cloud (AWS/Azure).",
        ],
      },
    ],
  },
  news: {
    backLink: "Volver al inicio",
    enNoticeHeading: "Este boletín se publica en español",
    enNoticeBody:
      "Nuestro boletín mensual de IA está escrito para el mercado hispanohablante. Cambiá a ES arriba para leer la última edición.",
  },
};

const EN: SiteContent = {
  nav: [
    { label: "Services", href: "#servicios" },
    { label: "Solutions", href: "/soluciones" },
    { label: "Success stories", href: "#casos" },
    { label: "News", href: "/novedades" },
    { label: "About us", href: "/nosotros" },
    { label: "Work with us", href: "/trabaja-con-nosotros" },
  ],
  cta: { talk: "Let's talk" },
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
    { value: 2, suffix: "M+", label: "man-hours" },
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
    framework: {
      label: "Our framework",
      title: "ARIA",
      desc: "Responsible AI Adoption: our 9-block framework to design the AI-Native company for the medium and long term, not a catalog of tools for the short term.",
      cta: "Discover the framework",
      href: "#contacto",
    },
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
          "Over 2,000 projects delivered and 2M+ accumulated man-hours working alongside their teams across the region.",
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
    backLink: "Back to home",
    portraitAlt: (n) => `Portrait of ${n}`,
    careersLink: "See open positions",
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
  finalCta: {
    heading: "Shall we build the team your project needs?",
    button: "Write to us",
  },
  contact: {
    heading: "Tell us about your project",
    subtitle: "We reply with a team proposal, not a brochure.",
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
      positionOther: "Other / not listed",
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
    subtitle: "AR IT Services' own products, built to solve real problems for teams and companies.",
    backLink: "Back to home",
    teaserCta: "See all solutions",
    cardCta: "Learn more",
    contactCta: "Let's talk about your project",
    labels: {
      problem: "The problem",
      example: "An example",
      how: "How it works",
      features: "What it includes",
      audience: "Who it's for",
    },
    logoAlt: (n) => `${n} logo`,
    products: [
      {
        id: "ario",
        name: "Ario",
        tagline: "Your documents, turned into data.",
        short:
          "Ario reads your documents and turns invoices, ID cards and PDFs into ready-to-use data, in seconds.",
        problem:
          "Many companies still copy data by hand from invoices, receipts and ID documents. It is slow, repetitive and error-prone.",
        example:
          "An accounting office receives 200 supplier invoices at the end of the month, and someone has to copy tax ID, date, number and amounts one by one into a spreadsheet. With Ario they upload them all together and get the data back, organized.",
        steps: [
          "You upload one or several documents (PDF or photo).",
          "You choose the document type: general, ID card, ARCA invoice or one with your own fields.",
          "Ario reads the document and extracts the data automatically.",
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
        tagline: "Your meeting, with a copilot.",
        short:
          "The AI meeting companion that listens to the conversation and suggests questions, risks and actions on screen while the meeting is still going.",
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
        name: "AR SDD",
        tagline: "From a request to a verifiable change.",
        short:
          "An AI-assisted development method and a technical kit to turn software requests into defined, reviewed and verifiable changes.",
        problem:
          "Using AI agents can speed up code changes, but without a shared framework it is hard to know what was requested, who approved it, what was validated and whether a piece of evidence is still valid.",
        steps: [
          "Context: the relevant project sources are selected and validated so agents work with the right context.",
          "Specification: the request becomes a spec, a reviewable and approvable contract for a change.",
          "Roles: implementer, verifier, reviewer and consolidator work in coordination, each with their own responsibility.",
          "Controls: before moving forward, gates check the requirements and approvals are tied to each version.",
          "Acceptance: QA keeps the quality validation and the final decision stays with the team.",
        ],
        features: [
          {
            title: "Context engineering",
            desc: "Selection and validation of the relevant project sources.",
          },
          {
            title: "Reviewable specifications",
            desc: "Every change starts from a clear contract the team can review and approve.",
          },
          {
            title: "Distinct roles",
            desc: "Implementation, verification, review and consolidation, with a central coordinator.",
          },
          {
            title: "Human control",
            desc: "Gates and per-version approvals keep authority with the team.",
          },
          {
            title: "Adopted per project",
            desc: "Introduced selectively on an existing project, starting with a focused change.",
          },
        ],
        audience:
          "In-house development teams and consultancies already using AI assistants that need more control over changes: CTOs, tech leads, developers and QA.",
      },
    ],
  },
  frameworkModal: {
    eyebrow: "Proprietary framework",
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
    backLink: "Back to home",
    backToPositionsLabel: "Back to positions",
    intro:
      "25 years building teams that stay. We look for people who want to solve real problems, not profiles that fit a checklist.",
    positionsHeading: "Open positions",
    emptyHeading: "No open positions right now",
    emptyBody:
      "That changes often. Send us your profile and we'll reach out when something matches.",
    applyCta: "Send us your CV",
    positionCtaLabel: "Apply",
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
    refreshingLabel: "Refreshing…",
    updatedLabel: "Updated",
    errorHeading: "We couldn't load the positions",
    errorBody: "We're having trouble reaching our recruiting system. Please try again in a moment.",
    vacancyOne: "1 opening available",
    vacancyMany: "openings available",
    publishedLabel: "Posted",
    englishLevelLabel: "English level required",
    enNoticeHeading: "Open positions are published in Spanish",
    enNoticeBody:
      "These listings come straight from our recruiting system, which publishes them in Spanish. Send us your CV in Spanish and we'll get back to you.",
    positions: [
      {
        title: "Senior .NET Developer",
        category: "Full Stack",
        location: "Córdoba, Argentina",
        modality: "Hybrid (remote + office when required)",
        seniority: "Senior",
        stack: [".NET", "C#", "React", "SQL Server"],
        intro:
          "We're hiring a Senior .NET Developer to join a team that works on products that ship to production and stay maintained, not just prototypes.",
        mustHave: [
          "5+ years of experience with .NET and C# development.",
          "Experience with React on the frontend.",
          "Solid SQL Server skills and relational data modeling.",
          "Familiarity with agile methodologies (Scrum/Kanban).",
          "Autonomous profile, comfortable making technical decisions.",
        ],
        niceToHave: [
          "Experience with Azure or AWS.",
          "Daily use of AI coding tools (Copilot, Claude Code).",
          "Experience leading small teams or mentoring junior devs.",
        ],
      },
      {
        title: "Data Engineer",
        category: "Data",
        location: "Remote (Argentina)",
        modality: "100% remote",
        seniority: "Mid / Senior",
        stack: ["Python", "SQL", "Power BI", "Apache Airflow"],
        intro:
          "We're hiring a Data Engineer to design and maintain the data pipelines behind predictive models and dashboards our clients' teams use every day.",
        mustHave: [
          "3+ years of experience building data pipelines in Python.",
          "Advanced SQL and data modeling experience.",
          "Hands-on with Power BI or an equivalent BI tool.",
          "Experience orchestrating workflows (Airflow or similar).",
          "Analytical profile with a sharp eye for data quality.",
        ],
        niceToHave: [
          "Experience with applied machine learning.",
          "Cloud data services (BigQuery, Redshift, Synapse).",
          "Working English for reading documentation.",
        ],
      },
      {
        title: "QA Automation Engineer",
        category: "QA",
        location: "Córdoba, Argentina",
        modality: "Hybrid (remote + office when required)",
        seniority: "Mid-level",
        stack: ["Java", "Playwright", "Cypress", "CI/CD"],
        intro:
          "We're hiring a QA Automation Engineer to design testing strategies and automate validation before products reach production.",
        mustHave: [
          "3+ years of experience in QA Automation.",
          "Solid functional testing experience.",
          "Building automations with Java and/or Python.",
          "Comfortable with Jira and bug-tracking tools.",
          "Proactive profile, focused on continuous improvement.",
        ],
        niceToHave: [
          "Experience with Playwright, Cypress or Selenium.",
          "Integrating tests into CI/CD pipelines.",
          "API testing knowledge (Postman).",
        ],
      },
      {
        title: "Mobile Developer (iOS / Android)",
        category: "Mobile",
        location: "Remote (Argentina / LatAm)",
        modality: "100% remote",
        seniority: "Mid-level",
        stack: ["React Native", "TypeScript", "iOS", "Android"],
        intro:
          "We're hiring a Mobile Developer to work on apps that are already live, with real users, not just in the prototype stage.",
        mustHave: [
          "3+ years of experience building mobile apps with React Native.",
          "Solid TypeScript skills.",
          "Experience shipping apps to the App Store and Google Play.",
          "Comfortable with Git and PR/code review workflows.",
        ],
        niceToHave: [
          "Experience with native development (Swift or Kotlin).",
          "Mobile CI/CD knowledge (Fastlane, EAS).",
          "Experience with automated mobile testing.",
        ],
      },
      {
        title: "DevOps Engineer",
        category: "DevOps",
        location: "Córdoba, Argentina",
        modality: "Hybrid (remote + office when required)",
        seniority: "Senior",
        stack: ["AWS", "Docker", "Kubernetes", "n8n"],
        intro:
          "We're hiring a DevOps Engineer to maintain and improve the infrastructure and deployment pipelines for our teams and clients.",
        mustHave: [
          "4+ years of experience in DevOps or SRE roles.",
          "Experience with AWS (or an equivalent cloud provider).",
          "Hands-on with Docker and Kubernetes orchestration.",
          "Experience designing CI/CD pipelines.",
          "Resolutive profile, comfortable with production on-call support.",
        ],
        niceToHave: [
          "Experience with Terraform or infrastructure as code.",
          "Knowledge of n8n or other workflow automation tools.",
          "Cloud certifications (AWS/Azure).",
        ],
      },
    ],
  },
  news: {
    backLink: "Back to home",
    enNoticeHeading: "This newsletter is published in Spanish",
    enNoticeBody:
      "Our monthly AI newsletter is written for the Spanish-speaking market. Switch to ES above to read the latest issue.",
  },
};

// Rutas que la versión "intermedia" no expone en el menú ni en el footer
// (los archivos de ruta y su contenido siguen intactos en el repo).
const HIDDEN_IN_INTERMEDIO = ["/novedades", "/trabaja-con-nosotros", "#casos"];

export function getContent(lang: Lang): SiteContent {
  const base = lang === "EN" ? EN : ES;
  if (!isIntermedio) return base;
  return { ...base, nav: base.nav.filter((n) => !HIDDEN_IN_INTERMEDIO.includes(n.href)) };
}
