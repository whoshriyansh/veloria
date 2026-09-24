export type FoundingTeamRecord = {
  id: string;
  slug: string;
  name: string;
  role: string;
  imageUrl: string;
  bio: string;
  order: number;
};

const FILES = [
  "01_himanshu_arya_Founder & Managing Partner.jpeg",
  "02_divyam_gaur_Co-founder & Managing Partner.jpeg",
  "03_tanishq_garg_Associate.jpeg",
  "04_farishq_shidique_Associate.jpeg",
  "05_preeti_garg_Associate.jpeg",
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
  const order = Number(match[1]);
  const slug = match[2].toLowerCase().replace(/_/g, "-");
  return {
    id: `fm-${slug}`,
    slug,
    name: titleName(match[2]),
    role: match[3].trim(),
    imageUrl: imageUrl(filename),
    bio: "",
    order,
  };
}

export const FALLBACK_FOUNDING_MEMBERS: FoundingTeamRecord[] =
  FILES.map(parseFile);
