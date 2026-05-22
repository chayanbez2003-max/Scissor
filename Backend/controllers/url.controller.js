import { validationResult } from 'express-validator';
import * as urlService from '../services/url.service.js';

/**
 * Handles creation of a short link.
 */
export const shortenUrl = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { originalUrl, customSlug, title } = req.body;
    const userId = req.auth.userId;

    // Build base redirect URL
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const host = req.headers['x-forwarded-host'] || req.get('host');
    const baseUrl = `${protocol}://${host}`;

    const url = await urlService.createShortUrl({
      originalUrl,
      customSlug,
      title,
      userId,
      baseUrl,
    });

    return res.status(201).json({
      success: true,
      message: 'URL shortened successfully',
      data: url,
    });
  } catch (error) {
    if (
      error.message.includes('Invalid destination URL') ||
      error.message.includes('slug')
    ) {
      return res.status(400).json({ success: false, error: error.message });
    }
    next(error);
  }
};

/**
 * Retrieves all links owned by the user.
 */
export const getUrls = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const urls = await urlService.getUserUrls(userId);

    return res.status(200).json({
      success: true,
      count: urls.length,
      data: urls,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Deletes a link.
 */
export const deleteUrl = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.auth.userId;

    await urlService.deleteUrl(id, userId);

    return res.status(200).json({
      success: true,
      message: 'URL deleted successfully',
    });
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({ success: false, error: error.message });
    }
    next(error);
  }
};
