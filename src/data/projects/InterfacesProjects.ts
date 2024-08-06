export type TagDTO =
  | "Level"
  | "Game"
  | "Narrative Design"
  | "Scripting"
  | "Game Design"
  | "PoC"
  | "Artist";

export interface ProjectDTO {
  id: string;
  title: string;
  img: string;
  description: string;
  type: "Pro" | "Perso";
  tags: TagDTO[];
  link: string;
}
