import { Scene } from "phaser";
import { endMessage, updateEndMessage } from "./helpers";

export class GameOver extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;

  constructor() {
    super("GameOver");
  }

  create() {
    const emailNoti = this.sound.add("emailNoti")
    emailNoti.play()
    updateEndMessage();
    this.background = this.add.image(350, 250, "GameOver");
    this.background.setScale(0.7);

    const gameover_text = this.add.text(250, 170, "Time to log off", {
      fontSize: 20,
      color: "#7fafb0",

      align: "center",
    });

    const endText = this.add.text(250, 210, endMessage, {
      fontSize: 14,
      color: "#7fafb0",
    });

    // Restart Buttons
    const restart = this.add.zone(185, 370, 70, 20);
    restart.setInteractive({ useHandCursor: true });
    restart.on("pointerup", () => {
      location.reload();
    });

    const restart2 = this.add.zone(540, 125, 25, 20);
    restart2.setInteractive({ useHandCursor: true });
    restart2.on("pointerup", () => {
      location.reload();
    });


    // Credits button
    const creditsButton = this.add.image(495, 365, "creditsButton");
    creditsButton.setInteractive();
    creditsButton.on("pointerup", () => {
      this.scene.stop("Desktop");
      this.scene.stop("GoogleMeet");
      this.scene.stop("PlantLady");
      this.scene.stop("Office");
      this.scene.launch("Credits");
    });
  }
}
