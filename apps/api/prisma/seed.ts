import { PrismaClient, ContentStatus, UserStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const ALL_MODULES = [
  'insights',
  'inquiries',
  'inquiry_types',
  'countries',
  'articles',
  'policies',
  'settings',
  'roles',
  'users',
  'audit_logs',
] as const;

async function main() {
  console.log('🌱 Starting Enterprise CMS database seeding...');

  // 1. Create or Update Core System Roles
  const superAdminPermissions: Record<string, { view: boolean; edit: boolean }> = {};
  const editorPermissions: Record<string, { view: boolean; edit: boolean }> = {};
  const supportPermissions: Record<string, { view: boolean; edit: boolean }> = {};

  ALL_MODULES.forEach((mod) => {
    superAdminPermissions[mod] = { view: true, edit: true };
    editorPermissions[mod] = {
      view: true,
      edit: ['articles', 'countries', 'policies'].includes(mod),
    };
    supportPermissions[mod] = {
      view: ['inquiries', 'countries', 'insights'].includes(mod),
      edit: mod === 'inquiries',
    };
  });

  const superAdminRole = await prisma.role.upsert({
    where: { name: 'Super Administrator' },
    update: { permissions: superAdminPermissions },
    create: {
      name: 'Super Administrator',
      description: 'Complete unrestricted access across all CMS modules and system configuration.',
      permissions: superAdminPermissions,
      isSystem: true,
    },
  });

  await prisma.role.upsert({
    where: { name: 'Content Editor' },
    update: { permissions: editorPermissions },
    create: {
      name: 'Content Editor',
      description: 'Can manage and publish articles, legal policies, and regional country hubs.',
      permissions: editorPermissions,
      isSystem: true,
    },
  });

  await prisma.role.upsert({
    where: { name: 'Customer Support' },
    update: { permissions: supportPermissions },
    create: {
      name: 'Customer Support',
      description: 'Can view customer submissions, respond to inquiries, and add internal notes.',
      permissions: supportPermissions,
      isSystem: true,
    },
  });

  console.log('✅ Seeded Roles: Super Administrator, Content Editor, Customer Support');

  // 2. Create or ensure Default Super Admin User
  const adminEmail = 'admin@avada.com';
  const passwordHash = await bcrypt.hash('admin123', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      roleId: superAdminRole.id,
      status: UserStatus.ACTIVE,
    },
    create: {
      email: adminEmail,
      name: 'Avada Administrator',
      passwordHash,
      roleId: superAdminRole.id,
      status: UserStatus.ACTIVE,
    },
  });
  console.log(`✅ Seeded Admin user: ${adminEmail} (role: Super Administrator)`);

  // 3. Seed Default African Countries & Market Hubs
  const defaultCountries = [
    {
      code: 'rw',
      slug: 'rwanda',
      name: 'Rwanda',
      currencyCode: 'RWF',
      headline: 'Rwanda Payment Gateway & SMS Aggregator',
      tagline: 'Direct connections to MTN Mobile Money and Airtel Money across Rwanda.',
      description:
        'AvadaPay provides direct, licensed connectivity to Rwandan payment rails and SMS gateways with sub-second transaction callbacks and instant bank settlements.',
      telcoPartners: ['MTN Mobile Money Rwanda', 'Airtel Money Rwanda'],
      paymentRails: ['Mobile Money (Collections & Payouts)', 'Cards (Visa, Mastercard)', 'Bulk Airtime & SMS'],
      pricingSummary: 'Competitive 1.5% flat collection rate with zero setup fees for registered enterprises.',
      officeAddress: 'KG 7 Ave, Kigali Heights, 4th Floor, Kigali, Rwanda',
      officePhone: '+250 788 123 456',
      officeEmail: 'rwanda@avadapay.com',
      mapEmbedUrl: 'https://maps.google.com/maps?q=Kigali%20Heights,%20Rwanda&t=&z=15&ie=UTF8&iwloc=&output=embed',
      active: true,
      displayOrder: 1,
    },
    {
      code: 'ke',
      slug: 'kenya',
      name: 'Kenya',
      currencyCode: 'KES',
      headline: 'Kenya Payment Processing & Bulk SMS Hub',
      tagline: 'High-throughput M-Pesa Daraja APIs and card acquiring built for scale.',
      description:
        'Connect directly to Kenya’s dominant financial infrastructure. Support instant B2C payouts, C2B mobile money collections, and high-delivery transactional SMS.',
      telcoPartners: ['Safaricom M-Pesa', 'Airtel Money Kenya'],
      paymentRails: ['M-Pesa Express (STK Push)', 'Paybill & Till Integration', 'B2C Payouts', 'Bulk SMS'],
      pricingSummary: 'Volume-tiered transaction pricing starting from 1.4% with automatic daily sweeps.',
      officeAddress: 'Delta Corner Tower, Westlands, 7th Floor, Nairobi, Kenya',
      officePhone: '+254 700 987 654',
      officeEmail: 'kenya@avadapay.com',
      mapEmbedUrl: 'https://maps.google.com/maps?q=Delta%20Corner%20Nairobi&t=&z=15&ie=UTF8&iwloc=&output=embed',
      active: true,
      displayOrder: 2,
    },
    {
      code: 'tz',
      slug: 'tanzania',
      name: 'Tanzania',
      currencyCode: 'TZS',
      headline: 'Tanzania Cross-Border Payments & Aggregation',
      tagline: 'Unified integration across Vodacom, Tigo, Airtel, and Halopesa networks.',
      description:
        'Eliminate fragmentation across Tanzania’s multi-operator landscape. Single API integration for mobile money collections, merchant settlement, and customer notification.',
      telcoPartners: ['Vodacom M-Pesa', 'Tigo Pesa', 'Airtel Money Tanzania', 'Halopesa'],
      paymentRails: ['Unified Mobile Money Gateway', 'Bank Payouts via TIPS', 'Transactional SMS'],
      pricingSummary: 'Transparent pricing with automated reconciliation and multi-currency payout options.',
      officeAddress: 'Ali Hassan Mwinyi Rd, Victoria Place, Dar es Salaam, Tanzania',
      officePhone: '+255 754 321 098',
      officeEmail: 'tanzania@avadapay.com',
      mapEmbedUrl: 'https://maps.google.com/maps?q=Dar%20es%20Salaam,%20Tanzania&t=&z=15&ie=UTF8&iwloc=&output=embed',
      active: true,
      displayOrder: 3,
    },
  ];

  for (const country of defaultCountries) {
    await prisma.country.upsert({
      where: { code: country.code },
      update: country,
      create: country,
    });
  }
  console.log('✅ Seeded Countries: Rwanda, Kenya, Tanzania');

  // 4. Seed Default Inquiry Types
  const defaultInquiryTypes = [
    { key: 'sms', label: 'SMS Pricing & Routing', description: 'Bulk SMS rates, dedicated sender IDs, and gateway routing', displayOrder: 1 },
    { key: 'payments', label: 'Payment Processing (Collections & Payouts)', description: 'Mobile money and card collections, payout APIs, and settlement schedules', displayOrder: 2 },
    { key: 'pos', label: 'POS Terminal Solutions', description: 'Smart POS hardware procurement, retail merchant accounts, and terminal sync', displayOrder: 3 },
    { key: 'pos_demo', label: 'POS System Demo Request', description: 'Schedule a tailored demo with a retail payments specialist', displayOrder: 4 },
    { key: 'api', label: 'Technical & API Integration', description: 'Developer docs, sandbox keys, webhook integration, and SDK support', displayOrder: 5 },
    { key: 'partner', label: 'Enterprise Partnership', description: 'Strategic banking partnerships, reseller inquiries, and regional expansion', displayOrder: 6 },
    { key: 'general', label: 'General Inquiry', description: 'General questions and corporate contact', displayOrder: 7 },
  ];

  for (const inquiryType of defaultInquiryTypes) {
    await prisma.inquiryType.upsert({
      where: { key: inquiryType.key },
      update: inquiryType,
      create: { ...inquiryType, active: true },
    });
  }
  console.log('✅ Seeded Inquiry Types: 7 categories');

  // 5. Seed Site Settings (Contacts, Socials with Window Targets, Footer)
  const defaultSiteSettings = {
    contacts: {
      supportEmail: 'info@avadapay.com',
      supportPhone: '+260 968 332 766',
      salesEmail: 'sales@avadapay.com',
      officeAddress: '25th floor, SORP Business Centre, Tameem House, Barsha Heights, Dubai (UAE)',
    },
    socials: [
      { key: 'facebook', name: 'Facebook', url: 'https://facebook.com/avadapay', enabled: true, target: '_blank' },
      { key: 'linkedin', name: 'LinkedIn', url: 'https://linkedin.com/company/avadapay', enabled: true, target: '_blank' },
      { key: 'x', name: 'X (Twitter)', url: 'https://x.com/avadapay', enabled: true, target: '_blank' },
      { key: 'instagram', name: 'Instagram', url: null, enabled: false, target: '_blank' },
      { key: 'youtube', name: 'YouTube', url: null, enabled: false, target: '_blank' },
      { key: 'github', name: 'GitHub', url: 'https://github.com/avadapay', enabled: false, target: '_blank' },
    ],
    footer: {
      disclaimerText: 'AvadaPay is a pan-African payment gateway and SMS aggregator. Accept mobile money and card payments, run POS, and send automated payouts with enterprise compliance.',
      copyrightText: `© AvadaPay ${new Date().getFullYear()}. All rights reserved.`,
    },
  };

  await prisma.siteSetting.upsert({
    where: { key: 'site_config' },
    update: { value: defaultSiteSettings },
    create: {
      key: 'site_config',
      value: defaultSiteSettings,
      description: 'Global site configuration: Footer contacts, social media URLs with targets, and legal disclaimers.',
    },
  });
  console.log('✅ Seeded Site Settings: Contacts & Socials with Window Targets');

  // 6. Seed Legal Policies (Terms of Service, Privacy Policy, Cookie Policy)
  const legalPolicies = [
    {
      slug: 'terms',
      title: 'Terms of Service',
      summary: 'Governing agreement for merchants, developers, and partners using AvadaPay payment and SMS infrastructure.',
      version: '1.0',
      effectiveDate: new Date('2026-01-01'),
      status: ContentStatus.PUBLISHED,
      content: `
# AvadaPay Terms of Service

*Effective Date: January 1, 2026* • *Version: 1.0*

Welcome to AvadaPay. These Terms of Service constitute a legally binding agreement between you (the "Merchant", "User", or "Customer") and AvadaPay Technology Solutions Ltd ("AvadaPay", "we", "us", or "our").

---

### 1. Acceptance of Terms
By accessing or using our websites, payment collection gateways, POS terminals, payout APIs, or SMS aggregations, you affirm that you have the authority to bind your organization and agree to abide by these Terms.

### 2. Services Provided
AvadaPay provides modern financial infrastructure, enabling businesses to:
* Collect mobile money and card payments across supported African jurisdictions.
* Initiate automated bulk disbursements and remittances.
* Deploy certified smart POS retail payment hardware.
* Send transactional and promotional SMS notifications.

### 3. Account Security & Verification
You must complete our Know Your Customer (KYC) and Anti-Money Laundering (AML) onboarding procedures before processing live financial transactions. You agree to safeguard your API credentials and notify us immediately of any unauthorized access.

### 4. Settlement & Fees
* Transaction fees are automatically deducted at the point of processing as specified in your Merchant Agreement.
* Settlements are executed into your verified local banking or mobile wallet account according to agreed schedules (T+0 or T+1).
* AvadaPay reserves the right to hold funds suspected of fraudulent or unauthorized transactions pending review.

### 5. Prohibited Activities
You may not utilize AvadaPay for illegal gambling, unlicensed narcotics, unauthorized multi-level marketing, or activities violating local regulatory directives in Rwanda, Kenya, Tanzania, or other operational markets.

### 6. Limitation of Liability
To the maximum extent permitted by applicable law, AvadaPay shall not be liable for indirect, incidental, or consequential damages resulting from upstream carrier downtime or network delays.

### 7. Governing Law
These Terms are governed by the laws of Rwanda and international financial dispute resolution protocols.

---
*For questions regarding these Terms, contact legal@avadapay.com.*
      `.trim(),
    },
    {
      slug: 'privacy',
      title: 'Privacy Policy',
      summary: 'How AvadaPay collects, processes, encrypts, and safeguards personal and financial data across pan-African operations.',
      version: '1.0',
      effectiveDate: new Date('2026-01-01'),
      status: ContentStatus.PUBLISHED,
      content: `
# AvadaPay Privacy Policy

*Effective Date: January 1, 2026* • *Version: 1.0*

At AvadaPay, we respect your confidentiality and are committed to protecting all personal and transaction data entrusted to us.

---

### 1. Information We Collect
We collect data strictly necessary to facilitate financial transactions, ensure regulatory compliance, and deliver high-reliability services:
* **Merchant Profile Information:** Legal corporate entity name, registration documents, tax identifiers, registered directors' identities, and contact details.
* **Transaction Metadata:** Sender and recipient phone numbers, transaction amounts, timestamps, currency codes, and transaction reference IDs.
* **Technical Telemetry:** IP address, device fingerprints, browser headers, and system response latencies to safeguard against fraudulent traffic and malicious attacks.

### 2. How We Use Information
* To route and clear payments through partner telecommunications operators and financial institutions.
* To comply with Central Bank regulations, AML checks, and mandatory fraud prevention audits.
* To deliver SMS dispatch verification and transaction notification callbacks.
* To provide 24/7 technical and merchant customer support.

### 3. Data Protection & Encryption
All sensitive data in transit is encrypted using TLS 1.3 encryption. Data at rest is secured using AES-256 bank-grade encryption within PCI-DSS certified cloud infrastructure.

### 4. Data Sharing & Third Parties
We do not sell personal data. We disclose transaction details only to:
* Licensed telecommunications carriers (e.g. MTN, Safaricom, Airtel, Vodacom) necessary to complete payments.
* Accredited banking clearing houses and regulatory authorities when mandated by statutory law.

### 5. Data Retention & Your Rights
In compliance with international financial statutes, transaction records are retained for a minimum of 5 years. You have the right to request access to or correction of your registered business details by contacting privacy@avadapay.com.

---
*Questions regarding data protection? Email privacy@avadapay.com.*
      `.trim(),
    },
    {
      slug: 'cookies',
      title: 'Cookie Policy',
      summary: 'Details regarding how cookies and local telemetry are utilized to enhance website security, performance, and user experience.',
      version: '1.0',
      effectiveDate: new Date('2026-01-01'),
      status: ContentStatus.PUBLISHED,
      content: `
# AvadaPay Cookie Policy

*Effective Date: January 1, 2026* • *Version: 1.0*

This Cookie Policy explains how AvadaPay utilizes cookies and associated browser technologies on our marketing website and CMS portal.

---

### 1. What Are Cookies?
Cookies are compact text files stored on your device that enable websites to remember user preferences, maintain authenticated sessions, and measure platform accessibility.

### 2. Categories of Cookies We Use
* **Strictly Necessary Cookies:** Essential for secure navigation, CSRF protection, and administrator authentication in the CMS portal.
* **Performance & Telemetry Cookies:** Measure page load latencies, top visited routes, and API availability to ensure our services load swiftly.
* **Preference Cookies:** Remember selected country markets and language choices across browser sessions.

### 3. Third-Party Cookies
We minimize third-party scripts. Any analytics or bot mitigation cookies used are configured to anonymize IP addresses and prevent cross-site profiling.

### 4. Managing Your Cookie Preferences
You can modify your browser settings to decline non-essential cookies. Disabling strictly necessary cookies may impair portal authentication functionality.

---
*For inquiries regarding our Cookie Policy, contact support@avadapay.com.*
      `.trim(),
    },
  ];

  for (const policy of legalPolicies) {
    await prisma.legalPolicy.upsert({
      where: { slug: policy.slug },
      update: policy,
      create: policy,
    });
  }
  console.log('✅ Seeded Legal Policies: Terms of Service, Privacy Policy, Cookie Policy');

  // 7. Seed Sample Showcase Content Items
  const sampleItems = [
    {
      slug: 'welcome-to-avada',
      title: 'Welcome to Avada: Financial Technology Engineered for Scale',
      excerpt: 'Discover how Avada empowers global businesses with lightning-fast payment flows and robust infrastructure.',
      body: 'At Avada, we are building the next generation of financial infrastructure across East and Central Africa.',
      category: 'announcements',
      status: ContentStatus.PUBLISHED,
      authorId: adminUser.id,
    },
    {
      slug: 'seamless-global-payouts',
      title: 'Seamless Global Payouts Made Effortless',
      excerpt: 'Distribute funds to 140+ countries in local currencies with near-instant settlement and low transaction fees.',
      body: 'Cross-border commerce demands agile solutions. Avada connects with localized banking rails across Africa.',
      category: 'products',
      status: ContentStatus.PUBLISHED,
      authorId: adminUser.id,
    },
    {
      slug: 'security-and-compliance-at-avada',
      title: 'Enterprise Security and Bank-Grade Compliance',
      excerpt: 'How we safeguard customer data with end-to-end encryption, SOC2 Type II compliance, and automated fraud prevention.',
      body: 'Security is at the heart of everything we build. Learn more about our multi-layered encryption protocols.',
      category: 'security',
      status: ContentStatus.PUBLISHED,
      authorId: adminUser.id,
    },
  ];

  for (const item of sampleItems) {
    await prisma.contentItem.upsert({
      where: { slug: item.slug },
      update: item,
      create: item,
    });
  }
  console.log('✅ Seeded Showcase Content Articles');

  // 8. Seed Sample Inquiries for CRM Demo
  const sampleInquiries = [
    {
      fullName: 'Jean-Paul Habimana',
      email: 'jp.habimana@kigaliretail.rw',
      phone: '+250 788 334 112',
      orgName: 'Kigali Supermarkets Ltd',
      roleTitle: 'Operations Director',
      country: 'Rwanda',
      inquiryType: 'pos',
      message: 'We are expanding to 12 new retail branches in Kigali and Rubavu. We need smart Android POS terminals with MTN and Airtel MoMo support and automated daily settlement.',
      status: 'UNREAD' as const,
    },
    {
      fullName: 'Faith Mwangi',
      email: 'fmwangi@nairobiexpress.co.ke',
      phone: '+254 712 554 990',
      orgName: 'Nairobi Express Logistics',
      roleTitle: 'Chief Technology Officer',
      country: 'Kenya',
      inquiryType: 'sms',
      message: 'Looking for high-volume transactional Bulk SMS rates for dispatching delivery alerts. Expected volume is 250,000 SMS per month with custom Sender ID.',
      status: 'CONTACTED' as const,
      handledById: adminUser.id,
      handledAt: new Date(),
      adminNotes: 'Spoke with Faith. Sent proposal for tiered SMS pricing at KES 0.32/SMS. Follow up on Monday.',
    },
  ];

  for (const inq of sampleInquiries) {
    const existing = await prisma.contactInquiry.findFirst({
      where: { email: inq.email },
    });
    if (!existing) {
      await prisma.contactInquiry.create({ data: inq });
    }
  }
  console.log('✅ Seeded Sample Inquiries');

  console.log('🎉 Enterprise CMS Database Seeding Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
