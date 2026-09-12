function clean(value?: string) {
  return (value ?? "").trim().replace(/^["']|["']$/g, "");
}

export function mongoUri() {
  return clean(process.env.MONGODB_URI);
}

export function authSecret() {
  return clean(process.env.AUTH_SECRET) || clean(process.env.NEXTAUTH_SECRET);
}
