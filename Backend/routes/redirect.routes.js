import express from 'express';
import { handleRedirect } from '../controllers/redirect.controller.js';

const router = express.Router();

// Namespaced redirect endpoint — /r/:slug avoids React Router catch-all conflicts.
// All shortened URLs are generated with this prefix so the backend always handles them.
router.get('/r/:slug', handleRedirect);

export default router;
