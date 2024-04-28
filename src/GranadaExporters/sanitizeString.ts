/**
 * Sanitizes a string by removing special characters, keeping alphanumeric, space, and basic punctuation.
 * @param text The text to sanitize.
 * @returns The sanitized text.
 */
export default function sanitizeString(text: string): string {
  return text.replace(/[^a-zA-Z0-9 ,.!?;:{}@()'"\/\[\]-]/g, "");
}
