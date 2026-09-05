export type ScorePillar = {
  title: string;
  body: string;
  value: number;
  detail: string;
};

export const DEFAULT_SCORE_PILLARS: ScorePillar[] = [
  {
    title: "Corporate Structure",
    body: "Ownership, records and legal architecture",
    value: 82,
    detail:
      "Whether the entity, cap table, founder arrangements and statutory records would survive a first-pass diligence request without apology or reconstruction.",
  },
  {
    title: "Governance",
    body: "Decision-making and institutional discipline",
    value: 76,
    detail:
      "How decisions are recorded, who can bind the company, and whether the board and promoters operate with a process a serious counterparty would recognise.",
  },
  {
    title: "Contracts",
    body: "Commercial documentation and risk allocation",
    value: 80,
    detail:
      "The quality of customer, vendor, employment and project paper — and whether risk, payment and liability actually sit where you think they do.",
  },
  {
    title: "Compliance",
    body: "Operational and regulatory readiness",
    value: 74,
    detail:
      "Filings, licences, employment hygiene and the operational facts that tend to appear late in a data room and slow a transaction.",
  },
  {
    title: "Transaction Readiness",
    body: "Diligence and documentation preparedness",
    value: 78,
    detail:
      "Whether you can open a clean room: consistent records, a coherent story of the business, and documents that match what the pitch already claimed.",
  },
  {
    title: "Business Risk",
    body: "Exposure that could weaken value or negotiations",
    value: 78,
    detail:
      "The concentrations, disputes, personal guarantees and undocumented dependencies that a buyer, lender or fund will use to reprice the conversation.",
  },
];

export function mergeScorePillars(
  items: { title?: string; body?: string; value?: string | number }[],
): ScorePillar[] {
  if (!items.length) return DEFAULT_SCORE_PILLARS;

  return items.map((item, i) => {
    const fallback = DEFAULT_SCORE_PILLARS[i] ?? DEFAULT_SCORE_PILLARS[0];
    const parsed =
      typeof item.value === "number"
        ? item.value
        : Number.parseInt(String(item.value ?? ""), 10);
    return {
      title: item.title || fallback.title,
      body: item.body || fallback.body,
      value: Number.isFinite(parsed) ? parsed : fallback.value,
      detail: fallback.detail,
    };
  });
}
