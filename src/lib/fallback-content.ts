export const FALLBACK_HOME_SECTIONS = JSON.stringify([
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
  { type: "circle", quote: "Build the company before you build the pitch." },
]);

export const FALLBACK_PAGES: Record<
  string,
  {
    id: string;
    title: string;
    subtitle: string;
    content: string;
    sections: string;
    seoTitle?: string;
    seoDescription?: string;
  }
> = {
  home: {
    id: "home",
    title: "Build before you raise.",
    subtitle: "Structure. Strength. Readiness.",
    content:
      "Veloria helps startups, companies, builders, contractors, founders and business owners strengthen the foundations behind serious growth, capital, transactions and expansion.",
    sections: FALLBACK_HOME_SECTIONS,
  },
  about: {
    id: "about",
    title: "Built for businesses beyond one stage or one industry.",
    subtitle: "We strengthen the business behind the opportunity.",
    content: `Veloria works at the points where structure, documentation, governance and commercial readiness directly influence business value.

We are not a document marketplace. We are not a one-off filing service. We review businesses through the lens of an investor, institutional counterparty or sophisticated buyer — then help you strengthen what matters before the opportunity arrives.

The objective is not documentation for its own sake. It is to make the business more credible, defensible and ready for serious counterparties.`,
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
  "founder-circle": {
    id: "founder-circle",
    title: "A table. A night. The room decides the rest.",
    subtitle: "Veloria hosts a private dinner. Invitations are sent. There is nothing to join.",
    content: `A private dinner, thrown by Veloria. Royal in manner. Quiet in purpose. Invitations are extended — never an open list, never an application.`,
    sections: "[]",
  },
  contact: {
    id: "contact",
    title: "Build before the opportunity arrives.",
    subtitle: "Speak with Veloria. Tell us where you are. We will tell you what diligence will ask next.",
    content:
      "Whether you are raising capital, entering a major transaction, expanding a business, taking on a project or simply professionalising the company, Veloria helps prepare the foundation first.",
    sections: "[]",
  },
};

export const FALLBACK_SERVICES = [
  {
    id: "s1",
    title: "Corporate Structure & Governance",
    slug: "corporate-structure-governance",
    summary: "Ownership, board processes, records, founder arrangements and governance architecture.",
    description:
      "We review the legal spine of the company so the entity can survive diligence, not just a pitch meeting.",
    imageUrl: "",
    icon: "landmark",
    features: JSON.stringify(["Ownership and founder arrangements", "Board process and minutes", "Statutory records", "Governance architecture"]),
  },
  {
    id: "s2",
    title: "Contracts & Commercial Risk",
    slug: "contracts-commercial-risk",
    summary: "Commercial agreements, project contracts, employment arrangements and recurring documentation.",
    description:
      "We strengthen the paper that actually runs the business — with risk allocation a sophisticated counterparty will respect.",
    imageUrl: "",
    icon: "file-stack",
    features: JSON.stringify(["Customer and vendor agreements", "Project and works contracts", "Employment packs", "Risk allocation review"]),
  },
  {
    id: "s3",
    title: "Fundraising & Investment Readiness",
    slug: "fundraising-investment-readiness",
    summary: "Diligence preparation, term-sheet support and investment documentation.",
    description:
      "We prepare the company the way a lead investor will read it — so the raise is a process, not a cleanup project.",
    imageUrl: "",
    icon: "trending-up",
    features: JSON.stringify(["SAFE and note inventory", "Cap table reconciliation", "Term-sheet support", "Investment documentation"]),
  },
  {
    id: "s4",
    title: "Due Diligence Preparation",
    slug: "due-diligence-preparation",
    summary: "Identifying gaps before investors, lenders, buyers or institutional counterparties do.",
    description:
      "We run the review an investor would run — then close gaps while you still control the timeline.",
    imageUrl: "",
    icon: "search",
    features: JSON.stringify(["Gap analysis across six Score pillars", "Data room build", "Exception list", "Counterparty-ready packaging"]),
  },
  {
    id: "s5",
    title: "Projects & Expansion",
    slug: "projects-expansion",
    summary: "Legal-commercial support for projects, partnerships, growth and new markets.",
    description:
      "For builders, contractors and expanding companies — the contracts and counterparties underneath growth.",
    imageUrl: "",
    icon: "building-2",
    features: JSON.stringify(["Project and JV documentation", "Partnership structures", "New-market readiness", "Counterparty risk mapping"]),
  },
  {
    id: "s6",
    title: "Strategic Advisory",
    slug: "strategic-advisory",
    summary: "Clear legal-commercial thinking around consequential business decisions.",
    description:
      "Standing counsel for decisions that move value — when templates are not enough.",
    imageUrl: "",
    icon: "compass",
    features: JSON.stringify(["Named counsel access", "Consequential decision support", "Monthly readiness reviews", "Founders Circle eligibility"]),
  },
];

export const FALLBACK_PACKAGES = [
  {
    id: "p1",
    name: "Foundation",
    slug: "foundation",
    tagline: "Get the legal spine in place.",
    description: "For early teams establishing entity hygiene, founder equity, IP assignment and baseline commercial paper.",
    cadence: "Monthly",
    highlight: false,
    order: 1,
    isVisible: true,
    ctaLabel: "Request access",
    features: [
      { id: "p1f1", text: "Structure and founder equity review", order: 0 },
      { id: "p1f2", text: "IP assignment completion", order: 1 },
      { id: "p1f3", text: "Core template suite", order: 2 },
      { id: "p1f4", text: "Quarterly Veloria Score", order: 3 },
      { id: "p1f5", text: "Async counsel channel", order: 4 },
    ],
  },
  {
    id: "p2",
    name: "Growth Counsel",
    slug: "growth-counsel",
    tagline: "Stay raise-ready while you hire and sell.",
    description: "For teams hiring, closing customers and preparing a seed or extension.",
    cadence: "Monthly",
    highlight: true,
    order: 2,
    isVisible: true,
    ctaLabel: "Request access",
    features: [
      { id: "p2f1", text: "Everything in Foundation", order: 0 },
      { id: "p2f2", text: "Cap table and SAFE monitoring", order: 1 },
      { id: "p2f3", text: "Employment and contractor paperwork", order: 2 },
      { id: "p2f4", text: "Commercial contract review hours", order: 3 },
      { id: "p2f5", text: "Monthly readiness briefing", order: 4 },
    ],
  },
  {
    id: "p3",
    name: "Series Ready",
    slug: "series-ready",
    tagline: "Institutional diligence, without the scramble.",
    description: "For founders approaching priced rounds or high-value transactions.",
    cadence: "Monthly",
    highlight: false,
    order: 3,
    isVisible: true,
    ctaLabel: "Request access",
    features: [
      { id: "p3f1", text: "Everything in Growth Counsel", order: 0 },
      { id: "p3f2", text: "Full diligence data room ownership", order: 1 },
      { id: "p3f3", text: "Term sheet and side letter support", order: 2 },
      { id: "p3f4", text: "Named counsel", order: 3 },
      { id: "p3f5", text: "Invitation to a Veloria dinner", order: 4 },
    ],
  },
];

export const FALLBACK_FOUNDING_MEMBERS = [
  {
    id: "fm-divyam",
    slug: "divyam-gaur",
    name: "Divyam Gaur",
    role: "Founding Member",
    imageUrl: "/founding_team/divyam_gaur.jpeg",
    bio: "",
    order: 1,
  },
  {
    id: "fm-himanshu",
    slug: "himanshu-arya",
    name: "Himanshu Arya",
    role: "Founding Member",
    imageUrl: "/founding_team/himanshu_arya.jpeg",
    bio: "",
    order: 2,
  },
  {
    id: "fm-tanishq",
    slug: "tanishq-garg",
    name: "Tanishq Garg",
    role: "Founding Member",
    imageUrl: "/founding_team/tanishq_garg.jpeg",
    bio: "",
    order: 3,
  },
  {
    id: "fm-farishq",
    slug: "farishq-shidique",
    name: "Farishq Shidique",
    role: "Founding Member",
    imageUrl: "/founding_team/farishq_shidique.jpeg",
    bio: "",
    order: 4,
  },
];

export const FALLBACK_CLIENTS = [
  { id: "c1", name: "Northline", logoUrl: "", website: "", order: 1 },
  { id: "c2", name: "Harbour & Co.", logoUrl: "", website: "", order: 2 },
  { id: "c3", name: "Kiteworks", logoUrl: "", website: "", order: 3 },
  { id: "c4", name: "Aether Labs", logoUrl: "", website: "", order: 4 },
  { id: "c5", name: "Pinnacle Infra", logoUrl: "", website: "", order: 5 },
];

export const FALLBACK_ARTICLES = [
  {
    id: "a1",
    title: "Build the company before you build the pitch.",
    heading: "Readiness",
    imageUrl:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=720&q=55",
    link: "https://www.linkedin.com/",
    order: 1,
    isPublished: true,
  },
  {
    id: "a2",
    title: "What a serious counterparty reads first in a data room.",
    heading: "Diligence",
    imageUrl:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=720&q=55",
    link: "https://www.linkedin.com/",
    order: 2,
    isPublished: true,
  },
  {
    id: "a3",
    title: "Governance is not paperwork. It is how the company decides.",
    heading: "Governance",
    imageUrl:
      "https://images.unsplash.com/photo-1507679799987-4eee5c111973?auto=format&fit=crop&w=720&q=55",
    link: "https://www.linkedin.com/",
    order: 3,
    isPublished: true,
  },
];

export const FALLBACK_QUESTIONS = [
  { id: "q1", question: "Is the current ownership/shareholding structure clearly documented and up to date?", category: "Corporate Structure", order: 1, weight: 1, yesIsGood: true, helpText: "Unclear ownership is one of the first things a serious investor or buyer will stop on." },
  { id: "q2", question: "If there are multiple founders, is there a written agreement defining their respective roles and responsibilities?", category: "Corporate Structure", order: 2, weight: 1, yesIsGood: true, helpText: "Verbal founder arrangements become disputes the moment capital or a departure is on the table." },
  { id: "q3", question: "Does the company maintain its statutory registers, resolutions and corporate records in an organised manner?", category: "Corporate Structure", order: 3, weight: 1, yesIsGood: true, helpText: "If the records are not organised, the structure is not ready for diligence." },
  { id: "q4", question: "Is it clearly documented who can make financial, operational and strategic decisions for the company?", category: "Governance", order: 4, weight: 1, yesIsGood: true, helpText: "Investors need to see that the business is run through authority, not informal founder habit." },
  { id: "q5", question: "Are important decisions of the company formally recorded rather than relying only on WhatsApp, calls or verbal discussions?", category: "Governance", order: 5, weight: 1, yesIsGood: true, helpText: "If it is not written down, it will not survive a data-room review." },
  { id: "q6", question: "If the primary founder became unavailable for 60 days, could the business continue operating through an established decision-making structure?", category: "Governance", order: 6, weight: 1, yesIsGood: true, helpText: "Key-person dependence is a governance failure, not a personality trait." },
  { id: "q7", question: "Does the company have a written agreement with every major client?", category: "Contracts", order: 7, weight: 1, yesIsGood: true, helpText: "Handshake revenue is not an asset in diligence." },
  { id: "q8", question: "Do your contracts clearly establish who owns intellectual property created during the engagement?", category: "Contracts", order: 8, weight: 1, yesIsGood: true, helpText: "Unclear IP ownership can block a raise or a sale even when the product is strong." },
  { id: "q9", question: "Do you have written agreements with freelancers, consultants and external agencies working on your projects?", category: "Contracts", order: 9, weight: 1, yesIsGood: true, helpText: "Anyone who touches the work should have paper transferring rights to the company." },
  { id: "q10", question: "Are all registrations and licences required for your current business activities currently valid?", category: "Compliance", order: 10, weight: 1, yesIsGood: true, helpText: "Lapsed licences surface immediately when a counterparty asks for compliance records." },
  { id: "q11", question: "Are your statutory filings being completed within the applicable timelines?", category: "Compliance", order: 11, weight: 1, yesIsGood: true, helpText: "Late filings are inexpensive to fix early and expensive once a term sheet exists." },
  { id: "q12", question: "If you received an investment offer tomorrow, could you provide an investor with your complete corporate documents without significant preparation?", category: "Transaction Readiness", order: 12, weight: 1, yesIsGood: true, helpText: "If the files are not ready, the company is not ready." },
  { id: "q13", question: "Can you demonstrate ownership of the intellectual property that is critical to your business?", category: "Transaction Readiness", order: 13, weight: 1, yesIsGood: true, helpText: "The company must own the IP that makes the business valuable." },
  { id: "q14", question: "Does any single client currently contribute a disproportionately large percentage of your revenue?", category: "Business Risk", order: 14, weight: 1, yesIsGood: false, helpText: "Answering Yes means concentration risk — counterparties will price that in." },
  { id: "q15", question: "If a serious investor offered to begin due diligence next week, would you be confident that your business is legally and commercially ready for the process?", category: "Investment Readiness", order: 15, weight: 1, yesIsGood: true, helpText: "This is the Veloria Score in one question — build before you raise." },
];
