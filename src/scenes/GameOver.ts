import { Scene } from "phaser";
import Config from "../config/config";

export class GameOver extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  gameover_text: Phaser.GameObjects.Text;

  constructor() {
    super("GameOver");
  }

  create() {
    this.camera = this.cameras.main;

    this.gameover_text = this.add.text(50, 50, "Game Over", {
      fontFamily: Config.fonts.Poppins,
      fontSize: 64,
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 8,
      align: "center",
    });
    this.gameover_text.setOrigin(0.5);
  }
}
