# Veloria

Luxury full-stack legal counsel platform for startups becoming **Investment Ready**, compliance ready, and paperwork ready.

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS 4
- Prisma + SQLite
- NextAuth (credentials) for admin CMS
- Framer Motion for cinematic motion

## Quick start

```bash
npm install
npx prisma migrate dev
npm run db:seed
npm run dev
```

- Site: [http://localhost:3000](http://localhost:3000)
- Admin: [http://localhost:3000/admin](http://localhost:3000/admin)
- Login: `admin@veloria.legal` / `admin123`

## What you get

### Public site
- Craft / Subduxion inspired luxury marketing experience
- Pages: Home, About (Eternal Legal Counsel), Services, Packages, Founder Circle, Legal Health Checkup, Contact
- First-visit popup for the Legal Health Checkup
- 15-question yes/no diagnostic → lead capture (name, phone, optional email)

### Admin CMS (`/admin`)
Manage the full site from the backend:
- Navigation menu
- Site settings + checkup popup copy
- Contact information
- Pages, services, packages
- Health checkup questions
- Leads with full answer reports, status, and notes for representatives

## Design references

Inspired by [itscraft.com](https://itscraft.com/), [subduxion.com](https://subduxion.com/), Primefolio, and BCG — dark forest aurora heroes, cream editorial sections, floating glass nav, expressive serif display typography.
