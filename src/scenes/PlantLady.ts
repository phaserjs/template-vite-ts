import { GameObjects, Scene } from "phaser";

export class PlantLady extends Scene {
  constructor() {
    super("PlantLady");
  }

  create() {
    const background = this.add.image(300, 280, "plantlady");
    const plantText = this.add.image(270, 243, "plant-text");
    const pothText = this.add.image(300, 320, "poth-text");
    const diffenText = this.add.image(310, 320, "diffen-text");
    diffenText.visible = false;
    const aloeText = this.add.image(295, 320, "aloe-text");
    aloeText.visible = false;
    const rightArrow = this.add.image(190, 320, "left-arrow");
    const leftArrow = this.add.image(430, 320, "right-arrow");
    const block = this.add.image(310, 320, "block");
    let plantInfo: GameObjects.Image[] = [pothText, diffenText, aloeText];

    // Right arrow button
    rightArrow.setInteractive({ useHandCursor: true });
    rightArrow.on("pointerup", () => {
      plantInfo[0].visible = false;
      plantInfo[1].visible = true;
      //@ts-ignore
      plantInfo.push(plantInfo.shift());
    });

    // Left arrow button
    leftArrow.setInteractive({ useHandCursor: true });
    leftArrow.on("pointerup", () => {
      plantInfo[0].visible = false;
      plantInfo[2].visible = true;
     //@ts-ignore
      plantInfo.unshift(plantInfo.pop())
    });

    // Close window button
    const closeWindow = this.add
      .zone(112, 206, 7, 7)
      .setOrigin(0);
    closeWindow.setInteractive({ useHandCursor: true });
    closeWindow.on("pointerup", () => {
      this.scene.stop("PlantLady");
    });

    // Close laptop button
    const close = this.add.rectangle(625, 45, 15, 15, 0x000000).setOrigin(0);
    const x = this.add.text(628, 45, "x").setOrigin(0);
    close.setInteractive({ useHandCursor: true });
    close.on("pointerup", () => {
      this.scene.stop("Desktop");
      this.scene.stop("PlantLady");
      this.scene.resume("Office");
    });
  }
}
