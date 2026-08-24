import { PrismaClient, ReviewSource } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const reviewCount = await prisma.review.count()
  if (reviewCount === 0) {
    await prisma.review.createMany({
      data: [
        {
          clientName: 'James M.',
          clientCountry: 'United States',
          rating: 5,
          comment:
            'Outstanding WooCommerce plugin work — fast delivery, clean code, and great communication throughout the Fiverr order.',
          projectTitle: 'Cart block plugin for WooCommerce',
          source: ReviewSource.FIVERR,
          sortOrder: 0,
        },
        {
          clientName: 'Sarah K.',
          clientCountry: 'United Kingdom',
          rating: 5,
          comment:
            'Exactly what I needed for my store. Professional developer, went above and beyond on revisions.',
          projectTitle: 'Shopify integration & custom checkout flow',
          source: ReviewSource.FIVERR,
          sortOrder: 1,
        },
        {
          clientName: 'Ahmed R.',
          clientCountry: 'UAE',
          rating: 5,
          comment:
            'Built a complex automation workflow with n8n. Very knowledgeable team — highly recommend on Fiverr.',
          projectTitle: 'n8n automation for order sync',
          source: ReviewSource.FIVERR,
          sortOrder: 2,
        },
        {
          clientName: 'Elena V.',
          clientCountry: 'Germany',
          rating: 5,
          comment:
            'Chrome extension delivered on time, well documented. Will hire again for the next phase.',
          projectTitle: 'Chrome extension for product scraper',
          source: ReviewSource.FIVERR,
          sortOrder: 3,
        },
      ],
    })
    console.log('Seeded Fiverr reviews')
  }

  const teamCount = await prisma.teamMember.count()
  if (teamCount === 0) {
    await prisma.teamMember.create({
      data: {
        name: 'Dhanesh Kumar',
        role: 'Founder & Lead Developer',
        bio: 'Full-stack engineer specializing in WooCommerce, Next.js, and automation. Delivered 50+ client projects on Fiverr and enterprise engagements worldwide.',
        sortOrder: 0,
        isPublished: true,
      },
    })
    console.log('Seeded team member')
  }

  // ── FAQs ────────────────────────────────────────────────────
  // The homepage FAQ accordion hides itself when this table is
  // empty, which is why the section never appeared. These three
  // mirror the hardcoded FAQS in the product detail page, so the
  // answers stay consistent across the site. Edit or replace them
  // from /admin/faqs — this only runs when the table is empty.
  const faqCount = await prisma.faq.count()
  if (faqCount === 0) {
    await prisma.faq.createMany({
      data: [
        {
          question: 'Can I request customization?',
          answer:
            'Yes. Contact the Druporia team with your exact workflow, platform, and timeline, and we will scope it as a fixed-price piece of work.',
          category: 'Services',
          sortOrder: 0,
          isPublished: true,
        },
        {
          question: 'How do downloads work?',
          answer:
            'Free products can be downloaded directly once you are signed in. Paid checkout and protected delivery are planned for the next release.',
          category: 'Marketplace',
          sortOrder: 1,
          isPublished: true,
        },
        {
          question: 'Is support included?',
          answer:
            'Basic product support is included. Custom development or setup work can be quoted separately.',
          category: 'Support',
          sortOrder: 2,
          isPublished: true,
        },
      ],
    })
    console.log('Seeded FAQs')
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e)
    prisma.$disconnect()
    process.exit(1)
  })
