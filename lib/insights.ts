export type InsightPost = {
  slug: string
  title: string
  excerpt: string
  category: string
  publishedAt: string
  readingTime: string
  keywords: string[]
  content: string
}

export const INSIGHT_POSTS: InsightPost[] = [
  {
    slug: 'woocommerce-plugin-development-guide',
    title: 'What Makes a WooCommerce Plugin Production-Ready?',
    excerpt:
      'A practical checklist for building WooCommerce plugins that are secure, scalable, and easy for store owners to use.',
    category: 'WooCommerce',
    publishedAt: '2026-05-22',
    readingTime: '5 min read',
    keywords: ['WooCommerce', 'WordPress plugins', 'eCommerce development'],
    content: `
## Why production-ready matters

WooCommerce plugins often start as a small feature request, but they quickly become business-critical when they affect checkout, inventory, pricing, or customer experience.

## Core requirements

- Clear admin settings with safe defaults
- Compatibility with modern WooCommerce versions
- Secure validation and sanitization for every input
- Fast database queries and cache-aware logic
- Clean error handling for store owners

## Store owner experience

A good plugin should feel native inside WordPress. The setup should be obvious, documentation should explain edge cases, and support should not require reading code.

## Technical checklist

- Use WordPress hooks intentionally
- Avoid direct database writes unless necessary
- Test checkout and cart flows carefully
- Keep frontend scripts lightweight
- Make updates backward-compatible
`,
  },
  {
    slug: 'shopify-app-integrations-for-growing-stores',
    title: 'Shopify App Integrations for Growing Commerce Stores',
    excerpt:
      'How custom Shopify apps and integrations help automate operations, improve UX, and connect business systems.',
    category: 'Shopify',
    publishedAt: '2026-05-22',
    readingTime: '4 min read',
    keywords: ['Shopify apps', 'API integrations', 'eCommerce automation'],
    content: `
## When a custom Shopify app makes sense

Custom Shopify apps are useful when a store needs workflows that standard apps cannot handle cleanly. This can include inventory syncing, custom dashboards, private fulfillment flows, or special customer experiences.

## Common integrations

- ERP and inventory systems
- CRM and customer support tools
- Custom checkout and post-purchase flows
- Analytics and reporting dashboards
- Marketing automation platforms

## What to prioritize

Start with the business workflow, not the API. The best integration is reliable, simple for staff, and easy to monitor when something fails.
`,
  },
  {
    slug: 'business-automation-with-n8n-and-ai',
    title: 'Business Automation with n8n and AI Workflows',
    excerpt:
      'A practical look at using n8n, AI, and integrations to reduce manual work across sales, support, and operations.',
    category: 'Automation',
    publishedAt: '2026-05-22',
    readingTime: '5 min read',
    keywords: ['n8n automation', 'AI workflows', 'business automation'],
    content: `
## Automation should remove real friction

The best automation saves time in a workflow that already happens every day. It should reduce copy-paste work, improve response speed, and make operations easier to audit.

## High-value automation examples

- Lead capture to CRM workflows
- Support ticket classification with AI
- Order notifications and fulfillment updates
- Weekly reporting from multiple data sources
- Internal alerts for failed payments or broken workflows

## Where AI fits

AI is useful for classification, summarization, routing, and draft generation. It should be paired with clear rules and human review for sensitive business actions.
`,
  },
  {
    slug: 'data-analytics-dashboards-for-commerce',
    title: 'Data Analytics Dashboards Every Commerce Business Needs',
    excerpt:
      'The core KPIs and dashboard structure that help online businesses understand revenue, customers, products, and marketing performance.',
    category: 'Data Analytics',
    publishedAt: '2026-05-22',
    readingTime: '4 min read',
    keywords: ['data analytics', 'dashboards', 'commerce reporting'],
    content: `
## Data should answer business questions

A useful dashboard does not just show charts. It answers questions like what is selling, where revenue is coming from, and which customer segments need attention.

## Core dashboard sections

- Revenue and order trends
- Top-selling products
- Customer acquisition channels
- Repeat purchase behavior
- Refunds, failed payments, and support issues

## Better decisions from better structure

Start with a clean data model, define KPIs, and keep dashboards focused. A smaller dashboard that teams actually use is better than a large dashboard nobody trusts.
`,
  },
]

export function getInsightPosts() {
  return [...INSIGHT_POSTS].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
}

export function getInsightPost(slug: string) {
  return INSIGHT_POSTS.find((post) => post.slug === slug)
}
