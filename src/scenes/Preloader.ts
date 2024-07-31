import { Scene } from "phaser";

export class Preloader extends Scene {
  constructor() {
    super("Preloader");
  }

  init() {
    //  We loaded this image in our Boot Scene, so we can display it here
    this.add.image(512, 384, "backgrounds/office.png");

    //  A simple progress bar. This is the outline of the bar.
    this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

    //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
    const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

    //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
    this.load.on("progress", (progress: number) => {
      //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
      bar.width = 4 + 460 * progress;
    });
  }

  preload() {
    //  Load the assets for the game - Replace with your own assets
    this.load.setPath("assets");

    // Office Backgrounds
    this.load.image("sky", "backgrounds/sky.png");
    this.load.image("office", "backgrounds/office.png");

    // Office Sprites
    this.load.image("chair", "chair.png");
    this.load.image("laptop", "laptop.png");
    this.load.image("rug", "rug.png");
    this.load.image("mug", "mug.png");
    this.load.image("desk", "desk.png");
    this.load.image("books", "books.png");
    this.load.image("pots", "pots.png");
    this.load.image("trash", "trash.png");
    this.load.image("pictures", "pictures.png");
    this.load.image("diffen1", "diffen1.png");
    this.load.image("diffen2", "diffen2.png");
    this.load.image("diffen3", "diffen3.png");
    this.load.image("diffen4", "diffen4.png");
    this.load.image("aloe1", "aloe1.png");
    this.load.image("aloe2", "aloe2.png");
    this.load.image("aloe3", "aloe3.png");
    this.load.image("aloe4", "aloe4.png");
    this.load.image("poth1", "poth1.png");
    this.load.image("poth2", "poth2.png");
    this.load.image("poth3", "poth3.png");
    this.load.image("poth4", "poth4.png");
    this.load.image("logo", "logo.png");

    // Laptop Overlays
    this.load.image("laptop", "backgrounds/laptop.png");

    // Laptop Sprites
    this.load.image("big-fist", "sprites/big-fist.png");
    this.load.image("small-fist", "sprites/small-fist.png");
    this.load.image("fly", "sprites/fly.png");
    this.load.image("slack-box", "sprites/slack-box.png");
    this.load.image("textbox", "sprites/textbox.png");

    // Plant Game Sprites
    this.load.image("textbox2", "textbox.png");
    this.load.image("bigDiffen1", "plants/diffen1.png");
    this.load.image("bigDiffen2", "plants/diffen2.png");
    this.load.image("bigDiffen3", "plants/diffen3.png");
    this.load.image("bigDiffen4", "plants/diffen4.png");
    this.load.image("bigAloe1", "plants/aloe1.png");
    this.load.image("bigAloe2", "plants/aloe2.png");
    this.load.image("bigAloe3", "plants/aloe3.png");
    this.load.image("bigAloe4", "plants/aloe4.png");
    this.load.image("bigPoth1", "plants/poth1.png");
    this.load.image("bigPoth2", "plants/poth2.png");
    this.load.image("bigPoth3", "plants/poth3.png");
    this.load.image("bigPoth4", "plants/poth4.png");

    // Plant Game Overlays
    this.load.image("plantGame", "backgrounds/plantGame.png");

  }

  create() {
    //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
    //  For example, you can define global animations here, so we can use them in other scenes.

    //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
    this.scene.start("Office");
  }
}