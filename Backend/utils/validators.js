import { body } from 'express-validator';

export const urlValidator = [
  body('originalUrl')
    .notEmpty()
    .withMessage('Destination URL is required')
    .isURL({ require_tld: true, require_protocol: true })
    .withMessage('Please provide a valid URL including http:// or https://'),
  body('customSlug')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 3 })
    .withMessage('Custom slug must be at least 3 characters long')
    .matches(/^[a-zA-Z0-9-]+$/)
    .withMessage('Custom slug must only contain letters, numbers, and hyphens'),
  body('title')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
];
