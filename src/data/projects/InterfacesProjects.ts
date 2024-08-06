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
}
