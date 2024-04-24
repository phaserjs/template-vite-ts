import Phaser from "phaser";
import LabeledImage from "./LabeledImage";
import { GameConfig } from "../GranadaLib/types/types";

export type GridConfig = {
  rows: number;
  cols: number;
  xPadding: number;
  yPadding: number;
};

/**
 * A container class that organizes multiple LabeledImages in a configurable grid layout.
 * Extends Phaser.GameObjects.Container.
 */
class LabeledImageGrid extends Phaser.GameObjects.Container {
  private labels: LabeledImage[][];

  /**
   * Constructs a grid of labeled images within a Phaser scene.
   * @param scene The Phaser scene where this container will be added.
   * @param x The horizontal position of this container in the scene.
   * @param y The vertical position of this container in the scene.
   * @param texture The texture key for the images in the grid.
   * @param gridConfig Configuration settings for grid rows, columns, and padding.
   * @param gameConfig Configuration settings specific to the game (not utilized in this example).
   */
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    gridConfig: GridConfig,
    gameConfig: GameConfig
  ) {
    super(scene, x, y);

    this.labels = Array.from({ length: gridConfig.rows }, () => []);

    let xPos = 0;
    let yPos = 0;
    for (let i = 0; i < gridConfig.rows; i++) {
      xPos = 0;
      for (let j = 0; j < gridConfig.cols; j++) {
        const label = "";
        const labeledImage = new LabeledImage(
          scene,
          xPos,
          yPos,
          texture,
          label
        );
        this.add(labeledImage);
        this.labels[j].push(labeledImage);
        xPos += labeledImage.width + gridConfig.xPadding;
      }
      yPos += this.labels[0][0].height + gridConfig.yPadding;
    }
    this.setSize(
      gridConfig.cols * (this.labels[0][0].width + gridConfig.xPadding),
      gridConfig.rows * (this.labels[0][0].height + gridConfig.yPadding)
    );

    scene.add.existing(this);
  }

  /**
   * Sets the text of a label at a specific grid location.
   * Throws an error if the specified row or column are out of range.
   * @param row The row index of the label to update.
   * @param col The column index of the label to update.
   * @param newLabel The new text to set on the label.
   */
  public setLabelText(row: number, col: number, newLabel: string): void {
    if (this.labels[row] && this.labels[row][col]) {
      this.labels[row][col].setLabelText(newLabel);
    } else {
      throw new Error(`Invalid row or column: ${row}, ${col}`);
    }
  }
}

export default LabeledImageGrid;
