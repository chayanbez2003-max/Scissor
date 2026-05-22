import express from 'express';
import { getUrlStats, getDashboardSummary } from '../controllers/analytics.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protectRoute);

router.get('/summary', getDashboardSummary);
router.get('/:urlId', getUrlStats);

export default router;
