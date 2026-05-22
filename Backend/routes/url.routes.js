import express from 'express';
import { getUrls, shortenUrl, deleteUrl } from '../controllers/url.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import { urlValidator } from '../utils/validators.js';
import { shortenLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Apply auth protection middleware globally to all URL routes
router.use(protectRoute);

router.post('/shorten', shortenLimiter, urlValidator, shortenUrl);
router.get('/', getUrls);
router.delete('/:id', deleteUrl);

export default router;
