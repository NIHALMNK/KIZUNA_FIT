import { z } from 'zod';

/**
 * Reusable preprocessor for HTML date inputs (e.g., 'YYYY-MM-DD', ISO string, or Date).
 * Converts empty strings (""), null, or whitespace to undefined.
 * Converts 'YYYY-MM-DD' HTML form inputs to a full ISO 8601 string ('YYYY-MM-DDTHH:mm:ss.sssZ').
 */
export const dateFromHtmlInput = (fieldName = 'Date') =>
  z.preprocess((val) => {
    if (val === '' || val === null || val === undefined) return undefined;
    if (typeof val === 'string') {
      const trimmed = val.trim();
      if (!trimmed) return undefined;
      if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
        return new Date(`${trimmed}T00:00:00.000Z`).toISOString();
      }
      const date = new Date(trimmed);
      if (!isNaN(date.getTime())) {
        return date.toISOString();
      }
    }
    return val;
  }, z.string().datetime({ message: `${fieldName} must be a valid date` }));

export const optionalDateFromHtmlInput = (fieldName = 'Date') =>
  z.preprocess((val) => {
    if (val === '' || val === null || val === undefined) return undefined;
    if (typeof val === 'string') {
      const trimmed = val.trim();
      if (!trimmed) return undefined;
      if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
        return new Date(`${trimmed}T00:00:00.000Z`).toISOString();
      }
      const date = new Date(trimmed);
      if (!isNaN(date.getTime())) {
        return date.toISOString();
      }
    }
    return val;
  }, z.string().datetime({ message: `${fieldName} must be a valid date` }).optional());

/**
 * Reusable preprocessor for optional URLs from HTML forms (converts "" to undefined before z.string().url())
 */
export const optionalUrlFromHtmlInput = () =>
  z.preprocess((val) => {
    if (val === '' || val === null || val === undefined) return undefined;
    if (typeof val === 'string' && !val.trim()) return undefined;
    return val;
  }, z.string().url({ message: 'Invalid URL' }).optional());

/**
 * Reusable preprocessor for optional string fields from HTML forms (converts "" to undefined)
 */
export const optionalString = () =>
  z.preprocess((val) => {
    if (val === '' || val === null || val === undefined) return undefined;
    if (typeof val === 'string' && !val.trim()) return undefined;
    return val;
  }, z.string().optional());
