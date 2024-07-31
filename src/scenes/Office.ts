import { Scene, GameObjects } from "phaser";
import { changeOfficePlants, PlantAction, PlantNames } from "./helpers";

export class Office extends Scene {
  background: GameObjects.Image;

  constructor() {
    super("Office");
  }

  create() {
    const sky = this.add.image(178 * 2, 54 * 2, "sky");
    sky.scale = 0.5;
    this.background = this.add.image(175 * 2, 125 * 2, "office");

    const rug = this.add.image(178 * 2, 235 * 2, "rug");
    const books = this.add.image(119 * 2, 91 * 2, "books");
    const desk = this.add.image(177 * 2, 178 * 2, "desk");
    const chair = this.add.image(211 * 2, 177 * 2, "chair");
    const mug = this.add.image(175 * 2, 125 * 2, "mug");
    const laptop = this.add.image(175 * 2, 125 * 2, "laptop");
    const pots = this.add.image(212 * 2, 189, "pots");
    const pictures = this.add.image(313 * 2, 64 * 2, "pictures");
    const trash = this.add.image(60 * 2, 194 * 2, "trash");
    // Plants 1
    const aloe1 = this.add.image(211 * 2, 84 * 2, "aloe1");
    const diffen1 = this.add.image(186 * 2, 79 * 2, "diffen1");
    diffen1.flipX = true;
    const poth1 = this.add.image(234 * 2, 83 * 2, "poth1");
    // Plants 2
    const aloe2 = this.add.image(211 * 2, 83 * 2, "aloe2");
    const diffen2 = this.add.image(192 * 2, 76 * 2, "diffen2");
    const poth2 = this.add.image(238 * 2, 80 * 2, "poth2");
    // Plants 3
    const aloe3 = this.add.image(212 * 2, 81 * 2, "aloe3");
    const diffen3 = this.add.image(193 * 2, 73 * 2, "diffen3");
    const poth3 = this.add.image(242 * 2, 175, "poth3");
    // Plants 4
    const aloe4 = this.add.image(423, 159, "aloe4");
    const diffen4 = this.add.image(193 * 2, 74 * 2, "diffen4");
    const poth4 = this.add.image(243 * 2, 183, "poth4");

    const plantMap = {
      aloe: {
        current: "2",
        "1": aloe1,
        "2": aloe2,
        "3": aloe3,
        "4": aloe4,
      },
      diffen: {
        current: "2",
        "1": diffen1,
        "2": diffen2,
        "3": diffen3,
        "4": diffen4,
      },
      poth: {
        current: "2",
        "1": poth1,
        "2": poth2,
        "3": poth3,
        "4": poth4,
      },
    };

    // Hide larger plants
    changeOfficePlants(plantMap, PlantNames.aloe, PlantAction.shrink);
    changeOfficePlants(plantMap, PlantNames.diffen, PlantAction.shrink);
    changeOfficePlants(plantMap, PlantNames.poth, PlantAction.shrink);

    // Plant game button
    pots.setInteractive({ useHandCursor: true });
    pots.on("pointerdown", () => {
      this.scene.pause("Office");
      this.scene.launch("PlantGame");
    });

    // this.input.once("pointerdown", () => {
    //   this.scene.start("PlantGame");
    // });
  }
}
