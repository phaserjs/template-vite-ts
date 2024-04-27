import { Scene } from "phaser";
import Config from "../config/config";
import { loadAllImages } from "../GranadaLib/display/PhaserDisplay";
import { AudioFiles } from "../Audio";

/**
 * The Boot scene is responsible for setting up the initial assets and
 * configurations needed for the game to run. It also handles the initial API
 * connection checks before starting the main game.
 */
export class Boot extends Scene {
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
  preload = async () => {};

  /**
   * Creates necessary game objects and setups after assets are loaded. This method also initiates the API connection check.
   */
  create = async () => {
    console.log("checking connection to mraid...");
    loadAllImages(this, Config.images);
    console.log("Preloading Audio assets...");
    (this.sound as Phaser.Sound.WebAudioSoundManager).decodeAudio(
      AudioFiles.name,
      AudioFiles.path
    );

    this.sound.once("decodedall", () => this.startGame());
  };

  /**
   * Starts the main game by setting the screen size and transitioning to the game scene.
   */
  startGame = () => {
    console.log("Starting Game...");
    this.scene.start(Config.pages.Game);
  };
}
