import Phaser from "phaser";

/**
 * Class representing an image with a centered text label in Phaser.
 * Extends Phaser.GameObjects.Container to include an image and text centered within.
 */
class LabeledImage extends Phaser.GameObjects.Container {
  private label: Phaser.GameObjects.Text;
  private image: Phaser.GameObjects.Image;

  /**
   * Creates an instance of a LabeledImage.
   * @param scene The Phaser scene where this container is being added.
   * @param x The horizontal position of this container in the scene.
   * @param y The vertical position of this container in the scene.
   * @param texture The key of the texture to use for the image.
   * @param label The initial text to display centered on the image.
   */
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    label: string
  ) {
    super(scene, x, y);
    scene.add.existing(this);

    this.image = scene.make.image({ x: 0, y: 0, key: texture });
    this.setSize(this.image.width, this.image.height);
    this.image.setOrigin(0);
    this.add(this.image);

    // Creating the text object
    const textConfig: Phaser.Types.GameObjects.Text.TextConfig = {
      x: this.image.width / 2,
      y: this.image.height / 2,
      style: {
        color: "#000",
        fontSize: "24px",
        fontStyle: "bold",
        align: "center",
      },
      text: label,
    };

    this.label = scene.make.text(textConfig);
    this.label.setFontFamily("Poppins");
    this.label.setFontSize(24);

    this.label.setOrigin(0.5);
    this.add(this.label);

    // Adjusting the position of label relative to the image size
    this.image.on("resize", () => this.updateLabelPosition());
  }

  /**
   * Updates the position of the label to ensure it remains centered on the image.
   */
  private updateLabelPosition = () => {
    this.label.x = this.image.width / 2; // Center horizontally in the container
    this.label.y = this.image.height / 2; // Center vertically in the container
    this.setSize(this.image.width, this.image.height);
  };

  /**
   * Sets new text for the label centered on this image.
   * @param newLabel The new text to be displayed on the label.
   */
  public setLabelText = (newLabel: string): void => {
    this.label.setText(newLabel);
  };

  public setAnswerState = (texture: string) => {
    this.label.setColor("#fff");
    this.image.setTexture(texture);
  };

  public reset = (texture: string) => {
    this.label.setText("");
    this.label.setColor("#000");
    this.image.setTexture(texture);
    this.image.postFX.clear();
  };

  public setSelected = (isSelected: boolean) => {
    if (isSelected) {
      this.image.postFX.clear();
      this.image.postFX.addGlow(0x401f40);
    } else {
      this.image.postFX.clear();
    }
  };
}

export default LabeledImage;
