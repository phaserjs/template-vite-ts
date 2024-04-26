/**
 * Defines the dimensions of a screen.
 * @typedef {Object} ScreenSize
 * @property {number} width - The width of the screen in pixels.
 * @property {number} height - The height of the screen in pixels.
 */
export type ScreenSize = {
  width: number;
  height: number;
};

/**
 * Retrieves the current screen size.
 * This function checks if the `mraid` object is available to use for mobile advertising.
 * If `mraid` is available, it uses its `getScreenSize` method. Otherwise, it defaults to the
 * browser's `window.innerWidth` and `window.innerHeight`.
 *
 * @returns {ScreenSize} An object containing the width and height of the screen.
 */
export const getScreenSize = (): ScreenSize => {
  if (typeof mraid !== "undefined") {
    // When MRAID is available, use its API to get the screen size.
    const res: ScreenSize = {
      width: mraid.getScreenSize().width * 2,
      height: mraid.getScreenSize().height * 2,
    };
    return res;
  }

  // Default to using the window's inner dimensions.
  const res: ScreenSize = {
    width: window.innerWidth * 2,
    height: window.innerHeight * 2,
  };
  return res;
};
