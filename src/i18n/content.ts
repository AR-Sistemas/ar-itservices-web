import type { BentoCard } from "@/components/site/MagicBento";
import type { Lang } from "./language";

export type NavItem = { label: string; href: string };

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
  };
  metrics: { value: number; suffix: string; label: string }[];
  services: { heading: string; cards: BentoCard[] };
  cases: {
    heading: string;
    challengeLabel: string;
    resultLabel: string;
    items: { client: string; challenge: string; result: string }[];
  };
  stack: { heading: string; logoAlt: (name: string) => string };
  people: {
    heading: string;
    statement: string;
    ctaLink: string;
    backLink: string;
    items: { name: string; role: string; quote: string }[];
    portraitAlt: (name: string) => string;
  };
  finalCta: { heading: string; button: string };
  contact: {
    heading: string;
    subtitle: string;
    fields: {
      name: string;
      email: string;
      company: string;
      country: string;
      projectType: string;
      message: string;
    };
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
};

const ES: SiteContent = {
  nav: [
    { label: "Servicios", href: "#servicios" },
    { label: "Casos de éxito", href: "#casos" },
    { label: "Nosotros", href: "/nosotros" },
    { label: "Carreras", href: "#carreras" },
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
  people: {
    heading: "Nuestra gente",
    statement:
      "Detrás de cada proyecto hay personas que se quedan. 25 años, un mismo equipo de socios al frente.",
    ctaLink: "Conocé a nuestra gente",
    backLink: "Volver al inicio",
    portraitAlt: (n) => `Retrato de ${n}`,
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
    fields: {
      name: "Nombre",
      email: "Email",
      company: "Empresa",
      country: "País",
      projectType: "Tipo de proyecto",
      message: "Mensaje",
    },
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
};

const EN: SiteContent = {
  nav: [
    { label: "Services", href: "#servicios" },
    { label: "Success stories", href: "#casos" },
    { label: "About us", href: "/nosotros" },
    { label: "Careers", href: "#carreras" },
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
  people: {
    heading: "Our people",
    statement:
      "Behind every project there are people who stay. 25 years, the same team of partners in charge.",
    ctaLink: "Meet our people",
    backLink: "Back to home",
    portraitAlt: (n) => `Portrait of ${n}`,
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
    fields: {
      name: "Name",
      email: "Email",
      company: "Company",
      country: "Country",
      projectType: "Project type",
      message: "Message",
    },
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
};

export function getContent(lang: Lang): SiteContent {
  return lang === "EN" ? EN : ES;
}
