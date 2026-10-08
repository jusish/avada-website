import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma';
import { PublicSiteConfig, SocialLink, GeneralContacts, FooterConfig } from '@avada/shared';

const router = Router();

// GET /api/public/site-config
// Returns bundled dynamic configuration for public website navigation, footer, and forms
router.get('/site-config', async (_req: Request, res: Response): Promise<void> => {
  try {
    const [countries, inquiryTypes, settingsRecord] = await Promise.all([
      prisma.country.findMany({
        where: { active: true },
        orderBy: { displayOrder: 'asc' },
      }),
      prisma.inquiryType.findMany({
        where: { active: true },
        orderBy: { displayOrder: 'asc' },
      }),
      prisma.siteSetting.findUnique({
        where: { key: 'site_config' },
      }),
    ]);

    const defaultContacts: GeneralContacts = {
      supportEmail: 'info@avadapay.com',
      supportPhone: '+260 968 332 766',
      salesEmail: 'sales@avadapay.com',
      officeAddress: '25th floor, SORP Business Centre, Tameem House, Barsha Heights, Dubai (UAE)',
    };

    const defaultSocials: SocialLink[] = [
      { key: 'facebook', name: 'Facebook', url: 'https://facebook.com/avadapay', enabled: true, target: '_blank' },
      { key: 'linkedin', name: 'LinkedIn', url: 'https://linkedin.com/company/avadapay', enabled: true, target: '_blank' },
      { key: 'x', name: 'X (Twitter)', url: 'https://x.com/avadapay', enabled: true, target: '_blank' },
    ];

    const defaultFooter: FooterConfig = {
      disclaimerText: 'AvadaPay is a pan-African payment gateway and SMS aggregator.',
      copyrightText: `© AvadaPay ${new Date().getFullYear()}. All rights reserved.`,
    };

    const parsedSettings = (settingsRecord?.value as Record<string, unknown>) || {};

    const config: PublicSiteConfig = {
      countries: countries.map((c) => ({
        ...c,
        telcoPartners: (c.telcoPartners as string[]) || [],
        paymentRails: (c.paymentRails as string[]) || [],
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt.toISOString(),
      })),
      inquiryTypes: inquiryTypes.map((i) => ({
        ...i,
        createdAt: i.createdAt.toISOString(),
        updatedAt: i.updatedAt.toISOString(),
      })),
      contacts: (parsedSettings.contacts as GeneralContacts) || defaultContacts,
      socials: (parsedSettings.socials as SocialLink[]) || defaultSocials,
      footer: (parsedSettings.footer as FooterConfig) || defaultFooter,
    };

    res.json({
      success: true,
      data: config,
    });
  } catch (error) {
    console.error('Fetch site-config error:', error);
    res.status(500).json({ success: false, error: 'Failed to load site configuration' });
  }
});

// GET /api/public/countries/:slug
router.get('/countries/:slug', async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const country = await prisma.country.findFirst({
      where: {
        slug: slug.toLowerCase().trim(),
        active: true,
      },
    });

    if (!country) {
      res.status(404).json({ success: false, error: 'Country market hub not found or not currently active.' });
      return;
    }

    res.json({
      success: true,
      data: {
        ...country,
        telcoPartners: (country.telcoPartners as string[]) || [],
        paymentRails: (country.paymentRails as string[]) || [],
        createdAt: country.createdAt.toISOString(),
        updatedAt: country.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Fetch country error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch country details' });
  }
});

// GET /api/public/policies/:slug
router.get('/policies/:slug', async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const policy = await prisma.legalPolicy.findFirst({
      where: {
        slug: slug.toLowerCase().trim(),
        status: 'PUBLISHED',
      },
    });

    if (!policy) {
      res.status(404).json({ success: false, error: 'Policy document not found or unpublished.' });
      return;
    }

    res.json({
      success: true,
      data: {
        ...policy,
        effectiveDate: policy.effectiveDate.toISOString(),
        createdAt: policy.createdAt.toISOString(),
        updatedAt: policy.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Fetch policy error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch policy' });
  }
});

const contactInquirySchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email address required'),
  phone: z.string().optional(),
  orgName: z.string().optional(),
  roleTitle: z.string().optional(),
  country: z.string().min(1, 'Country is required'),
  inquiryType: z.string().min(1, 'Inquiry type is required'),
  message: z.string().min(5, 'Message must be at least 5 characters'),
});

// POST /api/public/contact
router.post('/contact', async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = contactInquirySchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: parseResult.error.errors,
      });
      return;
    }

    const { fullName, email, phone, orgName, roleTitle, country, inquiryType, message } = parseResult.data;
    const ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';

    const inquiry = await prisma.contactInquiry.create({
      data: {
        fullName,
        email,
        phone,
        orgName,
        roleTitle,
        country,
        inquiryType,
        message,
        status: 'UNREAD',
        ipAddress,
        userAgent,
      },
    });

    res.status(201).json({
      success: true,
      data: { id: inquiry.id },
      message: 'Inquiry received successfully. An AvadaPay specialist will follow up shortly.',
    });
  } catch (error) {
    console.error('Submit contact inquiry error:', error);
    res.status(500).json({ success: false, error: 'Failed to submit inquiry' });
  }
});

export default router;
