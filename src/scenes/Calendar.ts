import Phaser from "phaser";
import { animateText, height, width } from "./helpers";

interface KeyType {
    space: any;
    up: any;
    down: any;
    right: any;
    left: any;
  };
// const phrases = ["SQUASHED!!", "SPLATTED!!", "DESTROYED!!", "Kiiiiiiilled", "Die tree killer!!", "EAT FIST", "GET MUSHED"]
export default class Calendar extends Phaser.Scene {
keys: KeyType;
space: any;

constructor() {
    super("Calendar");
    this.keys = {
        space: null,
        up: null,
        down: null,
        right: null,
        left: null
    }
}

  create() {

    //background
    this.add.image(350, 250, "bg-laptop");


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
    this.space = this.add.rectangle(width/2, height/2, 20, 20, 0)


  }
  update(): void {
    if (this.keys.up.isDown){
        this.space?.setFillStyle(0xff0000)
    }else {
      this.space?.setFillStyle(0)
    }
  }
}
