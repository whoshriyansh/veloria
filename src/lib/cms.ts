import { prisma } from "@/lib/prisma";

export async function getSiteSettings() {
  return (
    (await prisma.siteSettings.findUnique({ where: { id: "default" } })) ??
    (await prisma.siteSettings.create({ data: { id: "default" } }))
  );
}

export async function getContactInfo() {
  return (
    (await prisma.contactInfo.findUnique({ where: { id: "default" } })) ??
    (await prisma.contactInfo.create({ data: { id: "default" } }))
  );
}

export async function getNavigation() {
  return prisma.navigationItem.findMany({
    where: { isVisible: true },
    orderBy: { order: "asc" },
  });
}

export async function getPageBySlug(slug: string) {
  return prisma.page.findUnique({ where: { slug } });
}

export async function getServices() {
  return prisma.service.findMany({
    where: { isVisible: true },
    orderBy: { order: "asc" },
  });
}

export async function getPackages() {
  return prisma.package.findMany({
    where: { isVisible: true },
    orderBy: { order: "asc" },
    include: { features: { orderBy: { order: "asc" } } },
  });
}

export async function getHealthQuestions() {
  return prisma.healthQuestion.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });
}
