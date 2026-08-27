import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectMongo } from "../src/lib/mongodb";
import { collections, ObjectId } from "../src/lib/models";

const questions = [
  {
    question: "Is your company formally incorporated (C-Corp, LLC, or equivalent)?",
    category: "Formation",
    yesIsGood: true,
    helpText: "Investors expect a clean entity structure before writing a check.",
  },
  {
    question: "Have all founders signed equity / stock purchase agreements with vesting?",
    category: "Equity",
    yesIsGood: true,
    helpText: "Unvested or undocumented founder equity is a red flag in diligence.",
  },
  {
    question: "Have all founders assigned intellectual property to the company?",
    category: "IP",
    yesIsGood: true,
    helpText: "Missing IP assignments can stall or kill a financing round.",
  },
  {
    question: "Have 83(b) elections been filed (if applicable) within the required window?",
    category: "Equity",
    yesIsGood: true,
    helpText: "Missed 83(b) filings create irreversible tax and equity risk.",
  },
  {
    question: "Do you maintain a current, accurate capitalization table?",
    category: "Cap Table",
    yesIsGood: true,
    helpText: "Cap table errors surface immediately during investor diligence.",
  },
  {
    question: "Are all prior SAFE / convertible notes documented and tracked?",
    category: "Fundraising",
    yesIsGood: true,
    helpText: "Undocumented instruments create conversion chaos at priced rounds.",
  },
  {
    question: "Do employee and contractor agreements include IP assignment and confidentiality?",
    category: "Employment",
    yesIsGood: true,
    helpText: "Every contributor who touches code or product should have paper.",
  },
  {
    question: "Do you have a board (or sole director) with proper consents and minutes on file?",
    category: "Governance",
    yesIsGood: true,
    helpText: "Governance hygiene signals operational maturity to counsel and VCs.",
  },
  {
    question: "Is your privacy policy and terms of service current for your product?",
    category: "Compliance",
    yesIsGood: true,
    helpText: "Consumer and B2B products both face rising regulatory scrutiny.",
  },
  {
    question: "Have you completed any required industry or data-protection registrations?",
    category: "Compliance",
    yesIsGood: true,
    helpText: "GDPR, CCPA, and sector rules often apply earlier than founders expect.",
  },
  {
    question: "Is your data room organized with formation, equity, IP, and financial docs?",
    category: "Diligence",
    yesIsGood: true,
    helpText: "A clean data room shortens diligence from weeks to days.",
  },
  {
    question: "Do you have standard templates for NDAs, offer letters, and advisor agreements?",
    category: "Operations",
    yesIsGood: true,
    helpText: "Templates keep velocity high without reinventing legal every hire.",
  },
  {
    question: "Are customer / commercial contracts reviewed for unusual liability or exclusivity?",
    category: "Commercial",
    yesIsGood: true,
    helpText: "Early enterprise deals can quietly lock you into bad economics.",
  },
  {
    question: "Have you identified material litigation, disputes, or regulatory exposure?",
    category: "Risk",
    yesIsGood: false,
    helpText: "Answering Yes means exposure exists — we help quantify and contain it.",
  },
  {
    question: "Would you feel confident opening your legal files to a lead investor tomorrow?",
    category: "Readiness",
    yesIsGood: true,
    helpText: "If the answer is no, that is exactly why Veloria exists.",
  },
];

async function main() {
  if (!process.env.MONGODB_URI) {
    throw new Error("Set MONGODB_URI in .env before seeding.");
  }

  await connectMongo();

  const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || "admin123", 10);
  const adminEmail = process.env.ADMIN_EMAIL || "admin@veloria.legal";

  const users = await collections.users();
  const siteSettings = await collections.siteSettings();
  const contactInfo = await collections.contactInfo();
  const navigationItems = await collections.navigationItems();
  const pages = await collections.pages();
  const services = await collections.services();
  const packages = await collections.packages();
  const healthQuestions = await collections.healthQuestions();

  await users.findOneAndUpdate(
    { email: adminEmail },
    {
      $setOnInsert: {
        email: adminEmail,
        name: "Veloria Admin",
        passwordHash,
        role: "ADMIN",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
    { upsert: true },
  );

  await siteSettings.findOneAndUpdate(
    { key: "default" },
    {
      $setOnInsert: {
        key: "default",
        siteName: "Veloria",
        tagline: "Investment Ready",
        heroHeadline: "Investment Ready",
        heroSubheadline:
          "Startups: Make your platform Investment Ready, compliance ready, and paperwork ready.",
        heroCtaLabel: "Start Legal Health Checkup",
        heroCtaHref: "/legal-health-checkup",
        aboutPreview:
          "We are your Eternal Legal Counsel — the strategic legal partner founders keep for every raise, hire, and exit.",
        footerText: "© Veloria. Eternal legal counsel for ambitious startups.",
        logoText: "Veloria",
        metaTitle: "Veloria — Investment Ready Legal Counsel",
        metaDescription:
          "Veloria helps startups become investment ready, compliance ready, and paperwork ready. Eternal legal counsel for founders.",
        showCheckupPopup: true,
        popupDelayMs: 1800,
        popupTitle: "How investment-ready is your startup?",
        popupBody:
          "Take our free 15-question Legal Health Checkup. A Veloria representative will review your answers and call you with a clear path forward.",
        popupCta: "Begin checkup",
      },
    },
    { upsert: true },
  );

  await contactInfo.findOneAndUpdate(
    { key: "default" },
    {
      $setOnInsert: {
        key: "default",
        email: "hello@veloria.legal",
        phone: "+1 (415) 555-0142",
        address: "San Francisco · New York · Remote",
        linkedin: "https://linkedin.com",
        twitter: "",
        calendly: "",
        hours: "Mon–Fri, 9am–6pm PT",
      },
    },
    { upsert: true },
  );

  await navigationItems.deleteMany({});
  await navigationItems.insertMany([
    { label: "About", href: "/about", order: 1, isVisible: true, isExternal: false },
    { label: "Services", href: "/services", order: 2, isVisible: true, isExternal: false },
    { label: "Packages", href: "/packages", order: 3, isVisible: true, isExternal: false },
    { label: "Founder Circle", href: "/founder-circle", order: 4, isVisible: true, isExternal: false },
    {
      label: "Health Checkup",
      href: "/legal-health-checkup",
      order: 5,
      isVisible: true,
      isExternal: false,
    },
    { label: "Contact", href: "/contact", order: 6, isVisible: true, isExternal: false },
  ]);

  const pageDocs = [
    {
      slug: "home",
      title: "Investment Ready",
      subtitle:
        "Startups: Make your platform Investment Ready, compliance ready, and paperwork ready.",
      content:
        "Veloria is the legal authority founders call when the next raise, hire, or enterprise deal demands a clean legal foundation — without the traditional firm friction.",
      heroImage: "",
      seoTitle: "",
      seoDescription: "",
      isPublished: true,
      sections: JSON.stringify([
        {
          type: "stats",
          label: "VELORIA AT A GLANCE",
          items: [
            {
              value: "15",
              label: "Point Legal Health Checkup covering formation through diligence.",
            },
            {
              value: "48h",
              label: "Average time from checkup to first counsel conversation.",
            },
            {
              value: "100%",
              label: "Of retained clients receive a living diligence roadmap.",
            },
            {
              value: "∞",
              label: "Eternal counsel — we stay with you from seed to scale.",
            },
          ],
        },
        {
          type: "split",
          label: "WHY FOUNDERS CHOOSE VELORIA",
          title: "Legal that moves at startup speed",
          body: "Document platforms incorporate you. Traditional firms bill you. Veloria sits between — senior counsel judgment, productized delivery, and a dashboard that keeps your legal health visible every month.",
        },
      ]),
    },
    {
      slug: "about",
      title: "Eternal Legal Counsel",
      subtitle: "We are going to be your Eternal Legal Counsels.",
      content: `Veloria exists for one reason: founders should never scramble for counsel the night before a term sheet.

We are not a one-off formation vendor. We are not a document marketplace. We are your standing legal authority — the team that keeps your entity, equity, IP, compliance, and paperwork continuously investment-ready.

**What eternal counsel means**
- A named counsel relationship that scales with your company
- Continuous legal health monitoring, not reactive fire drills
- Fundraising, hiring, and commercial paperwork that survives diligence
- Strategic judgment when templates are not enough

**Who we serve**
Pre-seed through Series B founding teams who want institutional-grade legal readiness without institutional inertia.`,
      heroImage: "",
      seoTitle: "",
      seoDescription: "",
      isPublished: true,
      sections: JSON.stringify([
        {
          type: "principles",
          items: [
            {
              title: "Authority",
              body: "Counsel that investors and co-counsel recognize as serious.",
            },
            {
              title: "Continuity",
              body: "The same strategic partner from incorporation through exit.",
            },
            {
              title: "Clarity",
              body: "Plain-language roadmaps. No mystery invoices. No fog.",
            },
          ],
        },
      ]),
    },
    {
      slug: "founder-circle",
      title: "Founder Circle",
      subtitle: "A private counsel circle for operators building the next decade.",
      content: `Founder Circle is Veloria’s invitation-only community for founders who treat legal readiness as a competitive advantage.

Members receive priority counsel access, closed-door diligence clinics, peer deal reviews, and early briefings on market terms — SAFEs, option pools, side letters, and governance patterns that actually close.

**Inside the Circle**
- Monthly readiness clinics with Veloria counsel
- Cap table and term sheet office hours
- Warm introductions across the Veloria operator network
- Priority placement on retainer packages when you scale

Membership is curated. Apply through contact — we respond personally.`,
      heroImage: "",
      seoTitle: "",
      seoDescription: "",
      isPublished: true,
      sections: JSON.stringify([]),
    },
    {
      slug: "contact",
      title: "Let’s talk readiness",
      subtitle: "Tell us where you are. We’ll tell you what diligence will ask next.",
      content:
        "Whether you need a full retainer or a single Legal Health Checkup review, our team replies within one business day.",
      heroImage: "",
      seoTitle: "",
      seoDescription: "",
      isPublished: true,
      sections: JSON.stringify([]),
    },
  ];

  for (const page of pageDocs) {
    const now = new Date();
    await pages.findOneAndUpdate(
      { slug: page.slug },
      { $set: { ...page, updatedAt: now }, $setOnInsert: { createdAt: now } },
      { upsert: true },
    );
  }

  await services.deleteMany({});
  await services.insertMany([
    {
      title: "Investment Readiness",
      slug: "investment-readiness",
      summary: "Diligence-grade cleanup before your next raise.",
      description:
        "We audit formation, equity, IP, governance, and prior financings — then close gaps so lead investors open a clean data room, not a cleanup project.",
      imageUrl: "",
      icon: "landmark",
      order: 1,
      isVisible: true,
      features: JSON.stringify([
        "Formation & governance audit",
        "Cap table reconciliation",
        "SAFE / note inventory",
        "Diligence data room build",
      ]),
    },
    {
      title: "Compliance Architecture",
      slug: "compliance-architecture",
      summary: "Privacy, commercial, and regulatory scaffolding that scales.",
      description:
        "From privacy policies to sector-specific obligations, we design compliance that matches your product stage — not a binder of unread policies.",
      imageUrl: "",
      icon: "shield",
      order: 2,
      isVisible: true,
      features: JSON.stringify([
        "Privacy & terms refresh",
        "Vendor & DPA review",
        "Regulatory exposure map",
        "Policy operating cadence",
      ]),
    },
    {
      title: "Paperwork Engine",
      slug: "paperwork-engine",
      summary: "Hiring, advisors, and commercial paper at founder velocity.",
      description:
        "Offer letters, advisor grants, NDAs, and customer agreements — templated, reviewed, and ready so legal never becomes the bottleneck on growth.",
      imageUrl: "",
      icon: "file-stack",
      order: 3,
      isVisible: true,
      features: JSON.stringify([
        "Employment & contractor packs",
        "Advisor & equity grants",
        "NDA & commercial templates",
        "Board consent workflows",
      ]),
    },
    {
      title: "Eternal Counsel Retainer",
      slug: "eternal-counsel",
      summary: "Standing legal partnership for every chapter of the company.",
      description:
        "A named counsel relationship with monthly readiness reviews, on-demand guidance, and priority turnaround when a term sheet hits the inbox.",
      imageUrl: "",
      icon: "infinity",
      order: 4,
      isVisible: true,
      features: JSON.stringify([
        "Named counsel access",
        "Monthly health reviews",
        "Priority deal support",
        "Founder Circle eligibility",
      ]),
    },
  ]);

  await packages.deleteMany({});
  await packages.insertMany([
    {
      name: "Foundation",
      slug: "foundation",
      tagline: "Get legally formed and founder-clean.",
      description:
        "Ideal for pre-seed teams establishing the legal spine: entity hygiene, founder equity, IP assignment, and baseline compliance.",
      cadence: "Monthly",
      highlight: false,
      order: 1,
      isVisible: true,
      ctaLabel: "Request access",
      features: [
        "Formation & founder equity review",
        "IP assignment completion",
        "Core template suite (NDA, offer, advisor)",
        "Quarterly Legal Health Checkup",
        "Async counsel channel",
      ].map((text, order) => ({ _id: new ObjectId(), text, order })),
    },
    {
      name: "Growth Counsel",
      slug: "growth-counsel",
      tagline: "Stay raise-ready while you hire and sell.",
      description:
        "For teams hiring, closing customers, and preparing a seed or extension. Continuous readiness with faster turnaround.",
      cadence: "Monthly",
      highlight: true,
      order: 2,
      isVisible: true,
      ctaLabel: "Request access",
      features: [
        "Everything in Foundation",
        "Cap table & SAFE monitoring",
        "Employment & contractor paperwork",
        "Commercial contract review hours",
        "Monthly readiness briefing",
        "Priority response SLA",
      ].map((text, order) => ({ _id: new ObjectId(), text, order })),
    },
    {
      name: "Series Ready",
      slug: "series-ready",
      tagline: "Institutional diligence, without the scramble.",
      description:
        "Built for founders approaching priced rounds. Full diligence orchestration, board support, and eternal counsel continuity.",
      cadence: "Monthly",
      highlight: false,
      order: 3,
      isVisible: true,
      ctaLabel: "Request access",
      features: [
        "Everything in Growth Counsel",
        "Full diligence data room ownership",
        "Term sheet & side letter support",
        "Board governance packaging",
        "Named partner-level counsel",
        "Founder Circle membership",
      ].map((text, order) => ({ _id: new ObjectId(), text, order })),
    },
  ]);

  await healthQuestions.deleteMany({});
  await healthQuestions.insertMany(
    questions.map((q, index) => ({
      ...q,
      order: index + 1,
      weight: 1,
      isActive: true,
    })),
  );

  console.log("Veloria MongoDB seed complete.");
  console.log(`Admin login: ${adminEmail} / ${process.env.ADMIN_PASSWORD || "admin123"}`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
