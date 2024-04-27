import { Scene } from "phaser";
import { addImage, getDisplayScale } from "../Display/PhaserDisplay";

/**
 * Represents a spinning wheel graphical component within a Phaser game.
 * This class extends Phaser.GameObjects.Container, encapsulating both a semi-transparent background
 * and a continuously rotating wheel image. The container needs to be manually added to the Phaser scene.
 */
export default class SpinningWheel extends Phaser.GameObjects.Container {
  bg: Phaser.GameObjects.Graphics; // Graphics object for background
  wheel: Phaser.GameObjects.Image; // Image object for the wheel

  /**
   * Constructs a new SpinningWheel object within a given Phaser scene.
   *
   * @param scene The Phaser scene in which this container will be added.
   * @param wheelImageKey The asset key for the wheel image to be loaded and displayed.
   * @param bgColor The color of the background graphics object. Default is black (0x000).
   * @param bgAlpha The opacity of the background, ranging from 0 (fully transparent) to 1 (fully opaque). Default is 0.7.
   */
  constructor(
    scene: Scene,
    wheelImageKey: string,
    bgColor: number = 0x000,
    bgAlpha: number = 0.7
  ) {
    super(scene, 0, 0); // Initialize the parent class with the scene and default position.
    scene.add.existing(this); // Add this container to the scene.

    // Create and add a semi-transparent background to cover the entire scene dimensions.
    this.bg = scene.make.graphics({
      fillStyle: { color: bgColor, alpha: bgAlpha },
    });
    this.bg.fillRect(0, 0, scene.renderer.width, scene.renderer.height);
    this.bg.setInteractive(); // Make the background interactive to handle input events.
    this.add(this.bg); // Add the background graphics to this container.

    // Add the wheel image, center it within the scene, and scale it according to the display size.
    this.wheel = addImage(
      scene.renderer.width / 2,
      scene.renderer.height / 2,
      wheelImageKey,
      this
    );
    this.wheel.setScale(1.25 * getDisplayScale(scene)); // Scale the wheel based on the calculated display scale factor.
    this.wheel.setOrigin(0.5); // Set the origin of the wheel to its center for proper rotation.

    // Add a tween to continuously rotate the wheel.
    scene.tweens.add({
      targets: [this.wheel],
      duration: 10000, // Duration of one full rotation cycle in milliseconds.
      ease: "Linear", // Linear easing for constant rotation speed.
      repeat: -1, // Repeat indefinitely.
      angle: 360, // Rotate by 360 degrees.
    });
  }
}
