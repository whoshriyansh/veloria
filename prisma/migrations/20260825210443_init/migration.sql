-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'ADMIN',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'default',
    "siteName" TEXT NOT NULL DEFAULT 'Veloria',
    "tagline" TEXT NOT NULL DEFAULT 'Investment Ready',
    "heroHeadline" TEXT NOT NULL DEFAULT 'Investment Ready',
    "heroSubheadline" TEXT NOT NULL DEFAULT 'Startups: Make your platform Investment Ready, compliance ready, and paperwork ready.',
    "heroCtaLabel" TEXT NOT NULL DEFAULT 'Start Legal Health Checkup',
    "heroCtaHref" TEXT NOT NULL DEFAULT '/legal-health-checkup',
    "aboutPreview" TEXT NOT NULL DEFAULT 'We are your Eternal Legal Counsel — the strategic legal partner founders keep for every raise, hire, and exit.',
    "footerText" TEXT NOT NULL DEFAULT '© Veloria. Eternal legal counsel for ambitious startups.',
    "logoText" TEXT NOT NULL DEFAULT 'Veloria',
    "metaTitle" TEXT NOT NULL DEFAULT 'Veloria — Investment Ready Legal Counsel',
    "metaDescription" TEXT NOT NULL DEFAULT 'Veloria helps startups become investment ready, compliance ready, and paperwork ready.',
    "showCheckupPopup" BOOLEAN NOT NULL DEFAULT true,
    "popupDelayMs" INTEGER NOT NULL DEFAULT 1800,
    "popupTitle" TEXT NOT NULL DEFAULT 'How investment-ready is your startup?',
    "popupBody" TEXT NOT NULL DEFAULT 'Take our free 15-question Legal Health Checkup. A Veloria representative will review your answers and call you with a clear path forward.',
    "popupCta" TEXT NOT NULL DEFAULT 'Begin checkup'
);

-- CreateTable
CREATE TABLE "ContactInfo" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'default',
    "email" TEXT NOT NULL DEFAULT 'hello@veloria.legal',
    "phone" TEXT NOT NULL DEFAULT '+1 (415) 555-0142',
    "address" TEXT NOT NULL DEFAULT 'San Francisco · New York · Remote',
    "linkedin" TEXT NOT NULL DEFAULT '',
    "twitter" TEXT NOT NULL DEFAULT '',
    "calendly" TEXT NOT NULL DEFAULT '',
    "hours" TEXT NOT NULL DEFAULT 'Mon–Fri, 9am–6pm PT'
);

-- CreateTable
CREATE TABLE "NavigationItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "label" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "isExternal" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Page" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL DEFAULT '',
    "content" TEXT NOT NULL DEFAULT '',
    "heroImage" TEXT NOT NULL DEFAULT '',
    "seoTitle" TEXT NOT NULL DEFAULT '',
    "seoDescription" TEXT NOT NULL DEFAULT '',
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "sections" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL DEFAULT '',
    "icon" TEXT NOT NULL DEFAULT 'scale',
    "order" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "features" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Package" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "cadence" TEXT NOT NULL DEFAULT 'Monthly',
    "highlight" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "ctaLabel" TEXT NOT NULL DEFAULT 'Request access',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PackageFeature" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "packageId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "PackageFeature_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "HealthQuestion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "question" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'General',
    "order" INTEGER NOT NULL DEFAULT 0,
    "weight" INTEGER NOT NULL DEFAULT 1,
    "yesIsGood" BOOLEAN NOT NULL DEFAULT true,
    "helpText" TEXT NOT NULL DEFAULT '',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "company" TEXT,
    "score" INTEGER NOT NULL DEFAULT 0,
    "maxScore" INTEGER NOT NULL DEFAULT 15,
    "readiness" TEXT NOT NULL DEFAULT 'Needs Work',
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "source" TEXT NOT NULL DEFAULT 'Legal Health Checkup',
    "notes" TEXT NOT NULL DEFAULT '',
    "assignedTo" TEXT,
    "calledAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "LeadAnswer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "leadId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "answer" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LeadAnswer_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LeadAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "HealthQuestion" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LeadNote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "leadId" TEXT NOT NULL,
    "authorId" TEXT,
    "body" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LeadNote_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LeadNote_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Page_slug_key" ON "Page"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Service_slug_key" ON "Service"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Package_slug_key" ON "Package"("slug");
