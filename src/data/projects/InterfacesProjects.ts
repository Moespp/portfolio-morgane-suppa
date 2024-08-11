export type PlateformeDTO =
  | "Steam"
  | "Switch"
  | "Xbox"
  | "Playstation"
  | "Windows";

export type TagDTO =
  | "Level Designer"
  | "Narrative Designer"
  | "Artiste"
  | "Scripting"
  | "Game Design"
  | "Auteur";

export interface ProjectDTO {
  id: string;
  title: string;
  img: string;
  description: string;
  type: "Pro" | "Perso";
  tags: TagDTO[];
  link: string;
  page?: PageProjectDTO;
}

export interface PageProjectDTO {
  backgroundImage: string;
  moteur: string;
  tools: string;
  plateforme: string[];
  gameType: string[];
  video: string;
  pathi18n: string;
  conceptionImage: string[];
  blockoutImage: string[];
  renduImage: string[];
  gameplayImageCard1: string;
  gameplayImageCard2: string;
  gameplayImageCard3: string;
  gameplayImageCard4: string;
}
