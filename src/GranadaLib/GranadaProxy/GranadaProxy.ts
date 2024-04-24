/**
 * Generates a greeting message for a specified name.
 *
 * This function constructs a greeting string, logs it to the console, and then returns it.
 * It is useful for basic demonstrations of function structure and string manipulation.
 *
 * @param {string} name - The name to be included in the greeting message.
 * @returns {string} The greeting message.
 */
export const helloWorld = (name: string): string => {
  const res = `Hello, ${name}!`;
  console.log(res);
  return res;
};

/**
 * Checks if the MRAID (Mobile Rich Media Ad Interface Definitions) API is loaded and viewable.
 *
 * This function is typically used in mobile advertising to ensure that the MRAID API is ready
 * and the ad content is viewable. It provides a boolean that indicates whether the MRAID API
 * is available and the ad is viewable at the time of the call.
 *
 * @returns {boolean} True if MRAID is loaded and viewable, false otherwise.
 */
export const isMraidLoaded = (): boolean => {
  return typeof mraid !== "undefined" && mraid.isViewable();
};
