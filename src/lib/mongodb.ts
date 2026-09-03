import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI;

type Cache = {
  client: MongoClient | null;
  promise: Promise<MongoClient> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var mongoCache: Cache | undefined;
}

const cached: Cache = global.mongoCache ?? { client: null, promise: null };
global.mongoCache = cached;

export function hasMongoUri() {
  return Boolean(process.env.MONGODB_URI);
}

export async function getDb(): Promise<Db> {
  if (!uri) {
    throw new Error(
      "Missing MONGODB_URI. Set it in .env locally and in Vercel project settings.",
    );
  }

  const dbName = process.env.MONGODB_DB || "veloria";

  if (cached.client) return cached.client.db(dbName);

  if (!cached.promise) {
    const client = new MongoClient(uri);
    cached.promise = client.connect().then((c) => {
      cached.client = c;
      return c;
    });
  }

  try {
    const client = await cached.promise;
    return client.db(dbName);
  } catch (error) {
    cached.promise = null;
    cached.client = null;
    throw error;
  }
}

export async function connectMongo() {
  return getDb();
}
