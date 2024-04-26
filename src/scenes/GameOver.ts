import { Scene } from "phaser";
import Config from "../config/config";

export class GameOver extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  gameover_text: Phaser.GameObjects.Text;
  cta_text: Phaser.GameObjects.Text;

  constructor() {
    super("GameOver");
  }

  create() {
    this.camera = this.cameras.main;

    this.createConfetti();

    this.gameover_text = this.add.text(
      Config.size.x / 2,
      250,
      "Word Complete!",
      {
        fontFamily: Config.fonts.Poppins,
        fontSize: 32,
        color: "#000",
        align: "center",
      }
    );
    this.gameover_text.setOrigin(0.5);

    this.cta_text = this.add.text(Config.size.x / 2, 350, "Download Qwordly!", {
      fontFamily: Config.fonts.Poppins,
      fontSize: 24,
      color: "#000",
      align: "center",
    });
    this.cta_text.setOrigin(0.5);
  }

  createConfetti() {
    const particles = this.add.particles(0, 0, "confetti", {
      x: { min: 0, max: Config.size.x }, // Confetti starting x range
      y: -20, // Confetti starting y position
      lifespan: 4000, // Duration of life
      speed: { min: 40, max: 80 }, // Speed range
      angle: { min: 0, max: 360 }, // Direction range of particles
      rotate: { min: 0, max: 360 }, // Rotation range of particles
      gravityY: 20, // Gravity effect on particles
      quantity: 10, // Number of particles emitted per burst
      frequency: 100, // Low frequency for continuous effect
      blendMode: "ADD", // Blend mode for visual effect
      alpha: { start: 1, end: 0 }, // Alpha range for particles
      tint: {
        // Apply random tint to each particle
        onEmit: function (particle) {
          //particle!.tint = Phaser.Display.Color.RandomRGB().color;
          return Phaser.Display.Color.RandomRGB().color; // This will choose a random color
        },
      },
    });

    particles.start();
  }
}
