export type FoundingTeamRecord = {
  id: string;
  slug: string;
  name: string;
  role: string;
  imageUrl: string;
  bio: string;
  order: number;
};

const BIOS: Record<string, string> = {
  "himanshu-arya":
    "Himanshu leads Veloria’s work on structure, governance and the foundations that make a company ready for capital and serious counterparties.",
  "divyam-gaur":
    "Divyam shapes the commercial and transaction side of the practice — the documents, diligence and decisions that have to hold under pressure.",
  "tanishq-garg":
    "Tanishq supports corporate records, founder arrangements and the everyday documentation that keeps a business inspection-ready.",
  "farishq-shidique":
    "Farishq works across contracts and commercial risk, helping clients put clean paper behind the deals they intend to close.",
  "preeti-garg":
    "Preeti assists with research, filings and the disciplined follow-through that turns advice into a record a counterparty can trust.",
  rupesh:
    "Rupesh supports the associate bench on review, documentation and the practical work behind a Veloria engagement.",
};

const DISPLAY: Record<string, { order: number; name?: string }> = {
  rupesh: { order: 3, name: "Rupesh Gupta" },
  "preeti-garg": { order: 4 },
  "farishq-shidique": { order: 5 },
  "tanishq-garg": { order: 6 },
};

const FILES = [
  "01_himanshu_arya_Founder & Managing Partner.jpeg",
  "02_divyam_gaur_Co-founder & Managing Partner.jpeg",
  "03_tanishq_garg_Associate.jpeg",
  "04_farishq_shidique_Associate.jpeg",
  "05_preeti_garg_Associate.png",
  "06_Rupesh_Associate.png",
] as const;

function titleName(raw: string) {
  return raw
    .split(/[_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function imageUrl(filename: string) {
  return `/founding_team/${filename.split("/").map(encodeURIComponent).join("/")}`;
}

function parseFile(filename: string): FoundingTeamRecord {
  const base = filename.replace(/\.(jpe?g|png|webp)$/i, "");
  const match = base.match(/^(\d+)_([A-Za-z]+(?:_[A-Za-z]+)*)_(.+)$/);
  if (!match) {
    throw new Error(`Could not parse founding team filename: ${filename}`);
  }
  const slug = match[2].toLowerCase().replace(/_/g, "-");
  const display = DISPLAY[slug];
  return {
    id: `fm-${slug}`,
    slug,
    name: display?.name ?? titleName(match[2]),
    role: match[3].trim(),
    imageUrl: imageUrl(filename),
    bio: BIOS[slug] ?? "",
    order: display?.order ?? Number(match[1]),
  };
}

export const FALLBACK_FOUNDING_MEMBERS: FoundingTeamRecord[] =
  FILES.map(parseFile);
