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

type InsightSource = Omit<InsightPost, 'readingTime'>

// Reading time is derived from the article itself (about 220 words a minute)
// so the label always matches the content.
function withReadingTime(post: InsightSource): InsightPost {
  const words = post.content.split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.round(words / 220))
  return { ...post, readingTime: `${minutes} min read` }
}

const SOURCES: InsightSource[] = [
  {
    slug: 'woocommerce-plugin-development-guide',
    title: 'What Makes a WooCommerce Plugin Production-Ready?',
    excerpt:
      'A practical checklist for building WooCommerce plugins that are secure, fast and easy for store owners to live with.',
    category: 'WooCommerce',
    publishedAt: '2026-05-22',
    keywords: ['WooCommerce', 'WordPress plugins', 'eCommerce development'],
    content: `
Most WooCommerce plugins start as a small request. Add a field at checkout. Sync stock with a supplier. Apply a discount rule the built-in coupons cannot express. A week later that small feature sits in the path of every order the store takes, and the bar for quality changes completely.

"Production-ready" is not a label you add at the end. It is a set of decisions made from the first line of code. Here is the checklist we work through on every plugin we build or take over.

## 1. It respects the checkout

Checkout is where a store makes its money, so it is where a plugin can do the most damage. Anything that touches the cart, totals, shipping or payment needs to be tested against the real flows a customer goes through: guest checkout, logged-in checkout, coupons, multiple shipping methods and the block-based checkout that newer stores use.

We also keep checkout logic small. Heavy work such as calling an external API or generating a document belongs in a background job, not in the request that is holding a customer's order.

## 2. Every input is treated as hostile

WordPress gives you good tools for security, but only if you use them every time:

- **Sanitize on the way in.** Every value from a form, a URL or an API is cleaned with the right sanitizing function for its type.
- **Escape on the way out.** Every value printed to a page is escaped for its context: HTML, attribute, URL or JavaScript.
- **Check capabilities and nonces.** Admin actions confirm the user is allowed to perform them and that the request really came from your settings screen.
- **Use prepared statements.** Any custom query goes through \`$wpdb->prepare()\` instead of string concatenation.

None of this is exotic. It is simply easy to skip once, and once is enough.

## 3. It stays fast as the store grows

A plugin that is quick on a test site with twenty products can bring a store with fifty thousand to a crawl. The usual causes are predictable:

- Queries inside loops, which turn one page load into hundreds of database calls
- Loading scripts and styles on every page instead of only where they are needed
- Storing large amounts of data in options that WordPress loads on every request
- Calling external services synchronously without timeouts or caching

We profile plugins against realistic data volumes before release, use transients or object caching for expensive lookups, and keep frontend assets lean.

## 4. Store owners can run it without a developer

The people using a plugin day to day are store owners and their staff, not engineers. A good plugin feels like part of WooCommerce:

- Settings live where people expect to find them and come with safe defaults
- Labels use the store's language, not internal jargon
- Errors explain what went wrong and what to do next
- Destructive actions ask for confirmation

If support requests keep asking the same question, the interface is usually the problem, not the user.

## 5. Updates do not break things

Stores update WordPress, WooCommerce and their theme on their own schedule. A production plugin declares the versions it supports, avoids relying on internal functions that may change, and migrates its own data carefully between versions. Database changes are versioned and reversible, and settings from older releases keep working.

We also follow WooCommerce's own compatibility signals, such as declaring support for High-Performance Order Storage, so store owners are not met with warnings after an update.

## 6. Problems are visible

When something fails at 2am, someone needs to find out why. We log meaningful events through WooCommerce's logger, surface failed background jobs in the admin, and make sure errors in integrations do not fail silently.

## A short checklist

Before a plugin goes live on a real store, we confirm that:

- Checkout, cart and order flows have been tested end to end
- All input is sanitized, all output is escaped, and admin actions check capabilities
- Performance has been checked against realistic product and order counts
- Settings are clear and safe by default
- Supported versions are declared and updates migrate data cleanly
- Failures are logged somewhere a human will see them

If you are extending a store with a custom plugin, or inheriting one that feels fragile, this list is a good place to start the conversation.
`,
  },
  {
    slug: 'shopify-app-integrations-for-growing-stores',
    title: 'Shopify App Integrations for Growing Commerce Stores',
    excerpt:
      'When a custom Shopify app is worth building, which integrations matter most, and how to keep them reliable.',
    category: 'Shopify',
    publishedAt: '2026-05-22',
    keywords: ['Shopify apps', 'API integrations', 'eCommerce automation'],
    content: `
The Shopify App Store has an app for almost everything, and for many stores that is exactly the right answer. Installing a well-supported public app is faster and cheaper than building anything custom.

Growing stores reach a point where that stops being true. The team is copying orders into a spreadsheet, stock is updated by hand twice a day, or three apps are chained together to do one job. That is usually the moment a custom app or integration starts to pay for itself.

## When a custom app makes sense

We recommend building something custom when at least one of these is true:

- **The workflow is specific to your business.** Wholesale pricing rules, custom bundles, or approval steps that no public app models properly.
- **Data needs to move between Shopify and another system you own.** An ERP, a warehouse system, a CRM or an internal database.
- **You are paying for several apps to do one job.** Replacing a fragile chain of apps with one focused integration often lowers both cost and risk.
- **Staff spend hours on repetitive admin.** If a task follows clear rules, it can usually be automated.

If none of these apply, a public app is probably the better choice, and we will say so.

## The integrations that matter most

In our experience, a small number of integrations do most of the work for growing stores:

### Inventory and fulfilment

Keeping stock accurate across Shopify, a warehouse and sometimes a marketplace is the most common reason stores come to us. The goal is a single source of truth for stock, with changes flowing out to every channel quickly and predictably.

### ERP and accounting

Orders, refunds and payouts need to reach the finance system without someone retyping them. A good integration maps Shopify's data to the shape your accounting system expects and handles the awkward cases, such as partial refunds and edited orders.

### CRM and customer support

Support teams work faster when they can see a customer's orders next to the conversation. Syncing customers and orders into the CRM, or surfacing them inside the helpdesk, removes a lot of tab switching.

### Reporting

Shopify's built-in reports cover the basics. Many teams eventually want sales, marketing and operations data in one place, which means exporting Shopify data into a warehouse or dashboard on a schedule.

## How we build them to be reliable

Integrations fail in boring ways: an API is briefly down, a rate limit is hit, a webhook arrives twice. Reliability comes from expecting this.

- **Use webhooks, then verify.** Webhooks tell you something changed. A scheduled reconciliation job confirms nothing was missed.
- **Make every operation safe to repeat.** If the same order arrives twice, it should not be created twice.
- **Respect rate limits.** Shopify's Admin API limits how fast you can call it. Queues and backoff keep bulk jobs within those limits instead of failing halfway.
- **Prefer the GraphQL Admin API** for new work. It lets you request exactly the data you need and is where Shopify is focusing new features.
- **Log and alert.** When something fails, the right person should find out from a notification, not from a customer.

## Start with the workflow, not the API

The best integrations begin with a clear description of the work people do today. Who touches the order, in which system, and what goes wrong? Once that is written down, the technical design is usually straightforward.

If your team is spending time on work that feels like it should be automatic, that is a good starting point for a discovery call.
`,
  },
  {
    slug: 'business-automation-with-n8n-and-ai',
    title: 'Business Automation with n8n and AI Workflows',
    excerpt:
      'How to use n8n and AI to remove repetitive work across sales, support and operations, without creating new risks.',
    category: 'Automation',
    publishedAt: '2026-05-22',
    keywords: ['n8n automation', 'AI workflows', 'business automation'],
    content: `
Every business has work that follows the same steps every time. A lead arrives, someone copies it into the CRM and sends a reply. An order ships, someone updates a spreadsheet and emails the customer. Each task takes a few minutes, but together they quietly consume hours every week.

Automation is about giving that time back. Done well, it also makes work faster and more consistent. Done badly, it creates invisible failures that nobody notices until a customer complains.

## Why we often use n8n

n8n is a workflow automation tool that connects apps and services through visual workflows. We reach for it often because:

- **It can be self-hosted,** so sensitive data can stay on infrastructure you control
- **It handles real logic,** including branching, loops, error paths and custom code when needed
- **It connects to hundreds of services** out of the box, and to almost anything else through HTTP and webhooks
- **Workflows are readable,** so your team can see what an automation does without reading source code

It is not the right tool for everything. Very high volume processing or complex application logic belongs in custom code. For connecting business systems, it is an excellent fit.

## Where automation pays off first

The best candidates are tasks that happen often, follow clear rules and currently involve copying data between systems:

- **Lead capture.** Form submissions go straight into the CRM, are enriched with company details and routed to the right person.
- **Order operations.** New orders trigger fulfilment updates, customer notifications and internal alerts for unusual cases.
- **Reporting.** Data from several tools is collected on a schedule and delivered as a summary every Monday morning.
- **Internal alerts.** Failed payments, low stock or broken integrations notify the right channel immediately.

## Where AI fits

Language models are useful in automation when a step requires reading or writing text rather than following a fixed rule:

- **Classifying** incoming emails or support tickets by topic and urgency
- **Summarising** long threads, calls or documents for a quick handover
- **Extracting** structured data such as names, order numbers and dates from free text
- **Drafting** replies that a person reviews before sending

The key word in that list is *reviews*. AI output is probabilistic. For anything that affects money, customers or legal commitments, we design the workflow so a person approves the result, or so the AI only suggests and never acts on its own.

## Building automations that stay healthy

An automation that silently stops working is worse than no automation, because people stop checking. We build every workflow with:

- **Error handling on every external call,** with retries for temporary failures
- **Alerts** to a named person or channel when a workflow fails
- **Logging** of what was processed, so problems can be traced
- **Clear ownership,** so someone knows the automation exists and what it does
- **Documentation** that explains the purpose of each workflow in plain language

## How to get started

Pick one process that is repetitive, rule-based and annoying. Write down every step and every system involved. Automate that single process end to end, measure the time saved, then move to the next one.

Small, reliable automations build trust. That trust is what makes larger projects possible later.
`,
  },
  {
    slug: 'data-analytics-dashboards-for-commerce',
    title: 'Data Analytics Dashboards Every Commerce Business Needs',
    excerpt:
      'The core metrics and dashboard structure that help online businesses understand revenue, customers, products and marketing.',
    category: 'Data Analytics',
    publishedAt: '2026-05-22',
    keywords: ['data analytics', 'dashboards', 'commerce reporting'],
    content: `
Most commerce businesses do not lack data. They have it in Shopify or WooCommerce, in their ad platforms, in email tools and in spreadsheets. What they lack is a clear, trusted view that answers everyday questions without someone spending an afternoon exporting files.

A good dashboard does not try to show everything. It answers the questions your team asks every week, using numbers everyone agrees on.

## Start with the questions

Before choosing a tool or designing a chart, we write down the questions the dashboard must answer. For most commerce teams they look like this:

- How much did we sell this week, and how does that compare with last week and last year?
- Which products are driving revenue, and which are slowing down?
- Where are new customers coming from, and what does it cost to acquire them?
- Are customers coming back to buy again?
- What is going wrong: refunds, failed payments, stock outs?

Every chart on the dashboard should map to one of these questions. If it does not, it probably does not belong.

## The core dashboards

### Revenue and orders

The daily view of the business: revenue, number of orders, average order value and conversion rate, with comparisons to previous periods. Net revenue after discounts and refunds matters more than gross revenue, so we show both.

### Products

Top sellers by revenue and by units, products with falling sales, margin by product where cost data exists, and stock levels for fast movers. This is where merchandising and purchasing decisions come from.

### Customers

New versus returning customers, repeat purchase rate, time between orders and customer lifetime value by acquisition month. These numbers show whether growth is sustainable or depends entirely on buying new customers.

### Marketing

Revenue and customers by channel, cost per acquisition and return on ad spend. Attribution is never perfect, so we are explicit about which model is used and avoid presenting estimates as facts.

### Operations

Refunds and their reasons, failed payments, fulfilment times and support volume. These are early warning signs that rarely appear in a revenue chart until it is too late.

## Definitions matter more than charts

The most common reason a dashboard is ignored is that people do not trust the numbers. Usually two reports disagree because they define a metric differently. Does revenue include tax? Shipping? Cancelled orders?

We agree on a written definition for every metric before building anything, and keep those definitions visible next to the dashboard. When everyone uses the same definitions, discussions move from "is this number right?" to "what should we do about it?"

## Building the data foundation

Behind every reliable dashboard is a simple pipeline:

1. **Extract** data from each source on a schedule
2. **Clean and model** it into consistent tables, such as orders, customers and products
3. **Calculate** metrics in one place, using the agreed definitions
4. **Visualise** the results in a tool your team already uses

Keeping calculations in the data model rather than inside individual charts means every report uses the same logic, and changes only need to be made once.

## Keep it small

A focused dashboard that the whole team opens every Monday is worth more than a large one nobody trusts. Start with the five sections above, review them with the people who will use them, and add only what earns its place.
`,
  },
]

export const INSIGHT_POSTS: InsightPost[] = SOURCES.map(withReadingTime)

export function getInsightPosts() {
  return [...INSIGHT_POSTS].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
}

export function getInsightPost(slug: string) {
  return INSIGHT_POSTS.find((post) => post.slug === slug)
}
