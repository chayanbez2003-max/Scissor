import Url from '../models/url.model.js';
import { recordClick } from '../services/analytics.service.js';

/**
 * Core resolver for shortlink redirection.
 * Looks up active slug, registers click asynchronously, and performs 302 redirect.
 */
export const handleRedirect = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const url = await Url.findOne({ slug: slug.toLowerCase(), isActive: true });

    if (!url) {
      // Send dynamic styled HTML 404 redirect-failed page or redirect to frontend 404
      return res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Link Not Found - Scissor</title>
          <style>
            body { background: #0B0F19; color: #F3F4F6; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
            .card { background: rgba(17, 24, 39, 0.7); backdrop-filter: blur(10px); padding: 40px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.08); text-align: center; max-width: 400px; }
            h1 { color: #EF4444; margin-top: 0; }
            a { color: #8B5CF6; text-decoration: none; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>Link Not Found</h1>
            <p>The link you are trying to access does not exist or has expired.</p>
            <p><a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}">Create your own short links at Scissor</a></p>
          </div>
        </body>
        </html>
      `);
    }

    // Check expiration
    if (url.expiresAt && new Date() > url.expiresAt) {
      return res.status(410).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Link Expired - Scissor</title>
          <style>
            body { background: #0B0F19; color: #F3F4F6; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
            .card { background: rgba(17, 24, 39, 0.7); backdrop-filter: blur(10px); padding: 40px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.08); text-align: center; max-width: 400px; }
            h1 { color: #F59E0B; margin-top: 0; }
            a { color: #8B5CF6; text-decoration: none; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>Link Expired</h1>
            <p>This shortened link has expired and is no longer active.</p>
            <p><a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}">Go to Scissor</a></p>
          </div>
        </body>
        </html>
      `);
    }

    // Record click asynchronously (do not await to speed up redirect)
    recordClick(url, req);

    // Redirect to original destination
    return res.redirect(302, url.originalUrl);
  } catch (error) {
    next(error);
  }
};
