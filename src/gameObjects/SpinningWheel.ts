import { Scene } from "phaser";
import Config from "../config/config";
import { addImage, getDisplayScale } from "../GranadaLib/display/PhaserDisplay";

/**
 * Represents a spinning wheel graphical component within a Phaser game.
 * This container includes a semi-transparent background and a spinning wheel image
 * that continuously rotates. It has to be added to the scene directly.
 */
export default class SpinningWheel extends Phaser.GameObjects.Container {
  bg: Phaser.GameObjects.Graphics; // Graphics object for background
  wheel: Phaser.GameObjects.Image; // Image object for the wheel

  /**
   * Constructs a new SpinningWheel object.
   * @param scene The Phaser scene in which this container will be added.
   */
  constructor(scene: Scene) {
    super(scene, 0, 0); // Initialize the parent class with the scene and default position.
    scene.add.existing(this); // Add this container to the scene

    // Create and add a semi-transparent background to cover the entire scene
    this.bg = scene.make.graphics({ fillStyle: { color: 0x000, alpha: 0.7 } });
    this.bg.fillRect(0, 0, scene.renderer.width, scene.renderer.height);
    this.bg.setInteractive(); // Make the background interactive
    this.add(this.bg); // Add background to this container

    // Add the wheel image, centered and scaled
    this.wheel = addImage(
      scene.renderer.width / 2,
      scene.renderer.height / 2,
      Config.images.wheel.key,
      this
    );
    this.wheel.setScale(1.25 * getDisplayScale(scene)); // Scale the wheel based on display scale
    this.wheel.setOrigin(0.5); // Center the origin of the wheel

    // Create a tween for continuous rotation of the wheel
    scene.tweens.add({
      targets: [this.wheel],
      duration: 10000,
      ease: "Linear",
      repeat: -1,
      angle: 360,
    });
  }
}
