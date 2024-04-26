import { Scene } from "phaser";
import Config from "../config/config";

export default class SpinningWheel extends Phaser.GameObjects.Image {
  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, Config.images.wheel.key);
    scene.add.existing(this);

    this.setScale(1.2);

    scene.tweens.add({
      targets: [this],
      duration: 10000,
      ease: "Linear",
      repeat: -1,
      angle: 360,
    });
  }
}
