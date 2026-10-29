// ============================================================
// lib/site-content.ts
// Static marketing copy shared across pages. Admin-managed
// records (services, FAQs, team) fall back to these defaults.
// ============================================================

export const CONTACT_EMAIL = 'dhanesh.kumar15@gmail.com'

// Shown at the top of the legal pages. Update when a policy changes.
export const LEGAL_UPDATED = 'October 29, 2026'

export const NAV_LINKS = [
  { label: 'Services', href: '/#services' },
  { label: 'How we work', href: '/#how-we-work' },
  { label: 'Team', href: '/#team' },
  { label: 'Insights', href: '/insights' },
  { label: 'Products', href: '/marketplace' },
]

export const FOOTER_COLUMNS = [
  {
    title: 'Services',
    links: [
      { label: 'Plugin Development', href: '/contact?service=woocommerce-plugin' },
      { label: 'Shopify Apps', href: '/contact?service=shopify-app' },
      { label: 'AI & Automation', href: '/contact?service=ai-chatbot&service=n8n-automation' },
      { label: 'Full-Stack', href: '/contact?service=web-app' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'How we work', href: '/#how-we-work' },
      { label: 'Insights', href: '/insights' },
      { label: 'Products', href: '/marketplace' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Refund Policy', href: '/refund' },
    ],
  },
]

// Options in the hero "Start a project" picker and the contact form.
// `value` is what travels in the ?service= query param.
export const SERVICE_OPTIONS = [
  { value: 'woocommerce-plugin', label: 'WooCommerce plugin' },
  { value: 'shopify-app', label: 'Shopify app' },
  { value: 'ai-chatbot', label: 'AI chatbot' },
  { value: 'n8n-automation', label: 'n8n automation' },
  { value: 'web-app', label: 'Web app' },
  { value: 'dashboards', label: 'Dashboards' },
] as const

export type ServiceOptionValue = (typeof SERVICE_OPTIONS)[number]['value']

export function parseServiceParam(value: string | string[] | undefined): ServiceOptionValue[] {
  const raw = (Array.isArray(value) ? value : value ? [value] : []).flatMap((v) => v.split(','))
  const allowed = new Set<string>(SERVICE_OPTIONS.map((o) => o.value))
  return Array.from(new Set(raw.map((v) => v.trim()).filter((v) => allowed.has(v)))) as ServiceOptionValue[]
}

export function contactHref(services: readonly string[]) {
  if (services.length === 0) return '/contact'
  const params = new URLSearchParams()
  services.forEach((s) => params.append('service', s))
  return `/contact?${params.toString()}`
}

// Maps a service card (by sourceKey) to its picker option.
export const SERVICE_KEY_TO_OPTION: Record<string, ServiceOptionValue> = {
  'custom-plugin-development': 'woocommerce-plugin',
  'shopify-apps-integrations': 'shopify-app',
  'ai-solutions-chatbots': 'ai-chatbot',
  'full-stack-development': 'web-app',
  'business-automation-n8n': 'n8n-automation',
  'data-analytics-reporting': 'dashboards',
}

export const TECH_STACK = [
  'Next.js', 'React', 'Node.js', 'PostgreSQL', 'n8n', 'WooCommerce',
  'Shopify', 'Magento', 'OpenAI', 'Python', 'AWS',
]

export const PROCESS_STEPS = [
  { title: 'Discovery call', description: 'A free 30-minute call to understand your goals, stack and timeline.' },
  { title: 'Fixed-price scope', description: 'A written plan with milestones, deliverables and a clear price.' },
  { title: 'Build in the open', description: 'Weekly demos and a shared board, so you see progress as it happens.' },
  { title: 'Launch & support', description: 'We ship, hand over documentation and stay on for fixes.' },
]

export const PILLARS = [
  { title: 'Scalable architecture', description: 'Systems designed for your next stage of growth, not just today’s traffic.' },
  { title: 'Enterprise security', description: 'Secure auth, careful data handling and clean, reviewed code.' },
  { title: 'AI where it helps', description: 'Practical AI that saves your team time in support, recommendations and everyday workflows.' },
  { title: 'Measurable outcomes', description: 'Every build is scoped against a result you can point to.' },
]

export const DEFAULT_FAQS = [
  {
    id: 'pricing',
    question: 'How do you price projects?',
    answer: 'After a free discovery call we send a fixed-price scope with milestones, so you know the cost before any work starts.',
  },
  {
    id: 'existing',
    question: 'Can you work with our existing store or codebase?',
    answer: 'Yes. We regularly extend existing WooCommerce, Shopify and Magento stores and custom Next.js / Node apps.',
  },
  {
    id: 'after-launch',
    question: 'What happens after launch?',
    answer: 'Every project includes a support window for fixes. Ongoing maintenance and new features can be arranged as a monthly retainer.',
  },
  {
    id: 'location',
    question: 'Where are you based?',
    answer: 'We’re remote-first and work with clients worldwide, with overlap hours for US, UK, EU and Gulf time zones.',
  },
]

export const TEAM_INTRO = {
  title: 'The people you’ll work with',
  description:
    'A small, senior team. The engineers who scope your project are the ones who build it. No account managers and no hand-offs, just one shared channel from discovery call to launch.',
}

export const DEFAULT_TEAM = [
  {
    name: 'Dhanesh Kumar',
    role: 'Founder & Principal Engineer',
    bio: 'Leads every engagement from the first call, covering scoping, architecture and the code itself. Works across WooCommerce and Shopify extensions, Next.js platforms, n8n automation and AI integrations, and owns the fixed-price scope you sign off on.',
    focus: ['Architecture', 'Next.js', 'WooCommerce', 'AI'],
    linkedInUrl: 'https://www.linkedin.com/in/dhaneshkum15/',
    githubUrl: 'https://github.com/DanexhKum/',
  },
  {
    name: 'Hitesh Kumar',
    role: 'Software Engineer',
    bio: 'Builds the integrations that connect your store to the rest of your stack, from n8n workflows and APIs to AI features like support bots and product recommendations. Everything is designed to keep running quietly after launch.',
    focus: ['n8n', 'APIs', 'Machine learning'],
    linkedInUrl: 'https://www.linkedin.com/in/hitesh-kumar-85454323a/',
    githubUrl: 'https://github.com/hitesh311',
  },
  {
    name: 'Aastha Gupta',
    role: 'Data Analyst',
    bio: 'Turns sales, customer and marketing data into dashboards your team actually opens. That means cleaning the data, defining the KPIs and building the reporting pipelines behind them.',
    focus: ['Python', 'Data pipelines', 'Dashboards'],
    linkedInUrl: 'https://www.linkedin.com/in/aastha-gupta-2001582bb/',
    githubUrl: 'https://github.com/A2A2S2T2H2A2-RANI',
  },
]
