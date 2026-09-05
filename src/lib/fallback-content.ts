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
  { id: string; title: string; subtitle: string; content: string; sections: string }
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
    title: "This is not a networking group.",
    subtitle:
      "A closed table for founders, promoters and investors who treat readiness as leverage. Convened with intention. Extended by invitation.",
    content: `Submitting signals interest only. It does not constitute membership. Those selected are contacted directly. We read every note.

Members sit at closed dinners, readiness clinics, peer deal reviews and market briefings. What is said in the room stays in the room.

“Build the company before you build the pitch.”`,
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
      { id: "p3f5", text: "Founders Circle membership", order: 4 },
    ],
  },
];

export const FALLBACK_CLIENTS = [
  { id: "c1", name: "Northline", logoUrl: "", website: "", order: 1 },
  { id: "c2", name: "Harbour & Co.", logoUrl: "", website: "", order: 2 },
  { id: "c3", name: "Kiteworks", logoUrl: "", website: "", order: 3 },
  { id: "c4", name: "Aether Labs", logoUrl: "", website: "", order: 4 },
  { id: "c5", name: "Pinnacle Infra", logoUrl: "", website: "", order: 5 },
];

export const FALLBACK_QUESTIONS = [
  { id: "q1", question: "Is the company formally incorporated with current statutory records on file?", category: "Corporate Structure", order: 1, weight: 1, yesIsGood: true, helpText: "Investors expect a clean legal architecture." },
  { id: "q2", question: "Is ownership documented with founder agreements and a current cap table?", category: "Corporate Structure", order: 2, weight: 1, yesIsGood: true, helpText: "Undocumented equity stalls raises." },
  { id: "q3", question: "Have all founders assigned intellectual property to the company?", category: "Corporate Structure", order: 3, weight: 1, yesIsGood: true, helpText: "Missing IP assignments can kill a round." },
  { id: "q4", question: "Are board or director consents, minutes and decision records maintained?", category: "Governance", order: 4, weight: 1, yesIsGood: true, helpText: "Governance hygiene signals discipline." },
  { id: "q5", question: "Is there a clear process for material decisions and authority?", category: "Governance", order: 5, weight: 1, yesIsGood: true, helpText: "Unclear authority creates negotiation risk." },
  { id: "q6", question: "Are customer, vendor and project contracts in writing and current?", category: "Contracts", order: 6, weight: 1, yesIsGood: true, helpText: "Handshake deals become diligence exceptions." },
  { id: "q7", question: "Do employment and contractor agreements include confidentiality and IP assignment?", category: "Contracts", order: 7, weight: 1, yesIsGood: true, helpText: "Every contributor should have paper." },
  { id: "q8", question: "Have unusual liability, exclusivity or payment terms been reviewed?", category: "Contracts", order: 8, weight: 1, yesIsGood: true, helpText: "Early commercial paper can lock bad economics." },
  { id: "q9", question: "Are privacy, terms and any sector registrations current?", category: "Compliance", order: 9, weight: 1, yesIsGood: true, helpText: "Regulatory gaps surface in diligence." },
  { id: "q10", question: "Are licences, filings and statutory compliances up to date?", category: "Compliance", order: 10, weight: 1, yesIsGood: true, helpText: "Missed filings are expensive once a term sheet exists." },
  { id: "q11", question: "Is a data room organised with formation, equity, contracts and financials?", category: "Transaction Readiness", order: 11, weight: 1, yesIsGood: true, helpText: "A clean data room shortens diligence." },
  { id: "q12", question: "Have prior SAFEs, notes or investment instruments been inventoried?", category: "Transaction Readiness", order: 12, weight: 1, yesIsGood: true, helpText: "Undocumented instruments create conversion chaos." },
  { id: "q13", question: "Would you feel confident opening your files to a lead investor tomorrow?", category: "Transaction Readiness", order: 13, weight: 1, yesIsGood: true, helpText: "If no, that is why the Veloria Score exists." },
  { id: "q14", question: "Have you identified material litigation, disputes or regulatory exposure?", category: "Business Risk", order: 14, weight: 1, yesIsGood: false, helpText: "Yes means exposure exists — we help contain it." },
  { id: "q15", question: "Are there known payment, counterparty or project risks that could weaken value?", category: "Business Risk", order: 15, weight: 1, yesIsGood: false, helpText: "Hidden commercial risk is priced in last." },
];
