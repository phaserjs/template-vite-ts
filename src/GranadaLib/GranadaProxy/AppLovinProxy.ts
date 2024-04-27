import { IS_DEV_MODE } from "../../GranadaExporters/getIsDevMode";
import { AbstractGranadaProxy, ScreenSize } from "./AbstractGranadaProxy";

/**
 * Class representing a proxy to the AppLovin API. Extends the AbstractGranadaProxy class.
 * This class manages connections to the AppLovin API with a periodic check until a connection is established
 * or a maximum number of attempts is reached.
 */
export class AppLovinProxy extends AbstractGranadaProxy {
  /** Time interval (in milliseconds) for checking the API connection. */
  protected apiCheckTime: number = 100;

  /** Interval handle for the periodic API connection check. */
  protected intervalHandle: number;

  /** Maximum number of attempts to connect to the API before giving up. */
  protected maxConnectionAttempts: number = 50;

  /** Current number of attempts made to connect to the API. */
  protected connectionAttempts: number = 0;

  /**
   * Asynchronously connects to the AppLovin API using an interval to check connection status.
   * This method uses async/await syntax to manage the asynchronous logic in a more linear and readable way.
   * @returns A promise that resolves with no value when the connection is successful or rejects with an error message.
   */
  async connectToAPI(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.connectionAttempts = 0;
      this.intervalHandle = setInterval(() => {
        this.checkAPIConnection()
          .then(resolve)
          .catch((error) => {
            if (this.connectionAttempts >= this.maxConnectionAttempts) {
              clearInterval(this.intervalHandle!);
              reject(error);
            }
          });
      }, this.apiCheckTime);
    });
  }

  /**
   * Checks the current state of the API connection. Resolves if the API is viewable or development mode is enabled.
   * Rejects with an error if the API cannot be connected after the maximum number of attempts.
   */
  private async checkAPIConnection(): Promise<void> {
    this.connectionAttempts++;
    if (IS_DEV_MODE || (typeof mraid !== "undefined" && mraid.isViewable())) {
      clearInterval(this.intervalHandle!);
      return Promise.resolve();
    } else if (this.connectionAttempts >= this.maxConnectionAttempts) {
      return Promise.reject("Failed to connect to API after maximum attempts");
    }
  }

  public getScreenSize = (): ScreenSize => {
    if (typeof mraid !== "undefined") {
      // When MRAID is available, use its API to get the screen size.
      const res: ScreenSize = {
        width: mraid.getScreenSize().width,
        height: mraid.getScreenSize().height,
      };
      return res;
    }

    // Default to using the window's inner dimensions.
    const res: ScreenSize = {
      width:
        window.innerWidth < window.innerHeight
          ? window.innerWidth
          : window.innerHeight,
      height:
        window.innerHeight > window.innerWidth
          ? window.innerHeight
          : window.innerWidth,
    };
    return res;
  };
}
