import { GameObjects } from "phaser";

/**
 * Create typewriter animation for text
 * @param {Phaser.GameObjects.Text} target
 * @param {number} [speedInMs=25]
 * @returns {Promise<void>}
 */
export function animateText(
  target: Phaser.GameObjects.Text | undefined,
  speedInMs = 25
) {
  if (!target) {
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

export enum PlantAction {
  grow = "grow",
  shrink = "shrink",
}

export enum PlantNames {
  aloe = "aloe",
  diffen = "diffen",
  poth = "poth",
}

export const changeOfficePlants = (
  plantMap: { [key: string]: { [key: number | string]: any } },
  plantName: string,
  action: string
) => {
  const current = plantMap[plantName].current;
  const numbers = [1, 2, 3, 4];

  if (current === 1 && action == PlantAction.shrink) return;
  if (current === 4 && action == PlantAction.grow) return;

  let next = Number(current) + 1;
  if (action === PlantAction.shrink) next = Number(current) - 1;

  plantMap.aloe[next].visible = true;
  numbers.map((n) => {
    if (n !== next) {
      plantMap[plantName][n].visible = false;
    }
  });
};

export const plantHealthMap = {
  Poor: 1,
  Good: 2,
  Great: 3,
  Amazing: 4,
};

export const plantStats = {
  diffen: {
    name: "Dieffenbachia",
    healthNum: 1,
    health: "Poor",
    water: 0,
    sunlight: 0,
  },
  aloe: {
    name: "Aloe",
    healthNum: 1,
    health: "Poor",
    water: 0,
    sunlight: 0,
  },
  poth: {
    name: "Pothos",
    healthNum: 1,
    health: "Poor",
    water: 0,
    sunlight: 0,
  },
};

export let currentPlant = PlantNames.diffen;

export const updateCurrentPlant = (newPlant: PlantNames) => {
  currentPlant = newPlant;
};
