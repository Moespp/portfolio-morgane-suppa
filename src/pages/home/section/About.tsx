import { useEffect, useState } from "react";
import Bento from "../../../components/bentos/Bento";
import LinksIcons from "../../../components/common/LinksIcons";
import Title from "../../../components/common/Title";

const SectionAbout = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    window.addEventListener("resize", () => {
      setIsMobile(window.innerWidth < 640);
    });

    return () => {
      window.removeEventListener("resize", () => {
        setIsMobile(window.innerWidth < 640);
      });
    };
  }, []);

  return (
    <section
      id="section-about"
      className="flex flex-col sm:gap-24 gap-8 items-center justify-center min-h-screen rounded-xl max-w-[1500px] mx-auto px-4 sm:px-10 sm:py-16 py-8"
    >
      {/* title about me */}
      <Title text="À propos de moi" />
      <div className="flex sm:flex-row flex-col gap-4 w-full">
        <Bento className="flex flex-col justify-center gap-4 lg:w-1/2">
          <img
            src="./img/morgane.png"
            alt="about"
            className="w-[80px] h-[80px] rounded-full"
          />
          <p className="text-sm">
            Forte de premières expériences dans l'industrie du jeu, j'ai
            commencé ma carrière dans un Escape Game (Secret Door) où j'ai
            travaillé sur 4 salles d'escape compétitive (Une première en France)
            et où j’ai été Game Master. J'ai poursuivie ma carrière au sein du
            studio indépendant toulousain Dreamirl ainsi que du studio bordelais
            HammerHead.
          </p>
          <p className="text-sm">
            En parallèle de ma carrière dans le jeu vidéo, je suis auteur et
            l’illustratrice d'un roman visuel intitulé A Crow’s Nest, une
            aventure dans un monde Dark Fantasy.
          </p>
          <p className="text-sm">
            Je dessine également pour des campagnes de jeu de rôle et créer
            également mes propres campagnes au sein d’univers où j’ai créé le
            World Building intégral.
          </p>
          <p className="text-sm">
            Chaque étape a façonné ma passion et affiné mes compétences.
          </p>
        </Bento>
        <div className="flex flex-col items-center justify-center gap-4 lg:w-1/2">
          <Bento className="h-full">
            <h2 className="text-xl font-semibold">Quelques point sur moi :</h2>
            <ul className="list-disc pl-4 flex flex-col gap-2 text-sm">
              <li>
                Diplômée en Game Design concepteur en gamification (2020-2023)
              </li>
              <li>
                Fable The Lost Chapter, Titanfall 2, Ori and The Will Of The
                Wisps, Apex Legends, Baldur's Gate 3 sont mes jeux préférés.
              </li>
              <li>
                Autodidacte dans le dessin depuis plus de 15 ans, je fais du
                réalisme ainsi que du semi-réaliste très sombre.
              </li>
              <li>
                Pianiste depuis plus de 10 ans, je joue également de la guitare,
                du ukulélé et je chante également.
              </li>
              <li>
                Créatrice de pleins d'univers de Role Play sur Discord mais
                également Maître du jeu.
              </li>
            </ul>
          </Bento>
          <Bento
            row={!isMobile ? true : false}
            className="w-full gap-4 item-center justify-center"
          >
            <div className="flex flex-row gap-4 w-full items-center justify-between">
              <p className="text-sm font-semibold">Mes réseaux sociaux :</p>
              <LinksIcons />
            </div>
          </Bento>
        </div>
      </div>
    </section>
  );
};

export default SectionAbout;
