import { ProjectDTO } from "./InterfacesProjects";

const projects: ProjectDTO[] = [
  {
    id: "1",
    title: "Noreya: The gold project",
    translation: "projects.noreya",
    img: "./img/project/noreya/IMG_9372.jpg",
    type: "Pro",
    tags: ["Level Designer", "Game Design", "Narrative Designer", "Scripting"],
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
      ],
      blockoutImage: [
        "../img/project/noreya/blockoutbiome1.png",
        "../img/project/noreya/blockoutbiome2.png",
        "../img/project/noreya/blockoutbiome3.png",
      ],
      renduImage: [
        "../img/project/noreya/Rendu.png",
        "../img/project/noreya/Rendu2.png",
        "../img/project/noreya/Rendu3.png",
      ],
      gameplayImageCard1: "../img/project/noreya/IMG_9372.jpg",

      gameplayImageCard2: "../img/project/noreya/IMG_9372.jpg",

      gameplayImageCard3: "../img/project/noreya/IMG_9372.jpg",
      gameplayImageCard4: "../img/project/noreya/IMG_explo.gif",
    },
  },
  {
    id: "2",
    title: "Break in the loop",
    translation: "projects.break",
    img: "./img/project/break/breakintheloop4.jpg",
    type: "Perso",
    tags: ["Level Designer", "Game Design"],
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
        "../img/project/break/Rendu2.png",
        "../img/project/break/Rendu3.png",
      ],
      gameplayImageCard1: "../img/project/break/IMG_9372.jpg",

      gameplayImageCard2: "../img/project/break/IMG_9372.jpg",

      gameplayImageCard3: "../img/project/break/IMG_9372.jpg",
      gameplayImageCard4: "../img/project/break/gameplay5.png",
    },
  },
  {
    id: "3",
    title: "Echoes of the restless",
    translation: "projects.echoes",
    img: "./img/project/echoes/ECHOESOFTHERESTLESS.png",
    type: "Perso",
    tags: ["Level Designer", "Game Design"],
    page: {
      backgroundImage: "../img/project/echoes/Cinématique.gif",
      moteur: "Unreal Engine 4.27",
      tools: "Miro, Trello, Discord",
      plateforme: ["Windows"],
      gameType: [
        "Platformer",
        "Cartoon",
        "3D",
        "Fantasy",
        "Projet de fin d'étude",
      ],
      video: "https://www.youtube.com/embed/eKoYnI1io94",
      pathi18n: "projects",
      conceptionImage: [
        "../img/project/echoes/Conception.png",
        "../img/project/echoes/Conception2.png",
        "../img/project/echoes/Conception3.png",
      ],
      blockoutImage: [],
      renduImage: [
        "../img/project/echoes/Rendu.png",
        "../img/project/echoes/Rendu2.png",
      ],
      gameplayImageCard1: "../img/project/echoes/IMG_9372.jpg",

      gameplayImageCard2: "../img/project/echoes/IMG_9372.jpg",

      gameplayImageCard3: "../img/project/echoes/IMG_9372.jpg",
      gameplayImageCard4: "../img/project/echoes/Momentcalme.gif",
    },
  },
  {
    id: "4",
    title: "Game Jam - NOKUEST 3310",
    img: "./img/project/nokuest/nokuest.png",
    type: "Perso",
    tags: ["Level Designer", "Game Design", "Artiste", "Scripting"],
    externalLink: "https://mospp.itch.io/nokuest-nokiagamejam3310",
  },
  {
    id: "5",
    title: "Inferno's descent",
    translation: "projects.inferno",
    img: "./img/project/inferno/InfernosDescent.png",
    type: "Perso",
    tags: ["Level Designer", "Game Design"],
    page: {
      backgroundImage: "../img/project/inferno/blockoutbiome3.png",
      moteur: "Unreal Engine 5.2",
      tools: "Miro, Trello, Discord",
      plateforme: ["Windows"],
      gameType: ["Trpg", "3D", "DnD", "Proof of cconcept"],
      video: "https://www.youtube.com/embed/wogfOxA6bQw",
      pathi18n: "projects",
      conceptionImage: ["../img/project/inferno/Conception3.png"],
      blockoutImage: [
        "../img/project/inferno/blockoutbiome1.png",
        "../img/project/inferno/blockoutbiome2.png",
        "../img/project/inferno/blockoutbiome3.png",
      ],
      renduImage: [],
      gameplayImageCard1: "../img/project/inferno/IMG_9372.jpg",

      gameplayImageCard2: "../img/project/inferno/IMG_9372.jpg",

      gameplayImageCard3: "../img/project/inferno/IMG_9372.jpg",
      gameplayImageCard4: "../img/project/inferno/Slide1.png",
    },
  },
  {
    id: "6",
    title: "Key Frame - Le Comte De Monte-Cristo (Pratice)",
    img: "./img/project/MonteCristo/Card.png",
    type: "Perso",
    tags: ["Artiste"],
    externalLink: "https://www.artstation.com/artwork/P6aAvr",
  },
];

export default projects;
