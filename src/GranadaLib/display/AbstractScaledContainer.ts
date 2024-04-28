import { Scene } from "phaser";
import { getDisplayScale } from "./PhaserDisplay";
import Config from "../../config/working-config";

export default class AbstractScaledContainer extends Phaser.GameObjects
  .Container {
  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y);

    this.setScale(1 * getDisplayScale(scene));
    this.x += (scene.game.canvas.width - Config.size.x * this.scale) / 2;
    this.y += (scene.game.canvas.height - Config.size.y * this.scale) / 2;
  }
}
