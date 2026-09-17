import type { BentoCard } from "@/components/site/MagicBento";
import type { Lang } from "./language";
import { isIntermedio } from "@/lib/site-mode";

export type NavItem = { label: string; href: string };

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
    cards: BentoCard[];
    highlightCards: ServiceLinkCard[];
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
    success: string;
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
    disciplines: {
      id: string;
      label: string;
      roles: { role: string; qty: number }[];
    }[];
  };
  careers: {
    heading: string;
    backLink: string;
    intro: string;
    positionsHeading: string;
    emptyHeading: string;
    emptyBody: string;
    applyCta: string;
    positionCtaLabel: string;
    mustHaveLabel: string;
    niceToHaveLabel: string;
    filterAllLabel: string;
    filterEmptyMessage: string;
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
      "Ayudamos a las organizaciones a convertirse en **empresas nativas de IA**, desde la estrategia hasta la implementación y la expansión.",
      "Creamos el equipo que tu producto realmente necesita: **datos e inteligencia artificial** que se integran en el proceso, no solo en teoría.",
      "Los datos son el punto de partida de la IA: transformamos la información sin procesar en **modelos, conocimientos y decisiones** en las que puedes confiar.",
    ],
  },
  metrics: [
    { value: 25, suffix: "+", label: "años de trayectoria" },
    { value: 2000, suffix: "+", label: "proyectos entregados" },
    { value: 3, suffix: "", label: "países con oficina propia" },
    { value: 2, suffix: "M+", label: "horas-hombre con Claro" },
  ],
  services: {
    heading: "Qué hacemos",
    cards: [
      {
        title: "IA Aplicada & Agentes",
        desc: "Sumamos IA generativa y agentes al producto del cliente: menos tiempo de desarrollo, misma calidad, sin sumar headcount.",
        label: "IA",
        span: "large",
      },
      {
        title: "Ciencia de Datos & BI",
        desc: "Modelos predictivos, machine learning aplicado y tableros en Power BI que se usan todos los días.",
        label: "Datos & BI",
        span: "large",
      },
      {
        title: "Equipos dedicados & Scrum",
        desc: "Perfiles seleccionados, on-boarding rápido y ceremonias que se cumplen.",
        label: "Talento",
        span: "large",
      },
      {
        title: "Desarrollo Web & Mobile",
        desc: ".NET, React, iOS y Android. Productos que salen a producción y se mantienen, con equipos que conocen el negocio del cliente.",
      },
      {
        title: "QA & Testing",
        desc: "Automatización de pruebas y control de calidad integrado al ciclo de desarrollo.",
      },
      {
        title: "Automatización",
        desc: "Flujos con n8n, pipelines de DevOps y despliegues repetibles.",
      },
      {
        title: "Consultoría & Project Management",
        desc: "Planificamos, medimos y reportamos avance con números, no con impresiones.",
      },
    ],
    highlightCards: [
      {
        label: "Tecnología",
        title: "AI Gateway & Governance",
        desc: "Control centralizado del uso de IA en tu empresa: seguridad de datos, costos por equipo y trazabilidad completa para auditoría.",
        cta: "Conocé más",
        href: "#contacto",
      },
      {
        label: "Tecnología",
        title: "AI Agents",
        desc: "Agentes que ejecutan tareas y procesos con autonomía, con el nivel de supervisión humana que cada caso de uso requiere.",
        cta: "Conocé más",
        href: "#contacto",
      },
      {
        label: "Tecnología",
        title: "Data Architecture & RAG",
        desc: "La base de datos que permite escalar IA más allá de un piloto: RAG, embeddings y datos tratados como producto interno.",
        cta: "Conocé más",
        href: "#contacto",
      },
      {
        label: "Tecnología",
        title: "AI-Native Engineering / MLOps-LLMOps",
        desc: "Arquitectura, CI/CD y componentes reusables para llevar agentes e IA de un piloto a producción de forma sostenible.",
        cta: "Conocé más",
        href: "#contacto",
      },
    ],
    framework: {
      label: "Framework propio",
      title: "ARIA",
      desc: "Adopción Responsable de Inteligencia Artificial: nuestro framework de 9 bloques para diseñar la empresa AI-Native del mediano y largo plazo — no un catálogo de herramientas para el corto plazo.",
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
      "Detrás de cada proyecto hay personas que se quedan. 25 años, un mismo equipo de socios al frente.",
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
    projectOptions: [
      "Desarrollo web/mobile",
      "Data & BI",
      "Staffing / equipo dedicado",
      "Otro",
    ],
    submit: "Enviar consulta",
    success: "Gracias. Te vamos a contactar a la brevedad.",
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
    disciplines: [
      { id: "dotnet-react", label: ".NET & React", roles: [{ role: "Dev .NET Senior", qty: 2 }, { role: "Dev React", qty: 2 }] },
      { id: "data-bi", label: "Data & Power BI", roles: [{ role: "Data Engineer", qty: 1 }, { role: "Analista Power BI", qty: 1 }] },
      { id: "qa", label: "QA & Testing", roles: [{ role: "QA Automation", qty: 1 }] },
      { id: "scrum", label: "Scrum Master", roles: [{ role: "Scrum Master", qty: 1 }] },
      { id: "mobile", label: "Mobile", roles: [{ role: "Dev iOS / Android", qty: 2 }] },
      { id: "devops", label: "DevOps & n8n", roles: [{ role: "DevOps Engineer", qty: 1 }, { role: "Especialista Automatización", qty: 1 }] },
      { id: "pm", label: "Project Manager", roles: [{ role: "Project Manager", qty: 1 }] },
    ],
  },
  careers: {
    heading: "Sumate al equipo",
    backLink: "Volver al inicio",
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
    filterAllLabel: "Todas",
    filterEmptyMessage: "No hay búsquedas abiertas para esta categoría por ahora.",
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
      "Data is where AI begins — we turn raw information into **models, insights, and decisions** you can rely on.",
    ],
  },
  metrics: [
    { value: 25, suffix: "+", label: "years in business" },
    { value: 2000, suffix: "+", label: "projects delivered" },
    { value: 3, suffix: "", label: "countries with our own office" },
    { value: 2, suffix: "M+", label: "man-hours with Claro" },
  ],
  services: {
    heading: "What we do",
    cards: [
      {
        title: "AI Applied & Agents",
        desc: "We embed generative AI and agents into the client's product: less development time, same quality, no added headcount.",
        label: "AI",
        span: "large",
      },
      {
        title: "Data Science & BI",
        desc: "Predictive models, applied machine learning and Power BI dashboards used every day.",
        label: "Data & BI",
        span: "large",
      },
      {
        title: "Dedicated teams & Scrum",
        desc: "Hand-picked profiles, fast onboarding and ceremonies that actually happen.",
        label: "Talent",
        span: "large",
      },
      {
        title: "Web & Mobile Development",
        desc: ".NET, React, iOS and Android. Products that ship to production and are maintained, with teams that understand the client's business.",
      },
      {
        title: "QA & Testing",
        desc: "Test automation and quality control integrated into the development cycle.",
      },
      {
        title: "Automation",
        desc: "n8n workflows, DevOps pipelines and repeatable deployments.",
      },
      {
        title: "Consulting & Project Management",
        desc: "We plan, measure and report progress with numbers, not impressions.",
      },
    ],
    highlightCards: [
      {
        label: "Technology",
        title: "AI Gateway & Governance",
        desc: "Centralized control over AI usage in your company: data security, cost per team and full traceability for auditing.",
        cta: "Learn more",
        href: "#contacto",
      },
      {
        label: "Technology",
        title: "AI Agents",
        desc: "Agents that execute tasks and processes autonomously, with the level of human oversight each use case requires.",
        cta: "Learn more",
        href: "#contacto",
      },
      {
        label: "Technology",
        title: "Data Architecture & RAG",
        desc: "The data foundation that lets AI scale beyond a pilot: RAG, embeddings and data treated as an internal product.",
        cta: "Learn more",
        href: "#contacto",
      },
      {
        label: "Technology",
        title: "AI-Native Engineering / MLOps-LLMOps",
        desc: "Architecture, CI/CD and reusable components to take agents and AI from pilot to production sustainably.",
        cta: "Learn more",
        href: "#contacto",
      },
    ],
    framework: {
      label: "Our framework",
      title: "ARIA",
      desc: "Responsible AI Adoption: our 9-block framework to design the AI-Native company for the medium and long term — not a catalog of tools for the short term.",
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
    statement:
      "Behind every project there are people who stay. 25 years, the same team of partners in charge.",
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
    projectOptions: [
      "Web/mobile development",
      "Data & BI",
      "Staffing / dedicated team",
      "Other",
    ],
    submit: "Send inquiry",
    success: "Thanks. We'll get in touch shortly.",
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
    disciplines: [
      { id: "dotnet-react", label: ".NET & React", roles: [{ role: "Senior .NET Dev", qty: 2 }, { role: "React Dev", qty: 2 }] },
      { id: "data-bi", label: "Data & Power BI", roles: [{ role: "Data Engineer", qty: 1 }, { role: "Power BI Analyst", qty: 1 }] },
      { id: "qa", label: "QA & Testing", roles: [{ role: "QA Automation", qty: 1 }] },
      { id: "scrum", label: "Scrum Master", roles: [{ role: "Scrum Master", qty: 1 }] },
      { id: "mobile", label: "Mobile", roles: [{ role: "iOS / Android Dev", qty: 2 }] },
      { id: "devops", label: "DevOps & n8n", roles: [{ role: "DevOps Engineer", qty: 1 }, { role: "Automation Specialist", qty: 1 }] },
      { id: "pm", label: "Project Manager", roles: [{ role: "Project Manager", qty: 1 }] },
    ],
  },
  careers: {
    heading: "Join the team",
    backLink: "Back to home",
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
    filterAllLabel: "All",
    filterEmptyMessage: "No open positions in this category right now.",
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
const HIDDEN_IN_INTERMEDIO = ["/novedades", "/trabaja-con-nosotros"];

export function getContent(lang: Lang): SiteContent {
  const base = lang === "EN" ? EN : ES;
  if (!isIntermedio) return base;
  return { ...base, nav: base.nav.filter((n) => !HIDDEN_IN_INTERMEDIO.includes(n.href)) };
}
