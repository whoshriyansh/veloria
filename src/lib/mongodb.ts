import { MongoClient, type Db } from "mongodb";
import { mongoUri } from "@/lib/env";

type Cache = {
  client: MongoClient | null;
  promise: Promise<MongoClient> | null;
  version: number;
};

declare global {
  // eslint-disable-next-line no-var
  var mongoCache: Cache | undefined;
}

const MONGO_CACHE_VERSION = 5;
const cached: Cache = global.mongoCache ?? { client: null, promise: null, version: 0 };
if (cached.version !== MONGO_CACHE_VERSION) {
  cached.client = null;
  cached.promise = null;
  cached.version = MONGO_CACHE_VERSION;
}
global.mongoCache = cached;

export function hasMongoUri() {
  return Boolean(mongoUri());
}

export async function getDb(): Promise<Db> {
  const uri = mongoUri();
  if (!uri) {
    throw new Error(
      "Missing MONGODB_URI. Set it in .env.local locally and in Vercel Environment Variables. Do not prefix it with NEXT_PUBLIC_.",
    );
  }

  if (cached.client) return cached.client.db();

  if (!cached.promise) {
    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 8000,
    });
    cached.promise = client.connect().then((c) => {
      cached.client = c;
      return c;
    });
  }

  try {
    const client = await cached.promise;
    return client.db();
  } catch (error) {
    cached.promise = null;
    cached.client = null;
    throw error;
  }
}

export async function connectMongo() {
  return getDb();
}
