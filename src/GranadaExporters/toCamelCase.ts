/**
 * Converts a string to camelCase.
 * @param text The string to convert.
 * @returns The camelCase version of the string.
 */
export default function toCamelCase(text: string): string {
  return text
    .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase()) // Capitalize first letter after non-alphanumeric
    .replace(/^[A-Z]/, (first) => first.toLowerCase()); // Ensure the first letter is lowercase
}
