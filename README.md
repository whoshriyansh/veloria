# Veloria

Luxury full-stack legal counsel platform for startups becoming **Investment Ready**, compliance ready, and paperwork ready.

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS 4
- **MongoDB** via the official `mongodb` driver (Atlas-ready for Vercel)
- NextAuth (credentials) for admin CMS
- Framer Motion

## Environment

Copy `.env.example` → `.env` and set:

```bash
MONGODB_URI="mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/veloria?retryWrites=true&w=majority"
AUTH_SECRET="long-random-secret"
AUTH_TRUST_HOST="true"
```

On **Vercel → Project → Settings → Environment Variables**, add the same `MONGODB_URI` and `AUTH_SECRET` for Production (and Preview if needed).

## Quick start

```bash
npm install
# set MONGODB_URI in .env
npm run db:seed
npm run dev
```

- Site: http://localhost:3000
- Admin: http://localhost:3000/admin
- Login (after seed): `admin@veloria.legal` / `admin123`

## What you get

### Public site
- Craft / Subduxion inspired luxury marketing experience
- Pages: Home, About, Services, Packages, Founder Circle, Legal Health Checkup, Contact
- First-visit checkup popup
- 15-question diagnostic → lead capture

### Admin CMS (`/admin`)
- Navigation, settings, contact, pages, services, packages, questions
- Leads with answer reports, status, and notes
