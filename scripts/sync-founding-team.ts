import { config } from "dotenv";
import { MongoClient } from "mongodb";
import { FALLBACK_FOUNDING_MEMBERS } from "../src/lib/founding-team-data";

config({ path: ".env.local" });
config();

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("Set MONGODB_URI in .env before syncing the founding team.");
}
const mongoUri: string = uri;

async function main() {
  const client = new MongoClient(mongoUri);
  await client.connect();
  const db = client.db();
  const col = db.collection("foundingMembers");
  const keep = new Set(FALLBACK_FOUNDING_MEMBERS.map((m) => m.slug));

  for (const member of FALLBACK_FOUNDING_MEMBERS) {
    const { id: _id, ...fields } = member;
    await col.updateOne(
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

  const hidden = await col.updateMany(
    { slug: { $nin: [...keep] } },
    { $set: { isVisible: false, updatedAt: new Date() } },
  );

  const visible = await col.find({ isVisible: true }).sort({ order: 1 }).toArray();
  console.log(
    `Synced ${visible.length} founding members. Hidden ${hidden.modifiedCount} older records.`,
  );
  for (const member of visible) {
    console.log(`${member.order}. ${member.name} — ${member.role}`);
  }
  await client.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
