import { PrismaClient, UserRole, ContentStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Create or ensure Default Admin
  const adminEmail = 'admin@avada.com';
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  let adminUser = existingAdmin;
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('admin123', 10);
    adminUser = await prisma.user.create({
      data: {
        email: adminEmail,
        name: 'Avada Administrator',
        passwordHash,
        role: UserRole.ADMIN,
      },
    });
    console.log(`✅ Created Admin user: ${adminEmail} (password: admin123)`);
  } else {
    console.log(`ℹ️ Admin user already exists: ${adminEmail}`);
  }

  // 2. Create Default Showcase Content
  const sampleItems = [
    {
      slug: 'welcome-to-avada',
      title: 'Welcome to Avada: Financial Technology Engineered for Scale',
      excerpt: 'Discover how Avada empowers global businesses with lightning-fast payment flows and robust infrastructure.',
      body: 'At Avada, we are building the next generation of financial infrastructure. Our platform simplifies payments, enhances transaction security, and provides actionable insights for growing enterprises worldwide.',
      category: 'announcements',
      status: ContentStatus.PUBLISHED,
    },
    {
      slug: 'seamless-global-payouts',
      title: 'Seamless Global Payouts Made Effortless',
      excerpt: 'Distribute funds to 140+ countries in local currencies with near-instant settlement and low transaction fees.',
      body: 'Cross-border commerce demands agile solutions. Avada connects with localized banking rails to ensure your recipients receive funds quickly without hidden markup or delays.',
      category: 'products',
      status: ContentStatus.PUBLISHED,
    },
    {
      slug: 'security-and-compliance-at-avada',
      title: 'Enterprise Security and Bank-Grade Compliance',
      excerpt: 'How we safeguard customer data with end-to-end encryption, SOC2 Type II compliance, and automated fraud prevention.',
      body: 'Security is at the heart of everything we build. Learn more about our multi-layered encryption protocols, automated AML checks, and real-time fraud mitigation algorithms.',
      category: 'security',
      status: ContentStatus.PUBLISHED,
    },
  ];

  for (const item of sampleItems) {
    const existing = await prisma.contentItem.findUnique({
      where: { slug: item.slug },
    });

    if (!existing && adminUser) {
      await prisma.contentItem.create({
        data: {
          ...item,
          authorId: adminUser.id,
        },
      });
      console.log(`✅ Seeded content: "${item.title}"`);
    }
  }

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
