import { Router, Request, Response } from 'express';
import { PeopleForceService } from '../services/peopleforce.service';

const router = Router();

/**
 * GET /api/public/careers/vacancies
 * Publicly retrieves active job vacancies with multi-facet filters
 */
router.get('/vacancies', async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, country, department, employmentType } = req.query;

    const vacancies = await PeopleForceService.getVacancies({
      search: typeof search === 'string' ? search : undefined,
      country: typeof country === 'string' ? country : undefined,
      department: typeof department === 'string' ? department : undefined,
      employmentType: typeof employmentType === 'string' ? employmentType : undefined,
    });

    res.json({
      success: true,
      data: vacancies,
      count: vacancies.length,
    });
  } catch (err) {
    console.error('Fetch public vacancies error:', err);
    res.status(500).json({ success: false, error: 'Failed to retrieve job vacancies.' });
  }
});

/**
 * GET /api/public/careers/vacancies/:id
 * Retrieves full details for an individual vacancy
 */
router.get('/vacancies/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const vacancy = await PeopleForceService.getVacancyById(id);

    if (!vacancy) {
      res.status(404).json({ success: false, error: 'Job position not found or no longer active.' });
      return;
    }

    res.json({
      success: true,
      data: vacancy,
    });
  } catch (err) {
    console.error(`Fetch vacancy ${req.params.id} error:`, err);
    res.status(500).json({ success: false, error: 'Failed to retrieve position details.' });
  }
});

/**
 * GET /api/public/careers/metadata
 * Returns available departments, countries, and employment types for dynamic UI filters
 */
router.get('/metadata', async (_req: Request, res: Response): Promise<void> => {
  try {
    const metadata = await PeopleForceService.getMetadata();

    res.json({
      success: true,
      data: metadata,
    });
  } catch (err) {
    console.error('Fetch careers metadata error:', err);
    res.status(500).json({ success: false, error: 'Failed to retrieve careers metadata.' });
  }
});

export default router;
