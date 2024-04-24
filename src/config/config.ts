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
    PoetsenOne: "Poetsen One",
    Poppins: "Poppins",
  },
  images: {
    questions: {
      key: "questions",
      path: "assets/questions.png",
    },
    topBar: {
      key: "topBar",
      path: "assets/top-bar.png",
    },
    submit: {
      key: "submit",
      path: "assets/submit.png",
    },
    letter: {
      key: "letter",
      path: "assets/letter.png",
    },
  },
};

export default Config;
