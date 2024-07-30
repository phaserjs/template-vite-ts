import { Scene, GameObjects } from "phaser";
import { changeOfficePlants, PlantAction, PlantNames } from "./helpers";

export class Office extends Scene {
  background: GameObjects.Image;
  aloe1: GameObjects.Image;
  aloe2: GameObjects.Image;
  aloe3: GameObjects.Image;
  aloe4: GameObjects.Image;
  poth1: GameObjects.Image;
  poth2: GameObjects.Image;
  poth3: GameObjects.Image;
  poth4: GameObjects.Image;
  diffen1: GameObjects.Image;
  diffen2: GameObjects.Image;
  diffen3: GameObjects.Image;
  diffen4: GameObjects.Image;
  plantMap: {[key:string]:{[key:string]:any}};


  constructor() {
    super("MainMenu");
  }

  create() {
    const sky = this.add.image(178 * 2, 54 * 2, "sky");
    sky.scale = .5
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
    this.aloe1 = this.add.image(211 * 2, 84 * 2, "aloe1");
    this.diffen1 = this.add.image(186 * 2, 79 * 2, "diffen1");
    this.diffen1.flipX = true
    this.poth1 = this.add.image(234 * 2, 83 * 2, "poth1");
    // Plants 2
    this.aloe2 = this.add.image(211 * 2, 83 * 2, "aloe2");
    this.diffen2 = this.add.image(192 * 2, 76 * 2, "diffen2");
    this.poth2 = this.add.image(238 * 2, 80 * 2, "poth2");
    // Plants 3
    this.aloe3 = this.add.image(212 * 2, 81 * 2, "aloe3");
    this.diffen3 = this.add.image(193 * 2, 73 * 2, "diffen3");
    this.poth3 = this.add.image(242 * 2, 175, "poth3");
    // Plants 4
    this.aloe4 = this.add.image(423, 159, "aloe4");
    this.diffen4 = this.add.image(193 * 2, 74 * 2, "diffen4");
    this.poth4 = this.add.image(243 * 2, 183, "poth4");

    this.plantMap = {
        aloe: {
        current: "2",
         "1": this.aloe1,
         "2": this.aloe2, 
         "3": this.aloe3,
         "4": this.aloe4, 
        },
        diffen: {
            current: "2",
            "1": this.diffen1, 
            "2": this.diffen2, 
            "3": this.diffen3, 
            "4": this.diffen4,
        },
        poth: {
            current: "2",
            "1": this.poth1, 
            "2": this.poth2, 
            "3": this.poth3, 
            "4": this.poth4
        }
    }
    
    // Hide larger plants
    changeOfficePlants(this.plantMap, PlantNames.aloe, PlantAction.shrink)
    changeOfficePlants(this.plantMap, PlantNames.diffen, PlantAction.shrink)
    changeOfficePlants(this.plantMap, PlantNames.poth, PlantAction.shrink)



    // this.title = this.add.text(512, 460, 'Main Menu', {
    //     fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
    //     stroke: '#000000', strokeThickness: 8,
    //     align: 'center'
    // }).setOrigin(0.5);

    this.input.once("pointerdown", () => {
      this.scene.start("Game");
    });
  }
}
