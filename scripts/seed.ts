import { config } from "dotenv";
import bcrypt from "bcryptjs";
import { MongoClient, ObjectId } from "mongodb";
import { FALLBACK_FOUNDING_MEMBERS } from "../src/lib/founding-team-data";

config({ path: ".env.local" });
config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Set MONGODB_URI in .env before seeding.");
}

const mongoUri: string = uri;

const questions = [
  {
    question:
      "Is the current ownership/shareholding structure clearly documented and up to date?",
    category: "Corporate Structure",
    yesIsGood: true,
    helpText:
      "Unclear ownership is one of the first things a serious investor or buyer will stop on.",
  },
  {
    question:
      "If there are multiple founders, is there a written agreement defining their respective roles and responsibilities?",
    category: "Corporate Structure",
    yesIsGood: true,
    helpText:
      "Verbal founder arrangements become disputes the moment capital or a departure is on the table.",
  },
  {
    question:
      "Does the company maintain its statutory registers, resolutions and corporate records in an organised manner?",
    category: "Corporate Structure",
    yesIsGood: true,
    helpText:
      "If the records are not organised, the structure is not ready for diligence.",
  },
  {
    question:
      "Is it clearly documented who can make financial, operational and strategic decisions for the company?",
    category: "Governance",
    yesIsGood: true,
    helpText:
      "Investors need to see that the business is run through authority, not informal founder habit.",
  },
  {
    question:
      "Are important decisions of the company formally recorded rather than relying only on WhatsApp, calls or verbal discussions?",
    category: "Governance",
    yesIsGood: true,
    helpText:
      "If it is not written down, it will not survive a data-room review.",
  },
  {
    question:
      "If the primary founder became unavailable for 60 days, could the business continue operating through an established decision-making structure?",
    category: "Governance",
    yesIsGood: true,
    helpText:
      "Key-person dependence is a governance failure, not a personality trait.",
  },
  {
    question:
      "Does the company have a written agreement with every major client?",
    category: "Contracts",
    yesIsGood: true,
    helpText: "Handshake revenue is not an asset in diligence.",
  },
  {
    question:
      "Do your contracts clearly establish who owns intellectual property created during the engagement?",
    category: "Contracts",
    yesIsGood: true,
    helpText:
      "Unclear IP ownership can block a raise or a sale even when the product is strong.",
  },
  {
    question:
      "Do you have written agreements with freelancers, consultants and external agencies working on your projects?",
    category: "Contracts",
    yesIsGood: true,
    helpText:
      "Anyone who touches the work should have paper transferring rights to the company.",
  },
  {
    question:
      "Are all registrations and licences required for your current business activities currently valid?",
    category: "Compliance",
    yesIsGood: true,
    helpText:
      "Lapsed licences surface immediately when a counterparty asks for compliance records.",
  },
  {
    question:
      "Are your statutory filings being completed within the applicable timelines?",
    category: "Compliance",
    yesIsGood: true,
    helpText:
      "Late filings are inexpensive to fix early and expensive once a term sheet exists.",
  },
  {
    question:
      "If you received an investment offer tomorrow, could you provide an investor with your complete corporate documents without significant preparation?",
    category: "Transaction Readiness",
    yesIsGood: true,
    helpText: "If the files are not ready, the company is not ready.",
  },
  {
    question:
      "Can you demonstrate ownership of the intellectual property that is critical to your business?",
    category: "Transaction Readiness",
    yesIsGood: true,
    helpText: "The company must own the IP that makes the business valuable.",
  },
  {
    question:
      "Does any single client currently contribute a disproportionately large percentage of your revenue?",
    category: "Business Risk",
    yesIsGood: false,
    helpText:
      "Answering Yes means concentration risk — counterparties will price that in.",
  },
  {
    question:
      "If a serious investor offered to begin due diligence next week, would you be confident that your business is legally and commercially ready for the process?",
    category: "Investment Readiness",
    yesIsGood: true,
    helpText:
      "This is the Veloria Score in one question — build before you raise.",
  },
];

async function main() {
  const client = new MongoClient(mongoUri);
  await client.connect();
  const db = client.db();

  const passwordHash = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || "admin123",
    10,
  );
  const adminEmail = process.env.ADMIN_EMAIL || "admin@veloria.legal";

  await db.collection("users").updateOne(
    { email: adminEmail },
    {
      $set: {
        email: adminEmail,
        name: "Veloria Admin",
        passwordHash,
        role: "ADMIN",
        updatedAt: new Date(),
      },
      $setOnInsert: {
        createdAt: new Date(),
      },
    },
    { upsert: true },
  );

  await db.collection("siteSettings").updateOne(
    { key: "default" },
    {
      $set: {
        key: "default",
        siteName: "Veloria",
        tagline: "Structure. Strength. Readiness.",
        heroHeadline: "Build before you raise.",
        heroSubheadline:
          "Veloria helps startups, companies, builders, contractors, founders and business owners strengthen the foundations behind serious growth, capital, transactions and expansion.",
        heroCtaLabel: "Start a Readiness Review",
        heroCtaHref: "/legal-health-checkup",
        aboutPreview:
          "A stronger business is easier to fund, easier to scale and harder to disrupt.",
        footerText:
          "© 2026 Veloria. All rights reserved. Information on this website is general in nature and does not constitute legal advice.",
        logoText: "VELORIA",
        metaTitle:
          "Veloria — Business Readiness, Governance & Transaction Advisory",
        metaDescription:
          "Veloria is a business readiness advisory for startups, companies, founders and owners in India. Strengthen structure, governance and transactions — then take the Veloria Score.",
        showCheckupPopup: true,
        popupDelayMs: 1800,
        popupTitle: "How ready is your business?",
        popupBody:
          "Take the free Veloria Score — a 15-question Legal Health Checkup. A representative will review your answers and call you with a clear path forward.",
        popupCta: "Begin the Score",
        updatedAt: new Date(),
      },
    },
    { upsert: true },
  );

  await db.collection("contactInfo").updateOne(
    { key: "default" },
    {
      $set: {
        key: "default",
        email: "hello@veloria.in",
        phone: "+91 98765 43210",
        address: "India",
        linkedin: "",
        twitter: "",
        calendly: "",
        hours: "Mon–Fri, 10am–7pm IST",
        updatedAt: new Date(),
      },
      $setOnInsert: {
        notifyEmails: [],
      },
    },
    { upsert: true },
  );

  await db.collection("navigationItems").deleteMany({});
  await db.collection("navigationItems").insertMany([
    {
      label: "Who We Work With",
      href: "/about",
      order: 1,
      isVisible: true,
      isExternal: false,
    },
    {
      label: "What We Do",
      href: "/services",
      order: 2,
      isVisible: true,
      isExternal: false,
    },
    {
      label: "Founders Circle",
      href: "/founder-circle",
      order: 3,
      isVisible: true,
      isExternal: false,
    },
    {
      label: "Speak with Veloria",
      href: "/contact",
      order: 4,
      isVisible: true,
      isExternal: false,
    },
  ]);

  const homeSections = JSON.stringify([
    {
      type: "trust",
      items: [
        "Capital Readiness",
        "Governance",
        "Contracts",
        "Transactions",
        "Commercial Risk",
      ],
    },
    {
      type: "audiences",
      label: "Who we work with",
      title: "Built for businesses beyond one stage or one industry.",
      body: "Veloria works at the points where structure, documentation, governance and commercial readiness directly influence business value.",
      items: [
        {
          title: "Startups",
          body: "For founders preparing to raise capital, formalise ownership, strengthen contracts and move from an early-stage business into a more institutional company.",
        },
        {
          title: "Companies",
          body: "For established and growing companies that need stronger governance, commercial documentation, transaction readiness and corporate discipline.",
        },
        {
          title: "Builders & Developers",
          body: "For real-estate and project businesses navigating contracts, counterparties, commercial arrangements, risk allocation and large transactions.",
        },
        {
          title: "Contractors",
          body: "For project-driven businesses managing work orders, payments, liabilities, subcontracting arrangements and recurring commercial exposure.",
        },
        {
          title: "Entrepreneurs & Business Owners",
          body: "For promoters preparing for partnerships, expansion, succession, investment or a more professional operating structure.",
        },
      ],
    },
    {
      type: "score",
      label: "A proprietary readiness framework",
      title: "See your business the way a serious counterparty will.",
      body: "The Veloria Score is designed to give business owners a structured view of readiness across the areas that matter during fundraising, high-value transactions, partnerships, expansion and diligence.",
      value: "78",
      caption: "Illustrative Business Readiness Index",
      items: [
        {
          title: "Corporate Structure",
          body: "Ownership, records and legal architecture",
          value: "82",
        },
        {
          title: "Governance",
          body: "Decision-making and institutional discipline",
          value: "76",
        },
        {
          title: "Contracts",
          body: "Commercial documentation and risk allocation",
          value: "80",
        },
        {
          title: "Compliance",
          body: "Operational and regulatory readiness",
          value: "74",
        },
        {
          title: "Transaction Readiness",
          body: "Diligence and documentation preparedness",
          value: "78",
        },
        {
          title: "Business Risk",
          body: "Exposure that could weaken value or negotiations",
          value: "78",
        },
      ],
    },
    {
      type: "approach",
      title: "A clear path from uncertainty to readiness.",
      body: "Veloria keeps the process commercial, prioritised and practical.",
      items: [
        {
          mini: "Assess",
          title: "Understand",
          body: "Review structure, documentation, risk and the business objective ahead.",
        },
        {
          mini: "Prioritise",
          title: "Focus",
          body: "Separate urgent issues from improvements that can follow later.",
        },
        {
          mini: "Implement",
          title: "Strengthen",
          body: "Put the agreements, systems, records and governance foundations in place.",
        },
        {
          mini: "Ready",
          title: "Move",
          body: "Approach capital, partnerships, projects and transactions with greater confidence.",
        },
      ],
    },
    {
      type: "circle",
      quote: "Build the company before you build the pitch.",
    },
  ]);

  const pages = [
    {
      slug: "home",
      title: "Build before you raise.",
      subtitle: "Structure. Strength. Readiness.",
      content:
        "Veloria helps startups, companies, builders, contractors, founders and business owners strengthen the foundations behind serious growth, capital, transactions and expansion.",
      heroImage: "",
      isPublished: true,
      sections: homeSections,
    },
    {
      slug: "about",
      title: "Built for businesses beyond one stage or one industry.",
      subtitle: "We strengthen the business behind the opportunity.",
      content: `Veloria works at the points where structure, documentation, governance and commercial readiness directly influence business value.

We are not a document marketplace. We are not a one-off filing service. We review businesses through the lens of an investor, institutional counterparty or sophisticated buyer — then help you strengthen what matters before the opportunity arrives.

The objective is not documentation for its own sake. It is to make the business more credible, defensible and ready for serious counterparties.

Whether you are raising capital, entering a major transaction, expanding, taking on a project or professionalising the company, Veloria helps prepare the foundation first.`,
      heroImage: "",
      isPublished: true,
      sections: JSON.stringify([
        {
          type: "audiences",
          items: [
            {
              title: "Startups",
              body: "For founders preparing to raise capital, formalise ownership, strengthen contracts and move from an early-stage business into a more institutional company.",
            },
            {
              title: "Companies",
              body: "For established and growing companies that need stronger governance, commercial documentation, transaction readiness and corporate discipline.",
            },
            {
              title: "Builders & Developers",
              body: "For real-estate and project businesses navigating contracts, counterparties, commercial arrangements, risk allocation and large transactions.",
            },
            {
              title: "Contractors",
              body: "For project-driven businesses managing work orders, payments, liabilities, subcontracting arrangements and recurring commercial exposure.",
            },
            {
              title: "Entrepreneurs & Business Owners",
              body: "For promoters preparing for partnerships, expansion, succession, investment or a more professional operating structure.",
            },
          ],
        },
      ]),
    },
    {
      slug: "founder-circle",
      title: "A table. A night. The room decides the rest.",
      subtitle:
        "Veloria hosts a private dinner. Invitations are sent. There is nothing to join.",
      content: `A private dinner, thrown by Veloria. Royal in manner. Quiet in purpose. Invitations are extended — never an open list, never an application.`,
      heroImage: "",
      isPublished: true,
      sections: JSON.stringify([]),
    },
    {
      slug: "contact",
      title: "Build before the opportunity arrives.",
      subtitle:
        "Speak with Veloria. Tell us where you are. We will tell you what diligence will ask next.",
      content:
        "Whether you are raising capital, entering a major transaction, expanding a business, taking on a project or simply professionalising the company, Veloria helps prepare the foundation first. Our team replies within one business day.",
      heroImage: "",
      isPublished: true,
      sections: JSON.stringify([]),
    },
  ];

  for (const page of pages) {
    await db
      .collection("pages")
      .updateOne(
        { slug: page.slug },
        { $set: { ...page, updatedAt: new Date() } },
        { upsert: true },
      );
  }

  await db.collection("services").deleteMany({});
  await db.collection("services").insertMany([
    {
      title: "Corporate Structure & Governance",
      slug: "corporate-structure-governance",
      summary:
        "Ownership, board processes, records, founder arrangements and governance architecture.",
      description:
        "We review the legal spine of the company — incorporation, ownership, founder arrangements, board process and records — so the entity can survive diligence, not just a pitch meeting.",
      imageUrl: "",
      icon: "landmark",
      order: 1,
      isVisible: true,
      features: JSON.stringify([
        "Ownership and founder arrangements",
        "Board process and minutes",
        "Statutory records",
        "Governance architecture",
      ]),
    },
    {
      title: "Contracts & Commercial Risk",
      slug: "contracts-commercial-risk",
      summary:
        "Commercial agreements, project contracts, employment arrangements and recurring documentation.",
      description:
        "We strengthen the paper that actually runs the business — customers, vendors, projects, employment and recurring commercial exposure — with risk allocation a sophisticated counterparty will respect.",
      imageUrl: "",
      icon: "file-stack",
      order: 2,
      isVisible: true,
      features: JSON.stringify([
        "Customer and vendor agreements",
        "Project and works contracts",
        "Employment and contractor packs",
        "Risk allocation review",
      ]),
    },
    {
      title: "Fundraising & Investment Readiness",
      slug: "fundraising-investment-readiness",
      summary:
        "Diligence preparation, term-sheet support and investment documentation.",
      description:
        "We prepare the company the way a lead investor will read it — cap table, prior instruments, data room and the narrative of ownership — so the raise is a process, not a cleanup project.",
      imageUrl: "",
      icon: "trending-up",
      order: 3,
      isVisible: true,
      features: JSON.stringify([
        "SAFE and note inventory",
        "Cap table reconciliation",
        "Term-sheet support",
        "Investment documentation",
      ]),
    },
    {
      title: "Due Diligence Preparation",
      slug: "due-diligence-preparation",
      summary:
        "Identifying gaps before investors, lenders, buyers or institutional counterparties do.",
      description:
        "We run the review an investor, lender or buyer would run — then close gaps while you still control the timeline.",
      imageUrl: "",
      icon: "search",
      order: 4,
      isVisible: true,
      features: JSON.stringify([
        "Gap analysis across six Score pillars",
        "Data room build",
        "Exception list and remediation plan",
        "Counterparty-ready packaging",
      ]),
    },
    {
      title: "Projects & Expansion",
      slug: "projects-expansion",
      summary:
        "Legal-commercial support for projects, partnerships, growth and new markets.",
      description:
        "For builders, contractors and expanding companies — we support the contracts, counterparties and risk allocation that sit underneath growth.",
      imageUrl: "",
      icon: "building-2",
      order: 5,
      isVisible: true,
      features: JSON.stringify([
        "Project and JV documentation",
        "Partnership structures",
        "New-market readiness",
        "Counterparty risk mapping",
      ]),
    },
    {
      title: "Strategic Advisory",
      slug: "strategic-advisory",
      summary:
        "Clear legal-commercial thinking around consequential business decisions.",
      description:
        "Standing counsel for decisions that move value — partnerships, succession, expansion, and the moments when templates are not enough.",
      imageUrl: "",
      icon: "compass",
      order: 6,
      isVisible: true,
      features: JSON.stringify([
        "Named counsel access",
        "Consequential decision support",
        "Monthly readiness reviews",
        "Founders Circle eligibility",
      ]),
    },
  ]);

  await db.collection("packages").deleteMany({});
  await db.collection("packages").insertMany([
    {
      name: "Foundation",
      slug: "foundation",
      tagline: "Get the legal spine in place.",
      description:
        "For early teams establishing entity hygiene, founder equity, IP assignment and baseline commercial paper.",
      cadence: "Monthly",
      highlight: false,
      order: 1,
      isVisible: true,
      ctaLabel: "Request access",
      features: [
        "Structure and founder equity review",
        "IP assignment completion",
        "Core template suite",
        "Quarterly Veloria Score",
        "Async counsel channel",
      ].map((text, order) => ({ _id: new ObjectId(), text, order })),
    },
    {
      name: "Growth Counsel",
      slug: "growth-counsel",
      tagline: "Stay raise-ready while you hire and sell.",
      description:
        "For teams hiring, closing customers and preparing a seed or extension. Continuous readiness with faster turnaround.",
      cadence: "Monthly",
      highlight: true,
      order: 2,
      isVisible: true,
      ctaLabel: "Request access",
      features: [
        "Everything in Foundation",
        "Cap table and SAFE monitoring",
        "Employment and contractor paperwork",
        "Commercial contract review hours",
        "Monthly readiness briefing",
        "Priority response",
      ].map((text, order) => ({ _id: new ObjectId(), text, order })),
    },
    {
      name: "Series Ready",
      slug: "series-ready",
      tagline: "Institutional diligence, without the scramble.",
      description:
        "For founders approaching priced rounds or high-value transactions. Full diligence orchestration and standing counsel.",
      cadence: "Monthly",
      highlight: false,
      order: 3,
      isVisible: true,
      ctaLabel: "Request access",
      features: [
        "Everything in Growth Counsel",
        "Full diligence data room ownership",
        "Term sheet and side letter support",
        "Board governance packaging",
        "Named counsel",
        "Invitation to a Veloria dinner",
      ].map((text, order) => ({ _id: new ObjectId(), text, order })),
    },
  ]);

  await db.collection("clients").deleteMany({});
  await db.collection("clients").insertMany([
    { name: "Northline", logoUrl: "", website: "", order: 1, isVisible: true },
    {
      name: "Harbour & Co.",
      logoUrl: "",
      website: "",
      order: 2,
      isVisible: true,
    },
    { name: "Kiteworks", logoUrl: "", website: "", order: 3, isVisible: true },
    {
      name: "Aether Labs",
      logoUrl: "",
      website: "",
      order: 4,
      isVisible: true,
    },
    {
      name: "Pinnacle Infra",
      logoUrl: "",
      website: "",
      order: 5,
      isVisible: true,
    },
  ]);

  const foundingMembers = FALLBACK_FOUNDING_MEMBERS;
  const keepSlugs = foundingMembers.map((member) => member.slug);
  for (const member of foundingMembers) {
    const { id: _id, ...fields } = member;
    await db.collection("foundingMembers").updateOne(
      { slug: member.slug },
      {
        $set: {
          id: member.id,
          ...fields,
          isVisible: true,
          updatedAt: new Date(),
        },
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true },
    );
  }
  await db.collection("foundingMembers").updateMany(
    { slug: { $nin: keepSlugs } },
    { $set: { isVisible: false, updatedAt: new Date() } },
  );

  await db.collection("articles").deleteMany({});
  await db.collection("articles").insertMany([
    {
      title: "Build the company before you build the pitch.",
      heading: "Readiness",
      imageUrl:
        "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80",
      link: "https://www.linkedin.com/",
      order: 1,
      isPublished: true,
      publishedAt: new Date(),
    },
    {
      title: "What a serious counterparty reads first in a data room.",
      heading: "Diligence",
      imageUrl:
        "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
      link: "https://www.linkedin.com/",
      order: 2,
      isPublished: true,
      publishedAt: new Date(),
    },
    {
      title: "Governance is not paperwork. It is how the company decides.",
      heading: "Governance",
      imageUrl:
        "https://images.unsplash.com/photo-1507679799987-4eee5c111973?auto=format&fit=crop&w=1200&q=80",
      link: "https://www.linkedin.com/",
      order: 3,
      isPublished: true,
      publishedAt: new Date(),
    },
  ]);

  await db.collection("healthQuestions").deleteMany({});
  await db.collection("healthQuestions").insertMany(
    questions.map((q, index) => ({
      ...q,
      order: index + 1,
      weight: 1,
      isActive: true,
    })),
  );

  console.log("Veloria MongoDB seed complete.");
  console.log(
    `Admin: ${adminEmail} / ${process.env.ADMIN_PASSWORD || "admin123"}`,
  );
  await client.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
