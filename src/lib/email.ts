import { collections } from "@/lib/models";
import { brevoApiKey, brevoSenderEmail, brevoSenderName } from "@/lib/env";
import { connectMongo, hasMongoUri } from "@/lib/mongodb";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type LeadMail = {
  name: string;
  phone: string;
  email?: string | null;
  company?: string | null;
  source: string;
  score?: number;
  maxScore?: number;
  readiness?: string;
  notes?: string;
};

function esc(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function wrapEmail(title: string, body: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(title)}</title>
</head>
<body style="margin:0;padding:0;background:#f3efe7;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3efe7;padding:36px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #e7e1d4;">
          <tr>
            <td style="background:#0b1f1a;padding:28px 32px;">
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#c4a574;">Veloria</p>
              <h1 style="margin:12px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:26px;font-weight:500;line-height:1.25;color:#f3efe7;">${esc(title)}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px 8px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:#141816;">
              ${body}
            </td>
          </tr>
          <tr>
            <td style="padding:8px 32px 28px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:#3a423e;">
              Structure. Strength. Readiness.<br />
              This is a transactional note from Veloria. It is not legal advice.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function visitorHtml(lead: LeadMail) {
  const first = esc(lead.name.split(" ")[0] || lead.name);
  const source =
    lead.source === "Legal Health Checkup"
      ? "your Veloria Score"
      : "your message";
  return wrapEmail(
    "We received your request.",
    `<p style="margin:0 0 14px;">Dear ${first},</p>
     <p style="margin:0 0 14px;">Thank you for ${source}. We have received your request and will reach out to you within the next 24 hours.</p>
     <p style="margin:0;">Warm regards,<br />Veloria</p>`,
  );
}

function staffHtml(lead: LeadMail) {
  const rows: [string, string][] = [
    ["Source", lead.source],
    ["Name", lead.name],
    ["Phone", lead.phone],
    ["Email", lead.email || "—"],
    ["Company", lead.company || "—"],
  ];
  if (lead.source === "Legal Health Checkup") {
    rows.push(["Readiness", lead.readiness || "—"]);
    if (typeof lead.score === "number" && typeof lead.maxScore === "number") {
      rows.push(["Score", `${lead.score} / ${lead.maxScore}`]);
    }
  }
  if (lead.notes) rows.push(["Notes", lead.notes]);

  const table = rows
    .map(
      ([label, value]) =>
        `<tr>
          <td style="padding:8px 0;border-bottom:1px solid #e7e1d4;width:120px;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#c4a574;">${esc(label)}</td>
          <td style="padding:8px 0;border-bottom:1px solid #e7e1d4;color:#141816;">${esc(value)}</td>
        </tr>`,
    )
    .join("");

  return wrapEmail(
    "A new lead has arrived.",
    `<p style="margin:0 0 18px;">A new enquiry was submitted on the Veloria site. Details below.</p>
     <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${table}</table>
     <p style="margin:18px 0 0;">Please follow up within 24 hours.</p>`,
  );
}

export function sanitizeNotifyEmails(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  const cleaned = input
    .map((item) => String(item ?? "").trim().toLowerCase())
    .filter((email) => EMAIL_RE.test(email));
  return [...new Set(cleaned)].slice(0, 3);
}

async function loadNotifyEmails() {
  if (!hasMongoUri()) return [];
  await connectMongo();
  const contactInfo = await collections.contactInfo();
  const contact = await contactInfo.findOne({ key: "default" });
  return sanitizeNotifyEmails(contact?.notifyEmails);
}

async function sendBrevo(to: string, subject: string, htmlContent: string) {
  const key = brevoApiKey();
  if (!key) {
    console.error("Email not sent: BREVO_API_KEY is missing.");
    return false;
  }
  if (key.startsWith("xsmtpsib-")) {
    console.error(
      "Email not sent: BREVO_API_KEY looks like an SMTP key. Use the xkeysib- API key instead.",
    );
    return false;
  }

  const sender = {
    email: brevoSenderEmail(),
    name: brevoSenderName(),
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      cache: "no-store",
      signal: controller.signal,
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": key,
      },
      body: JSON.stringify({
        sender,
        to: [{ email: to }],
        subject,
        htmlContent,
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error(
        `Brevo send failed (${res.status}) to ${to}:`,
        detail.slice(0, 400),
      );
      return false;
    }

    console.log(`Brevo email sent to ${to} (${subject})`);
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Brevo send error to ${to}:`, message);
    return false;
  } finally {
    clearTimeout(timer);
  }
}

export async function notifyNewLead(lead: LeadMail) {
  const jobs: Promise<boolean>[] = [];

  const visitor = (lead.email ?? "").trim().toLowerCase();
  if (visitor && EMAIL_RE.test(visitor)) {
    jobs.push(
      sendBrevo(
        visitor,
        "We received your request — Veloria",
        visitorHtml(lead),
      ),
    );
  } else {
    console.log("Visitor confirmation skipped — lead has no valid email.");
  }

  const staff = await loadNotifyEmails();
  if (!staff.length) {
    console.log("No dashboard notify emails set — skipping internal lead alert.");
  } else {
    for (const email of staff) {
      jobs.push(sendBrevo(email, "New lead received — Veloria", staffHtml(lead)));
    }
  }

  if (jobs.length) await Promise.all(jobs);
}
