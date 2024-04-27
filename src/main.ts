import { AppLovinProxy } from "./GranadaLib/GranadaProxy/AppLovinProxy";
import { Boot } from "./scenes/Boot";
import { Game as MainGame } from "./scenes/Game";
import { GameOver } from "./scenes/GameOver";
import { Game, Types } from "phaser";

const granadaProxy = new AppLovinProxy();

const Start = () => {
  window.onload = () => {
    // Immediately check orientation on load
    checkOrientation();

    // Listen for orientation changes
    window.addEventListener("orientationchange", checkOrientation, {
      once: true,
    });
  };
};

const checkOrientation = async () => {
  if (screen.orientation.type.startsWith("portrait")) {
    window.removeEventListener("orientationchange", checkOrientation);

    await granadaProxy.connectToAPI();
    const { width, height } = granadaProxy.getScreenSize();

    console.log("checking", width, height);
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
        autoCenter: Phaser.Scale.NONE,
      },
      scene: [Boot, MainGame, GameOver],
    };

    new Game(config);
  } else {
    console.log("Please rotate your device to portrait orientation.");
  }
};

export default Start();
