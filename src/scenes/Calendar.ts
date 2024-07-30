import Phaser from "phaser";
import { animateText } from "./helpers";
// const phrases = ["SQUASHED!!", "SPLATTED!!", "DESTROYED!!", "Kiiiiiiilled", "Die tree killer!!", "EAT FIST", "GET MUSHED"]
export default class Calendar extends Phaser.Scene {
keys: {
  space: any;
  up: any;
  down: any;
  right: any;
  left: any;
}
constructor() {
    super("Laptop");
}

  create() {

    //background
    this.add.image(350, 250, "laptop");


    // key objects
    this.keys.space = this.input?.keyboard?.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    this.keys.up = this.input?.keyboard?.addKey(
      Phaser.Input.Keyboard.KeyCodes.UP
    );
    this.keys.down = this.input?.keyboard?.addKey(
      Phaser.Input.Keyboard.KeyCodes.DOWN
    );
    this.keys.left = this.input?.keyboard?.addKey(
      Phaser.Input.Keyboard.KeyCodes.LEFT
    );
    this.keys.right = this.input?.keyboard?.addKey(
      Phaser.Input.Keyboard.KeyCodes.RIGHT
    );

  }
  update(): void {
  }
}
