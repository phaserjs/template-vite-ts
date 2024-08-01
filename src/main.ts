import { Boot } from './scenes/Boot';
import { Game as MainGame } from './scenes/Game';
import { GameOver } from './scenes/GameOver';
import { Welcome } from './scenes/Welcome';
import { Credits } from './scenes/Credits';
import { Office } from './scenes/Office';
import { Desktop } from './scenes/Desktop';
import { PlantGame } from './scenes/PlantGame';
import { GoogleMeet } from './scenes/GoogleMeet';
import { PlantHealth } from './scenes/PlantHealth';
import { PlantLady } from './scenes/PlantLady';

import Laptop from './scenes/Laptop';
import { Preloader } from './scenes/Preloader';

import { Game, Types } from "phaser";
import Calendar from './scenes/Calendar';
import { width, height } from './scenes/helpers';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: width,
    height: height,
    parent: 'game-container',
    backgroundColor: '#285E63',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: [
        Boot,
        Preloader,
        Welcome,
        Credits,
        Office,
        PlantGame,
        PlantHealth,
        Desktop,
        PlantLady,
        GoogleMeet,
        MainGame,
        GameOver,
        Laptop,
        Calendar
    ]
};

export default new Game(config);
