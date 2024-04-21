import { helloWorld } from "granadalib/dist/GranadaProxy/GranadaProxy";
import { Scene } from "phaser";
import Config from "../config/config";
import { images } from "../config/assets";
import { addImage } from "../Utils/PhaserDisplay";

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;

  topBar: Phaser.GameObjects.Image;
  question: Phaser.GameObjects.Image;
  submit: Phaser.GameObjects.Image;

  msg_text: Phaser.GameObjects.Text;

  constructor() {
    super("Game");
  }

  create() {
    this.camera = this.cameras.main;

    helloWorld("hey....Json");

    // this.msg_text = this.add.text(
    //   20,
    //   20,
    //   "Make something fun!\nand share it with us:\nsupport@phaser.io",
    //   {
    //     fontFamily: Config.fonts.PoetsenOne,
    //     fontSize: 38,
    //     color: "#ffffff",
    //     stroke: "#000000",
    //     strokeThickness: 8,
    //     align: "center",
    //   }
    // );
    // this.msg_text.setOrigin(0.5);

    this.topBar = addImage(0, 30, images.topBar.key, this, Config, true);
    this.question = addImage(0, 100, images.questions.key, this, Config, true);
    this.submit = addImage(
      0,
      Config.size.y - 80,
      images.submit.key,
      this,
      Config,
      true
    );

    this.input.once("pointerdown", () => {
      this.scene.start(Config.pages.GameOver);
    });
  }
}
