import { Scene } from "phaser";
import { IS_DEV_MODE } from "../Utils/Constants";
import { getScreenSize } from "granadalib/dist/ScreenUtils";
import Config from "../config/config";
import { loadAllImages } from "../Utils/PhaserDisplay";

/**
 * The Boot scene is responsible for setting up the initial assets and
 * configurations needed for the game to run. It also handles the initial API
 * connection checks before starting the main game.
 */
export class Boot extends Scene {
  hasConnectedToAPI: boolean;
  apiCheckTime: number = 100;
  timeoutHandle: number | null = null;

  /**
   * Constructs the Boot scene object.
   */
  constructor() {
    super(Config.pages.Boot);
  }

  /**
   * Preloads necessary assets for the boot process. This method is called automatically by Phaser.
   * It's typically used to load minimal assets required for the preloader, like a game logo or background.
   */
  preload = () => {
    this.hasConnectedToAPI = false;
  };

  /**
   * Creates necessary game objects and setups after assets are loaded. This method also initiates the API connection check.
   */
  create = () => {
    console.log("checking connection to mraid...");
    this.scheduleAPIConnectionCheck();

    if (IS_DEV_MODE) {
      loadAllImages(this, Config.images);
    } else {
      this.game.textures.addBase64("topBar", topBar);
      this.game.textures.addBase64("questions", questions);
      this.game.textures.addBase64("submit", submit);
    }
  };

  /**
   * Starts the main game by setting the screen size and transitioning to the game scene.
   */
  startGame = () => {
    console.log("Starting Game...");
    this.hasConnectedToAPI = true;

    const { width, height } = getScreenSize();
    this.game.scale.setParentSize(width, height);
    this.game.scale.resize(width, height);
    this.game.scale.scaleMode = Phaser.Scale.NONE;
    this.game.scale.refresh();

    this.scene.start(Config.pages.Game);
  };

  /**
   * Checks if the API is viewable and the app is ready to start. If not, it schedules another check.
   */
  checkAPIConnection = () => {
    if (IS_DEV_MODE || (typeof mraid !== "undefined" && mraid.isViewable())) {
      this.hasConnectedToAPI = true;
      this.startGame();
      console.log("connected");
    } else {
      this.scheduleAPIConnectionCheck();
    }
  };

  /**
   * Schedules the next API connection check.
   */
  scheduleAPIConnectionCheck = () => {
    if (this.timeoutHandle) {
      clearTimeout(this.timeoutHandle);
    }
    this.timeoutHandle = setTimeout(this.checkAPIConnection, this.apiCheckTime);
  };
}
