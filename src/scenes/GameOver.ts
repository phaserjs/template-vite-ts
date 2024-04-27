import { Scene } from "phaser";
import Config from "../config/config";
import { createConfetti } from "../GranadaLib/Display/createConfetti";
import {
  addText,
  createSceneContainer,
} from "../GranadaLib/Display/PhaserDisplay";
import { IS_DEV_MODE } from "../GranadaExporters/getIsDevMode";

export class GameOver extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  gameover_text: Phaser.GameObjects.Text;
  cta_text: Phaser.GameObjects.Text;
  container: Phaser.GameObjects.Container;

  constructor() {
    super("GameOver");
  }

  create() {
    this.camera = this.cameras.main;
    this.container = createSceneContainer(this);

    this.gameover_text = addText(
      Config.size.x / 2,
      250,
      Config.fonts.Poppins,
      24,
      this.container,
      "0x000",
      "Word Complete!"
    );

    this.gameover_text.setOrigin(0.5);

    this.cta_text = addText(
      Config.size.x / 2,
      350,
      Config.fonts.Poppins,
      24,
      this.container,
      "0x000",
      "Download Qwordly!"
    );

    this.cta_text.setOrigin(0.5);
    this.cta_text.setInteractive();
    this.cta_text.on("pointerdown", () => {
      if (IS_DEV_MODE) {
        this.sound.stopAll();
        mraid.open("https://www.granadagames.co/");
      } else {
        window.open("https://www.granadagames.co/");
      }
    });

    const confetti = createConfetti(this);
    this.container.add(confetti);
  }
}
