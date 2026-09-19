function clean(value?: string) {
  return (value ?? "").trim().replace(/^["']|["']$/g, "");
}

export function mongoUri() {
  return clean(process.env.MONGODB_URI);
}

export function authSecret() {
  return clean(process.env.AUTH_SECRET) || clean(process.env.NEXTAUTH_SECRET);
}

export function groqApiKey() {
  return clean(process.env.GROQ_API_KEY);
}

export function groqModel() {
  return clean(process.env.GROQ_MODEL) || "qwen/qwen3.8-27b";
}

export function brevoApiKey() {
  return clean(process.env.BREVO_API_KEY);
}

export function brevoSenderEmail() {
  return clean(process.env.BREVO_SENDER_EMAIL) || "no-reply@veloria.co.in";
}

export function brevoSenderName() {
  return clean(process.env.BREVO_SENDER_NAME) || "Veloria";
}

export function siteUrl() {
  const explicit = clean(process.env.SITE_URL) || clean(process.env.NEXT_PUBLIC_SITE_URL);
  if (explicit) return explicit.replace(/\/+$/, "");
  const vercel = clean(process.env.VERCEL_PROJECT_PRODUCTION_URL);
  if (vercel) return `https://${vercel.replace(/^https?:\/\//, "").replace(/\/+$/, "")}`;
  return "https://veloria.co.in";
}
