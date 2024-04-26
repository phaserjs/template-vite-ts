import { getScreenSize } from "./GranadaLib/display/ScreenUtils";
import Config from "./config/config";
import { Boot } from "./scenes/Boot";
import { Game as MainGame } from "./scenes/Game";
import { GameOver } from "./scenes/GameOver";
import { Game, Types } from "phaser";

const { width, height } = getScreenSize();

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: width,
  height: height,
  transparent: true,
  parent: "game-container",
  roundPixels: false,
  antialias: true,
  scale: {
    mode: Phaser.Scale.NONE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [Boot, MainGame, GameOver],
};

const Start = () => {
  window.onload = function () {
    new Game(config);
  };
};

export default Start();
