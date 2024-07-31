import { Scene, GameObjects } from "phaser";
import {
  changeOfficePlants,
  PlantAction,
  PlantNames,
  updateCurrentPlant,
} from "./helpers";

export class PlantGame extends Scene {
  background: GameObjects.Image;

  constructor() {
    super("PlantGame");
  }

  create() {
    this.background = this.add.image(350, 250, "plantGame");

    // Plants 1
    const aloe1 = this.add.image(169 * 2, 160 * 2, "bigAloe1");
    const diffen1 = this.add.image(106 * 2, 178 * 2, "bigDiffen1");
    const poth1 = this.add.image(224 * 2, 165 * 2, "bigPoth1");
    // Plants 2
    const aloe2 = this.add.image(169 * 2, 143 * 2, "bigAloe2");
    const diffen2 = this.add.image(96 * 2, 163 * 2, "bigDiffen2");
    const poth2 = this.add.image(230 * 2, 145 * 2, "bigPoth2");
    // Plants 3
    const poth3 = this.add.image(229 * 2, 145 * 2, "bigPoth3");
    const aloe3 = this.add.image(179 * 2, 133 * 2, "bigAloe3");
    const diffen3 = this.add.image(98 * 2, 140 * 2, "bigDiffen3");
    // Plants 4
    const poth4 = this.add.image(244 * 2, 135 * 2, "bigPoth4");
    const aloe4 = this.add.image(159 * 2, 135 * 2, "bigAloe4");
    const diffen4 = this.add.image(112 * 2, 128 * 2, "bigDiffen4");

    const plantMap = {
      aloe: {
        current: 2,
        1: aloe1,
        2: aloe2,
        3: aloe3,
        4: aloe4,
      },
      diffen: {
        current: 2,
        1: diffen1,
        2: diffen2,
        3: diffen3,
        4: diffen4,
      },
      poth: {
        current: 2,
        1: poth1,
        2: poth2,
        3: poth3,
        4: poth4,
      },
    };

    // Hide larger plants
    changeOfficePlants(plantMap, PlantNames.aloe, PlantAction.shrink);
    changeOfficePlants(plantMap, PlantNames.diffen, PlantAction.shrink);
    changeOfficePlants(plantMap, PlantNames.poth, PlantAction.shrink);

    // Plant Health buttons
    poth1.setInteractive({ useHandCursor: true });
    poth1.on("pointerup", () => {
      updateCurrentPlant(PlantNames.poth);
      this.scene.launch("PlantHealth");
    });
    poth2.setInteractive({ useHandCursor: true });
    poth2.on("pointerup", () => {
      updateCurrentPlant(PlantNames.poth);
      this.scene.launch("PlantHealth");
    });
    poth3.setInteractive({ useHandCursor: true });
    poth3.on("pointerup", () => {
      updateCurrentPlant(PlantNames.poth);
      this.scene.launch("PlantHealth");
    });
    poth4.setInteractive({ useHandCursor: true });
    poth4.on("pointerup", () => {
      updateCurrentPlant(PlantNames.poth);
      this.scene.launch("PlantHealth");
    });
    aloe1.setInteractive({ useHandCursor: true });
    aloe1.on("pointerup", () => {
      updateCurrentPlant(PlantNames.aloe);
      this.scene.launch("PlantHealth");
    });
    aloe2.setInteractive({ useHandCursor: true });
    aloe2.on("pointerup", () => {
      updateCurrentPlant(PlantNames.aloe);
      this.scene.launch("PlantHealth");
    });
    aloe3.setInteractive({ useHandCursor: true });
    aloe3.on("pointerup", () => {
      updateCurrentPlant(PlantNames.aloe);
      this.scene.launch("PlantHealth");
    });
    aloe4.setInteractive({ useHandCursor: true });
    aloe4.on("pointerup", () => {
      updateCurrentPlant(PlantNames.aloe);
      this.scene.launch("PlantHealth");
    });
    diffen1.setInteractive({ useHandCursor: true });
    diffen1.on("pointerup", () => {
      updateCurrentPlant(PlantNames.diffen);
      this.scene.launch("PlantHealth");
    });
    diffen2.setInteractive({ useHandCursor: true });
    diffen2.on("pointerup", () => {
      updateCurrentPlant(PlantNames.diffen);
      this.scene.launch("PlantHealth");
    });
    diffen3.setInteractive({ useHandCursor: true });
    diffen3.on("pointerup", () => {
      updateCurrentPlant(PlantNames.diffen);
      this.scene.launch("PlantHealth");
    });
    diffen4.setInteractive({ useHandCursor: true });
    diffen4.on("pointerup", () => {
      updateCurrentPlant(PlantNames.diffen);
      this.scene.launch("PlantHealth");
    });

    // Close button
    const close = this.add.rectangle(610, 70, 15, 15, 0x000000).setOrigin(0);
    const x = this.add.text(613, 70, "x").setOrigin(0);
    close.setInteractive({ useHandCursor: true });
    close.on("pointerup", () => {
      this.scene.stop("PlantHealth");

      this.scene.stop("PlantGame");
      this.scene.resume("Office");
    });
  }
}
