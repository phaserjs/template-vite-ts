import { GameConfig } from "../GranadaLib/types/types";

const Config: GameConfig = {
  size: {
    x: 375,
    y: 812,
  },
  pages: {
    Boot: "Boot",
    Game: "Game",
    GameOver: "GameOver",
  },
  fonts: {
    PoetsenOne: "PoetsenOne",
    Poppins: "Poppins",
  },
  images: {
    questions: {
      key: "questions",
      path: "assets/questions.svg",
    },
    topBar: {
      key: "topBar",
      path: "assets/top-bar.svg",
    },
    submit: {
      key: "submit",
      path: "assets/submit.svg",
    },
    letter: {
      key: "letter",
      path: "assets/letter.svg",
    },
    letterCorrect: {
      key: "letterCorrect",
      path: "assets/letter-correct.svg",
    },
    letterAlmost: {
      key: "letterAlmost",
      path: "assets/letter-almost.svg",
    },
    letterWrong: {
      key: "letterWrong",
      path: "assets/letter-wrong.svg",
    },
    deleteBtn: {
      key: "deleteBtn",
      path: "assets/backspace.svg",
    },
    confetti: {
      key: "confetti",
      path: "assets/confetti.png",
    },
    wheel: {
      key: "wheel",
      path: "assets/wheel.svg",
    },
    welcomeSplash: {
      key: "welcomeSplash",
      path: "assets/welcome-splash.svg",
    },
    completeSplash: {
      key: "completeSplash",
      path: "assets/complete-splash.svg",
    },
    button: {
      key: "button",
      path: "assets/button.svg",
    },
  },
};

export default Config;
