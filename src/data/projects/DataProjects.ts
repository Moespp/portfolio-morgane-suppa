import { ProjectDTO } from "./InterfacesProjects";

const projects: ProjectDTO[] = [
  {
    
    id: "1",
    title: "Noreya: The gold project - Dreamirl",
    translation: "projects.noreya",
    img: "./img/project/noreya/headerNoreya.png",
    type: "Pro",
    tags: ["Game Design", "Level Design", "Level Art", "Narrative Design", "Script"],
    page: {
      backgroundImage: "../img/project/noreya/IMG_0282.gif",
      moteur: "DreamEngine",
      tools: "Tiled, Miro, Trello, Discord",
      plateforme: ["Steam", "Switch", "Xbox", "Playstation"],
      gameType: ["metroidvania", "pixelart", "2D", "fantasy"],
      video: "https://www.youtube.com/embed/OWS6J3d5wi4",
      pathi18n: "project",
      conceptionImage: [
        "../img/project/noreya/Conception.png",
        "../img/project/noreya/Conception2.png",
        "../img/project/noreya/Conception3.png",
        "../img/project/noreya/ConceptBoss.png",
        "../img/project/noreya/ConceptB6.png",
      ],
      blockoutImage: [
        "../img/project/noreya/world_of_light.png",
        "../img/project/noreya/blockoutbiome1.png",
        "../img/project/noreya/blockoutbiome2.png",
        "../img/project/noreya/blockoutbiome3.png",
        "../img/project/noreya/Blockout4.png",
        "../img/project/noreya/Blockout7.png",
        "../img/project/noreya/BigBlockout.png",
      ],
      renduImage: [
        "../img/project/noreya/map.png",
        "../img/project/noreya/Rendu.png",
        "../img/project/noreya/Rendu2.png",
        "../img/project/noreya/Rendu3.png",
        "../img/project/noreya/Rendu4.png",
        "../img/project/noreya/Rendu5.png",
        "../img/project/noreya/Rendu6.png",
        "../img/project/noreya/Rendu7.png",
      ],
      gameplayImageCard1: "../img/project/noreya/ExploNoreya.gif",

      gameplayImageCard2: "../img/project/noreya/PuzzleNoreya.gif",

      gameplayImageCard3: "../img/project/noreya/SpiderBoss.gif",
      gameplayImageCard4: "../img/project/noreya/IMG_explo.gif",
    },
  },
  {
    id: "2",
    title: "TAILS TALES - Devil In Disguise",
    img: "./img/project/DID/TellTails.png",
    type: "Pro",
    tags: ["Lead project", "Game Design", "Level Design", "Level Art",],
    externalLink: "https://www.linkedin.com/company/devil-in-disguise-studio",
  },
  {
    id: "3",
    title: "Break in the loop",
    translation: "projects.break",
    img: "./img/project/break/headerBIL.png",
    type: "Perso",
    tags: ["Game Design", "Level Design", "Level Art"],
    page: {
      backgroundImage: "../img/project/break/bgimg.png",
      moteur: "Unreal Engine 4.27",
      tools: "Miro, Trello, Discord",
      plateforme: ["Windows"],
      gameType: ["EscapeGame", "VR", "3D", "Cell-shading"],
      video: "https://www.youtube.com/embed/gqMoWAYzNoM",
      pathi18n: "project",
      conceptionImage: [
        "../img/project/break/Conception.png",
        "../img/project/break/Conception2.png",
        "../img/project/break/Conception3.png",
      ],
      blockoutImage: [],
      renduImage: [
        "../img/project/break/Rendu.png",
        "../img/project/break/Tailor.png",
        "../img/project/break/Rendu2.png",
        "../img/project/break/Distillerie.png",
        "../img/project/break/Rendu3.png",
        "../img/project/break/Boss.png",
      ],
      gameplayImageCard1: "../img/project/break/E1.gif",

      gameplayImageCard2: "../img/project/break/E2.gif",

      gameplayImageCard3: "../img/project/break/E3.gif",
      gameplayImageCard4: "../img/project/break/gameplay5.png",
    },
  },
  {
    id: "3",
    title: "Game Jams & Mini Game",
    img: "./img/project/My_Itch/Itch.jpeg",
    type: "Perso",
    tags: ["Game Design", "Level Design", "Art", "Script"],
    externalLink: "https://mospp.itch.io/",
  },
];

export default projects;
