import { GameObjects, LEFT } from "phaser";

export const width = 700;
export const height = 500;
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
  plantName: string
) => {
  const numbers = [1, 2, 3, 4];
  const next = plantStats[plantName].healthNum;
  plantMap[plantName][next].visible = true;
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

type PlantStats = {
  [key: string]: {
    [key: string]: any;
  };
};

export const plantStats: PlantStats = {
  diffen: {
    name: "Dieffenbachia",
    healthNum: 1,
    health: "Poor",
    water: 0,
    sunlight: 0,
    waterGoal: -80,
    sunGoal: 50,
  },
  aloe: {
    name: "Aloe",
    healthNum: 1,
    health: "Poor",
    water: 0,
    sunlight: 0,
    waterGoal: 50,
    sunGoal: -80,
  },
  poth: {
    name: "Pothos",
    healthNum: 1,
    health: "Poor",
    water: 0,
    sunlight: 0,
    waterGoal: -60,
    sunGoal: -60,
  },
};

export let currentPlant = PlantNames.diffen;

export const updateCurrentPlant = (newPlant: PlantNames) => {
  currentPlant = newPlant;
};

export const evaluatePlantStats = () => {
  for (const p in plantStats) {
    const waterDiff = Math.abs(plantStats[p].water - plantStats[p].waterGoal);
    const sunDiff = Math.abs(plantStats[p].sunlight - plantStats[p].sunGoal);

    if (waterDiff < 10 && sunDiff < 10) {
      plantStats[p].health = "Amazing";
      plantStats[p].healthNum = 4;
    } else if (waterDiff < 20 && sunDiff < 20) {
      plantStats[p].health = "Great";
      plantStats[p].healthNum = 3;
    } else if (waterDiff < 30 && sunDiff < 30) {
      plantStats[p].health = "Good";
      plantStats[p].healthNum = 2;
    } else {
      plantStats[p].health = "Poor";
      plantStats[p].healthNum = 1;
    }
  }
};

// Bool that checks if the player has opened the computer since last checking
// on their plants
export let hasOpenedComputer = true;

export const setHasOpenedComputer = (bool: boolean) =>
  (hasOpenedComputer = bool);

export let plantVisits = 0;

export const increasePlantVisits = () => plantVisits++;

export let bugVisits = 0;

export const increaseBugVisits = () => bugVisits++;

export let calVisits = 0;

export const increaseCalVisits = () => calVisits++;

export let meetVisits = 0;

export const increaseMeetVisits = () => meetVisits++;

export let isRoomMessy = false;

export const setIsRoomMessy = (bool:boolean) => {isRoomMessy=bool};

export let isBugsSquished = false;

export const setIsBugsSquished = (bool:boolean) => {isBugsSquished=bool};

export let count = 0;

export const increaseClock = (timestable: GameObjects.Image[]) => {
  timestable[0].setVisible(false);
  timestable[1].setVisible(true);
  //@ts-ignore
  timestable.push(timestable.shift());
  count++;
};

export let endMessage = "You got a lot done today!"
export const writeEndMessage = (newMessage: string) => {
  endMessage = newMessage
}
export const updateEndMessage = () => {
  console.log(isRoomMessy)
  if (plantStats.aloe.healthNum >2 && plantStats.diffen.healthNum >2 && plantStats.poth.healthNum >2){
    endMessage = "You are a plant wizard! \n\nAfter work, enjoy your oxygen rich home."
  }
  if (isRoomMessy) {
    endMessage = "It was an ok day, \n\nMaybe tomorrow you can clean your \n\nroom before the meeting starts."
  }
  if (isBugsSquished) {
    endMessage = "You weren't able to squish \n\nall the bugs today... \n\nyou'll get to it tomorrow!"
  }
}
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
