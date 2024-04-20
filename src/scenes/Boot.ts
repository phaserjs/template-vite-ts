import { Scene } from "phaser";
import { CONFIG, IS_DEV_MODE, PAGES } from "../Utils/Constants";
import { getScreenSize } from "granadalib/dist/ScreenUtils";

export class Boot extends Scene {
  hasConnectedToAPI: boolean;
  apiCheckTime: number = 100;

  constructor() {
    super(PAGES.Boot);
  }

  preload = () => {
    //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
    //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.

    // connect to the API.
    this.hasConnectedToAPI = false;

    this.load.image("background", "assets/bg.png");
  };

  create = () => {
    console.log("checking connection to mraid...");
    setTimeout(this.checkAPIConnection, this.apiCheckTime);
  };

  startGame = () => {
    console.log("Starting Game...");
    this.hasConnectedToAPI = true;

    //resize the game to meet the API standards
    const { width, height } = getScreenSize();
    this.game.scale.setParentSize(width, height);
    this.game.scale.setGameSize(CONFIG.gameWidth, CONFIG.gameHeight);
    this.game.scale.scaleMode = Phaser.Scale.RESIZE;

    this.scene.start(PAGES.Game);
  };

  checkAPIConnection = () => {
    if (IS_DEV_MODE || (typeof mraid !== "undefined" && mraid.isViewable())) {
      this.hasConnectedToAPI = true;
      this.startGame();
      console.log("connected");
    } else {
      setTimeout(this.checkAPIConnection, this.apiCheckTime);
    }
  };
}
