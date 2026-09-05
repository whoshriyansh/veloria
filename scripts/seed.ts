import "dotenv/config";
import bcrypt from "bcryptjs";
import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "veloria";

if (!uri) {
  throw new Error("Set MONGODB_URI in .env before seeding.");
}

const mongoUri: string = uri;

const questions = [
  {
    question: "Is the company formally incorporated with current statutory records on file?",
    category: "Corporate Structure",
    yesIsGood: true,
    helpText: "Investors and counterparties expect a clean legal architecture before writing a cheque.",
  },
  {
    question: "Is ownership documented with founder agreements and a current cap table?",
    category: "Corporate Structure",
    yesIsGood: true,
    helpText: "Undocumented equity is one of the fastest ways to stall a raise or a sale.",
  },
  {
    question: "Have all founders assigned intellectual property to the company?",
    category: "Corporate Structure",
    yesIsGood: true,
    helpText: "Missing IP assignments can kill a financing round or acquisition.",
  },
  {
    question: "Are board or director consents, minutes and decision records maintained?",
    category: "Governance",
    yesIsGood: true,
    helpText: "Governance hygiene signals institutional discipline to sophisticated counterparties.",
  },
  {
    question: "Is there a clear process for material decisions, related-party deals and authority?",
    category: "Governance",
    yesIsGood: true,
    helpText: "Unclear authority creates negotiation risk when capital or a buyer arrives.",
  },
  {
    question: "Are customer, vendor and project contracts in writing and current?",
    category: "Contracts",
    yesIsGood: true,
    helpText: "Handshake deals become diligence exceptions — and price chips.",
  },
  {
    question: "Do employment and contractor agreements include confidentiality and IP assignment?",
    category: "Contracts",
    yesIsGood: true,
    helpText: "Every contributor who touches the product should have paper behind them.",
  },
  {
    question: "Have unusual liability, exclusivity or payment terms been reviewed?",
    category: "Contracts",
    yesIsGood: true,
    helpText: "Early commercial paper can quietly lock you into bad economics.",
  },
  {
    question: "Are privacy, terms and any sector registrations current for how you operate?",
    category: "Compliance",
    yesIsGood: true,
    helpText: "Regulatory gaps surface immediately in diligence and lender reviews.",
  },
  {
    question: "Are licences, filings and statutory compliances up to date?",
    category: "Compliance",
    yesIsGood: true,
    helpText: "Missed filings are inexpensive to fix early and expensive once a term sheet exists.",
  },
  {
    question: "Is a data room organised with formation, equity, contracts and financials?",
    category: "Transaction Readiness",
    yesIsGood: true,
    helpText: "A clean data room shortens diligence from weeks to days.",
  },
  {
    question: "Have prior SAFEs, notes or investment instruments been inventoried?",
    category: "Transaction Readiness",
    yesIsGood: true,
    helpText: "Undocumented instruments create conversion chaos at priced rounds.",
  },
  {
    question: "Would you feel confident opening your files to a lead investor or buyer tomorrow?",
    category: "Transaction Readiness",
    yesIsGood: true,
    helpText: "If the answer is no, that is exactly why the Veloria Score exists.",
  },
  {
    question: "Have you identified material litigation, disputes or regulatory exposure?",
    category: "Business Risk",
    yesIsGood: false,
    helpText: "Answering Yes means exposure exists — we help quantify and contain it.",
  },
  {
    question: "Are there known payment, counterparty or project risks that could weaken value?",
    category: "Business Risk",
    yesIsGood: false,
    helpText: "Hidden commercial risk is what sophisticated buyers price in last.",
  },
];

async function main() {
  const client = new MongoClient(mongoUri);
  await client.connect();
  const db = client.db(dbName);

  const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || "admin123", 10);
  const adminEmail = process.env.ADMIN_EMAIL || "admin@veloria.legal";

  await db.collection("users").updateOne(
    { email: adminEmail },
    {
      $setOnInsert: {
        email: adminEmail,
        name: "Veloria Admin",
        passwordHash,
        role: "ADMIN",
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
        aboutPreview: "A stronger business is easier to fund, easier to scale and harder to disrupt.",
        footerText:
          "© 2026 Veloria. All rights reserved. Information on this website is general in nature and does not constitute legal advice.",
        logoText: "VELORIA",
        metaTitle: "Veloria — Build Before You Raise",
        metaDescription:
          "Veloria helps startups, companies, builders, contractors and business owners strengthen structure, governance and transaction readiness.",
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
    },
    { upsert: true },
  );

  await db.collection("navigationItems").deleteMany({});
  await db.collection("navigationItems").insertMany([
    { label: "Who We Work With", href: "/about", order: 1, isVisible: true, isExternal: false },
    { label: "What We Do", href: "/services", order: 2, isVisible: true, isExternal: false },
    { label: "Veloria Score", href: "/legal-health-checkup", order: 3, isVisible: true, isExternal: false },
    { label: "Clients", href: "/#clients", order: 4, isVisible: true, isExternal: false },
    { label: "Founders Circle", href: "/founder-circle", order: 5, isVisible: true, isExternal: false },
    { label: "Contact", href: "/contact", order: 6, isVisible: true, isExternal: false },
  ]);

  const homeSections = JSON.stringify([
    {
      type: "trust",
      items: ["Capital Readiness", "Governance", "Contracts", "Transactions", "Commercial Risk"],
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
        { title: "Corporate Structure", body: "Ownership, records and legal architecture", value: "82" },
        { title: "Governance", body: "Decision-making and institutional discipline", value: "76" },
        { title: "Contracts", body: "Commercial documentation and risk allocation", value: "80" },
        { title: "Compliance", body: "Operational and regulatory readiness", value: "74" },
        { title: "Transaction Readiness", body: "Diligence and documentation preparedness", value: "78" },
        { title: "Business Risk", body: "Exposure that could weaken value or negotiations", value: "78" },
      ],
    },
    {
      type: "approach",
      title: "A clear path from uncertainty to readiness.",
      body: "Veloria keeps the process commercial, prioritised and practical.",
      items: [
        { mini: "Assess", title: "Understand", body: "Review structure, documentation, risk and the business objective ahead." },
        { mini: "Prioritise", title: "Focus", body: "Separate urgent issues from improvements that can follow later." },
        { mini: "Implement", title: "Strengthen", body: "Put the agreements, systems, records and governance foundations in place." },
        { mini: "Ready", title: "Move", body: "Approach capital, partnerships, projects and transactions with greater confidence." },
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
            { title: "Startups", body: "For founders preparing to raise capital, formalise ownership, strengthen contracts and move from an early-stage business into a more institutional company." },
            { title: "Companies", body: "For established and growing companies that need stronger governance, commercial documentation, transaction readiness and corporate discipline." },
            { title: "Builders & Developers", body: "For real-estate and project businesses navigating contracts, counterparties, commercial arrangements, risk allocation and large transactions." },
            { title: "Contractors", body: "For project-driven businesses managing work orders, payments, liabilities, subcontracting arrangements and recurring commercial exposure." },
            { title: "Entrepreneurs & Business Owners", body: "For promoters preparing for partnerships, expansion, succession, investment or a more professional operating structure." },
          ],
        },
      ]),
    },
    {
      slug: "founder-circle",
      title: "This is not a networking group.",
      subtitle:
        "A closed table for founders, promoters and investors who treat readiness as leverage. Convened with intention. Extended by invitation.",
      content: `Submitting signals interest only. It does not constitute membership. Those selected are contacted directly. We read every note.

Members sit at closed dinners, readiness clinics, peer deal reviews and market briefings. What is said in the room stays in the room.

“Build the company before you build the pitch.”`,
      heroImage: "",
      isPublished: true,
      sections: JSON.stringify([]),
    },
    {
      slug: "contact",
      title: "Build before the opportunity arrives.",
      subtitle: "Speak with Veloria. Tell us where you are. We will tell you what diligence will ask next.",
      content:
        "Whether you are raising capital, entering a major transaction, expanding a business, taking on a project or simply professionalising the company, Veloria helps prepare the foundation first. Our team replies within one business day.",
      heroImage: "",
      isPublished: true,
      sections: JSON.stringify([]),
    },
  ];

  for (const page of pages) {
    await db.collection("pages").updateOne(
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
      summary: "Ownership, board processes, records, founder arrangements and governance architecture.",
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
      summary: "Commercial agreements, project contracts, employment arrangements and recurring documentation.",
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
      summary: "Diligence preparation, term-sheet support and investment documentation.",
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
      summary: "Identifying gaps before investors, lenders, buyers or institutional counterparties do.",
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
      summary: "Legal-commercial support for projects, partnerships, growth and new markets.",
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
      summary: "Clear legal-commercial thinking around consequential business decisions.",
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
        "Founders Circle membership",
      ].map((text, order) => ({ _id: new ObjectId(), text, order })),
    },
  ]);

  await db.collection("clients").deleteMany({});
  await db.collection("clients").insertMany([
    { name: "Northline", logoUrl: "", website: "", order: 1, isVisible: true },
    { name: "Harbour & Co.", logoUrl: "", website: "", order: 2, isVisible: true },
    { name: "Kiteworks", logoUrl: "", website: "", order: 3, isVisible: true },
    { name: "Aether Labs", logoUrl: "", website: "", order: 4, isVisible: true },
    { name: "Pinnacle Infra", logoUrl: "", website: "", order: 5, isVisible: true },
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
  console.log(`Admin: ${adminEmail} / ${process.env.ADMIN_PASSWORD || "admin123"}`);
  await client.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
