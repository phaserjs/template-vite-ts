import { GameObjects, LEFT } from "phaser";

export const width = 700;
export const height = 500;
/**
 * Create typewriter animation for text
 * @param {Phaser.GameObjects.Text} target
 * @param {number} [speedInMs=25]
 * @returns {Promise<void>}
 */
export function animateText(target: Phaser.GameObjects.Text | undefined, speedInMs = 25) {
  if(!target){
    return;
  }
  // store original text
  const message = target.text;
  const invisibleMessage = message.replace(/[^ ]/g, " ");

  // clear text on screen
  target.text = "";

  // mutable state for visible text
  let visibleText = "";

  // use a Promise to wait for the animation to complete
  return new Promise<void>((resolve) => {
    const timer = target.scene.time.addEvent({
      delay: speedInMs,
      loop: true,
      callback() {
        // if all characters are visible, stop the timer
        if (target.text === message) {
          timer.destroy();
          return resolve();
        }

        // add next character to visible text
        visibleText += message[visibleText.length];

        // right pad with invisibleText
        const invisibleText = invisibleMessage.substring(visibleText.length);

        // update text on screen
        target.text = visibleText + invisibleText;
      },
    });
  });
}
/**
 *
 * @param {Phaser.Scene} scene
 * @param {number} totalWidth
 * @param {string} texture
 * @param {number} scrollFactor
 * @param {number} yIndex
 */
export const createAligned = (
  scene: Phaser.Scene,
  totalWidth: number,
  texture: string,
  scrollFactor: number,
  yIndex: number
) => {
  const w = scene.textures.get(texture).getSourceImage().width;
  const count = Math.ceil(totalWidth / w) * scrollFactor;

  let x = 0;
  for (let i = 0; i < count; ++i) {
    const m = scene.add
      .image(x, yIndex, texture)
      .setOrigin(0, 1)
      .setScrollFactor(scrollFactor);

    x += m.width;
  }
};

/**
 *
 * @param {GameObjects.Text[]} objects
 * @param {number} left
 * @param {number} right
 */
export const alignObjectsHorizontal = (
  objects: GameObjects.Text[],
  left: number,
  right: number
) => {
  let offset = (right - left)/objects.length;
  objects.map((obj, i) => {
    obj.setPosition(left + offset * i, obj.y);
  });
};