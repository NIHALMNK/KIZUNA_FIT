import { describe, it, expect } from 'vitest';
import {
  dateFromHtmlInput,
  optionalDateFromHtmlInput,
  optionalUrlFromHtmlInput,
  optionalString,
} from '../../../src/shared/infrastructure/http/validation/dateValidators';

describe('dateValidators & Form Preprocessors Unit Tests', () => {
  describe('dateFromHtmlInput', () => {
    it('should convert YYYY-MM-DD HTML date input to ISO 8601 string', () => {
      const schema = dateFromHtmlInput('Issued date');
      const result = schema.parse('2026-07-27');
      expect(result).toBe('2026-07-27T00:00:00.000Z');
    });

    it('should preserve valid full ISO 8601 datetime string', () => {
      const schema = dateFromHtmlInput('Issued date');
      const isoStr = '2026-07-27T14:30:00.000Z';
      const result = schema.parse(isoStr);
      expect(result).toBe(isoStr);
    });

    it('should fail required validation when empty string is passed', () => {
      const schema = dateFromHtmlInput('Issued date');
      expect(() => schema.parse('')).toThrow();
    });
  });

  describe('optionalDateFromHtmlInput', () => {
    it('should convert empty string "" to undefined', () => {
      const schema = optionalDateFromHtmlInput('Expiration date');
      const result = schema.parse('');
      expect(result).toBeUndefined();
    });

    it('should convert YYYY-MM-DD to ISO 8601 string when provided', () => {
      const schema = optionalDateFromHtmlInput('Expiration date');
      const result = schema.parse('2028-12-31');
      expect(result).toBe('2028-12-31T00:00:00.000Z');
    });
  });

  describe('optionalUrlFromHtmlInput', () => {
    it('should convert empty string "" to undefined', () => {
      const schema = optionalUrlFromHtmlInput();
      const result = schema.parse('');
      expect(result).toBeUndefined();
    });

    it('should validate and return valid URL string', () => {
      const schema = optionalUrlFromHtmlInput();
      const url = 'https://example.com/cert.pdf';
      const result = schema.parse(url);
      expect(result).toBe(url);
    });

    it('should fail on invalid URL string', () => {
      const schema = optionalUrlFromHtmlInput();
      expect(() => schema.parse('invalid-url')).toThrow();
    });
  });

  describe('optionalString', () => {
    it('should convert empty string "" or whitespace to undefined', () => {
      const schema = optionalString();
      expect(schema.parse('')).toBeUndefined();
      expect(schema.parse('   ')).toBeUndefined();
    });

    it('should preserve valid text', () => {
      const schema = optionalString();
      expect(schema.parse('Hello World')).toBe('Hello World');
    });
  });
});
