import { config } from "dotenv";
import bcrypt from "bcryptjs";
import { MongoClient } from "mongodb";

config({ path: ".env.local" });
config();

const uri = process.env.MONGODB_URI;
const adminEmail = (process.env.ADMIN_EMAIL || "admin@veloria.legal")
  .trim()
  .toLowerCase();
const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

if (!uri) {
  throw new Error("Set MONGODB_URI in .env");
}

const mongoUri: string = uri;

async function main() {
  const client = new MongoClient(mongoUri, {
    serverSelectionTimeoutMS: 8000,
    connectTimeoutMS: 8000,
  });
  await client.connect();
  const db = client.db();
  const users = db.collection("users");

  const existing = await users
    .find({})
    .project({ email: 1, role: 1 })
    .toArray();
  console.log(
    "Users in database:",
    existing.length ? existing.map((u) => u.email).join(", ") : "(none)",
  );

  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await users.updateOne(
    { email: adminEmail },
    {
      $set: {
        email: adminEmail,
        name: "Veloria Admin",
        passwordHash,
        role: "ADMIN",
        updatedAt: new Date(),
      },
      $setOnInsert: { createdAt: new Date() },
    },
    { upsert: true },
  );

  const check = await users.findOne({ email: adminEmail });
  const ok = check?.passwordHash
    ? await bcrypt.compare(adminPassword, check.passwordHash)
    : false;

  console.log(`Admin login email: ${adminEmail}`);
  console.log(
    `Password matches ADMIN_PASSWORD from .env: ${ok ? "yes" : "no"}`,
  );
  await client.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
