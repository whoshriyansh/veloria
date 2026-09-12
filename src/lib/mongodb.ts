import { MongoClient, type Db } from "mongodb";

function clean(value?: string) {
  return (value ?? "").trim().replace(/^["']|["']$/g, "");
}

function dbNameFromUri(uri: string) {
  try {
    const parsed = new URL(uri.replace(/^mongodb(\+srv)?:\/\//, "https://"));
    const name = parsed.pathname.replace(/^\//, "").split("/")[0];
    return name || null;
  } catch {
    return null;
  }
}

const uri = clean(process.env.MONGODB_URI);

type Cache = {
  client: MongoClient | null;
  promise: Promise<MongoClient> | null;
  version: number;
};

declare global {
  // eslint-disable-next-line no-var
  var mongoCache: Cache | undefined;
}

const MONGO_CACHE_VERSION = 3;
const cached: Cache = global.mongoCache ?? { client: null, promise: null, version: 0 };
if (cached.version !== MONGO_CACHE_VERSION) {
  cached.client = null;
  cached.promise = null;
  cached.version = MONGO_CACHE_VERSION;
}
global.mongoCache = cached;

export function hasMongoUri() {
  return Boolean(clean(process.env.MONGODB_URI));
}

export async function getDb(): Promise<Db> {
  if (!uri) {
    throw new Error(
      "Missing MONGODB_URI. Set it in .env locally and in Vercel project settings.",
    );
  }

  const dbName =
    clean(process.env.MONGODB_DB) || dbNameFromUri(uri) || "veloria";

  if (cached.client) return cached.client.db(dbName);

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
