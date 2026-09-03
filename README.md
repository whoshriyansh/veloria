# Veloria

Business readiness, governance and transaction advisory. Full-stack Next.js site with a CMS, Veloria Score (Legal Health Checkup), and Cloudinary image uploads.

## Stack

- Next.js 16 + TypeScript + Tailwind CSS 4
- MongoDB (native driver)
- Cloudinary for images (max 10MB)
- NextAuth for `/admin`

## Environment

Copy `.env.example` → `.env`:

```bash
MONGODB_URI="mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/veloria?retryWrites=true&w=majority"
MONGODB_DB="veloria"
AUTH_SECRET="long-random-secret"
CLOUDINARY_CLOUD_NAME="daprgk9i3"
CLOUDINARY_API_KEY="your-key"
CLOUDINARY_API_SECRET="your-secret"
```

On Vercel, set the same variables. Then:

```bash
npm install
npm run db:seed
npm run dev
```

- Site: http://localhost:3000
- Admin: http://localhost:3000/admin
- After seed: `admin@veloria.legal` / `admin123`

## Admin

From `/admin` you can edit navigation, pages, services (with images), clients/logos, packages, checkup questions, settings, contact, and leads.

Upload images under **10MB** via Cloudinary on services, pages, and clients.
