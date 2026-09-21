import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

const contentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().optional(),
  excerpt: z.string().default(''),
  body: z.string().min(1, 'Body content is required'),
  category: z.string().default('general'),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('PUBLISHED'),
});

// GET /api/content - Retrieve content list
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, status } = req.query;

    const where: any = {};
    if (category && typeof category === 'string') {
      where.category = category;
    }
    if (status && typeof status === 'string') {
      where.status = status;
    }

    const items = await prisma.contentItem.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    res.json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error('Fetch content error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch content items' });
  }
});

// GET /api/content/:id - Single item
router.get('/:idOrSlug', async (req: Request, res: Response): Promise<void> => {
  try {
    const { idOrSlug } = req.params;

    const item = await prisma.contentItem.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!item) {
      res.status(404).json({ success: false, error: 'Content not found' });
      return;
    }

    res.json({ success: true, data: item });
  } catch (error) {
    console.error('Fetch single content error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch content item' });
  }
});

// POST /api/content - Create new content item (Admin required)
router.post('/', requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const parseResult = contentSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: parseResult.error.errors,
      });
      return;
    }

    const { title, excerpt, body, category, status } = parseResult.data;
    const authorId = req.user!.id;

    const slug =
      parseResult.data.slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') + `-${Date.now().toString().slice(-4)}`;

    const newItem = await prisma.contentItem.create({
      data: {
        title,
        slug,
        excerpt,
        body,
        category,
        status,
        authorId,
      },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: newItem,
      message: 'Content item created successfully',
    });
  } catch (error) {
    console.error('Create content error:', error);
    res.status(500).json({ success: false, error: 'Failed to create content item' });
  }
});

// PUT /api/content/:id - Update content item (Admin required)
router.put('/:id', requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const parseResult = contentSchema.partial().safeParse(req.body);

    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: parseResult.error.errors,
      });
      return;
    }

    const existing = await prisma.contentItem.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, error: 'Content item not found' });
      return;
    }

    const updated = await prisma.contentItem.update({
      where: { id },
      data: parseResult.data,
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    res.json({
      success: true,
      data: updated,
      message: 'Content updated successfully',
    });
  } catch (error) {
    console.error('Update content error:', error);
    res.status(500).json({ success: false, error: 'Failed to update content item' });
  }
});

// DELETE /api/content/:id - Delete content item (Admin required)
router.delete('/:id', requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const existing = await prisma.contentItem.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, error: 'Content item not found' });
      return;
    }

    await prisma.contentItem.delete({ where: { id } });

    res.json({
      success: true,
      message: 'Content deleted successfully',
    });
  } catch (error) {
    console.error('Delete content error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete content item' });
  }
});

export default router;
