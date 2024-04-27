import { Scene } from "phaser";
import Config from "../../config/config";
import SpinningWheel from "../../GranadaLib/GameObjects/SpinningWheel";
import { addText } from "../../GranadaLib/Display/PhaserDisplay";
import Button from "../../GranadaLib/GameObjects/GranadaButton";
import AbstractScaledContainer from "../../GranadaLib/Display/AbstractScaledContainer";

export default class WelcomeModal extends AbstractScaledContainer {
  private panelBg: Phaser.GameObjects.Image;
  private wheel: SpinningWheel;
  private heading: Phaser.GameObjects.Text;
  private btnPlay: Button;
  private onClose: () => void;

  constructor(scene: Scene, x: number, y: number, onClose: () => void) {
    super(scene, x, y);

    this.onClose = onClose;

    this.wheel = new SpinningWheel(scene, Config.images.wheel.key, 0x000, 0.5);
    scene.add.existing(this.wheel);

    this.panelBg = scene.make.image({
      x: Config.size.x / 2,
      y: Config.size.y / 2,
      key: Config.images.welcomeSplash.key,
    });
    this.panelBg.setOrigin(0.5);
    this.add(this.panelBg);

    this.heading = addText(
      Config.size.x / 2,
      300,
      Config.fonts.PoetsenOne,
      24,
      this,
      "#000",
      "WELCOME TO!"
    );
    this.heading.setOrigin(0.5, 0);

    this.btnPlay = new Button(scene, 105, 520, "Play", () => this.handlePlay());
    this.add(this.btnPlay);
  }

  public handlePlay() {
    this.btnPlay.disableInteractive();

    this.scene.tweens.add({
      targets: [this.wheel],
      duration: 1000,
      ease: Phaser.Math.Easing.Cubic.Out,
      repeat: 0,
      alpha: 0,
      onComplete: () => {
        this.wheel.destroy(true);
      },
    });

    this.scene.tweens.add({
      targets: [this],
      duration: 1000,
      ease: Phaser.Math.Easing.Cubic.Out,
      repeat: 0,
      alpha: 0,
      onComplete: () => {
        this.onClose();
      },
    });
  }
}
