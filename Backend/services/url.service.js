import { customAlphabet } from 'nanoid';
import Url from '../models/url.model.js';

const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const nanoid = customAlphabet(alphabet, 6);

/**
 * Validates whether a string is a properly formatted HTTP/HTTPS URL.
 */
export const isValidUrl = (urlString) => {
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (err) {
    return false;
  }
};

/**
 * Checks if a slug is already taken in the database.
 */
export const isSlugAvailable = async (slug) => {
  const existing = await Url.findOne({ slug: slug.toLowerCase() });
  return !existing;
};

/**
 * Business logic to create and save a new shortened URL.
 */
export const createShortUrl = async ({ originalUrl, customSlug, title, userId, baseUrl }) => {
  if (!isValidUrl(originalUrl)) {
    throw new Error('Invalid destination URL format. Make sure it includes http:// or https://');
  }

  let slug = customSlug ? customSlug.toLowerCase().trim() : '';

  if (slug) {
    // Validate custom slug
    if (slug.length < 3) {
      throw new Error('Custom slug must be at least 3 characters long');
    }
    const alphanumericRegex = /^[a-z0-9-]+$/;
    if (!alphanumericRegex.test(slug)) {
      throw new Error('Custom slug can only contain letters, numbers, and hyphens');
    }

    const available = await isSlugAvailable(slug);
    if (!available) {
      throw new Error(`Custom slug "${slug}" is already in use`);
    }
  } else {
    // Generate a unique random slug
    let attempts = 0;
    while (attempts < 5) {
      const generated = nanoid();
      const available = await isSlugAvailable(generated);
      if (available) {
        slug = generated;
        break;
      }
      attempts++;
    }
    if (!slug) {
      throw new Error('Failed to generate a unique URL slug. Please try again.');
    }
  }

  // The /r/ prefix namespaces all redirect URLs away from the React SPA router.
  // Visiting baseUrl/r/abc123 will always hit the Express backend, not the frontend.
  const shortUrl = `${baseUrl}/r/${slug}`;

  const newUrl = new Url({
    originalUrl,
    shortUrl,
    slug,
    title: title || originalUrl.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0],
    userId,
  });

  return await newUrl.save();
};

/**
 * Fetches all URLs owned by a specific user.
 */
export const getUserUrls = async (userId) => {
  return await Url.find({ userId }).sort({ createdAt: -1 });
};

/**
 * Deletes a URL and its associated click statistics.
 */
export const deleteUrl = async (id, userId) => {
  const url = await Url.findOne({ _id: id, userId });
  if (!url) {
    throw new Error('URL not found or unauthorized');
  }
  return await url.deleteOne();
};
