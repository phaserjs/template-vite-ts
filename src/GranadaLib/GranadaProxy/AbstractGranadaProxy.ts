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

export abstract class AbstractGranadaProxy {
  protected hasConnectedToAPI: boolean = false;
  protected apiCheckTime: number = 100;
  protected timeoutHandle: number | null = null;

  abstract connectToAPI(): Promise<void>;
  abstract getScreenSize(): { width: number; height: number };
}
