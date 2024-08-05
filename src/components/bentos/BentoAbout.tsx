import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ChevronDown } from "lucide-react";

const timer = 50;

const BentoAbout = () => {
  const paragraphRef = useRef<HTMLDivElement>(null);
  const [showParagraph, setShowParagraph] = useState(false);
  const isFirstRender = useRef(true);

  useLayoutEffect(() => {
    if (isFirstRender.current) {
      setTimeout(() => {
        isFirstRender.current = false;
      }, timer);
      return;
    }

    if (paragraphRef.current) {
      if (showParagraph) {
        gsap.fromTo(
          paragraphRef.current,
          { height: 0, opacity: 0 },
          {
            height: paragraphRef.current.scrollHeight,
            opacity: 1,
            duration: 0.5,
            ease: "power2.out",
          }
        );
      } else {
        gsap.fromTo(
          paragraphRef.current,
          { height: paragraphRef.current.scrollHeight, opacity: 1 },
          { height: 0, opacity: 0, duration: 0.5, ease: "power2.out" }
        );
      }
    }
  }, [showParagraph]);

  const handleToggleParagraph = () => {
    setShowParagraph(!showParagraph);
  };

  return (
    <div
      className={`mx-4 relative -translate-y-[50vh] top-[50vh] flex flex-col items-center justify-center max-w-[700px] gap-6 bg-white2 pt-14 px-6 sm:px-10 pb-4 rounded-xl shadow-lg ${showParagraph && "sm:-translate-y-[45vh] -translate-y-[40vh] transition-all duration-300"}`}
    >
      <img
        src="./img/morgane.png"
        alt="about"
        className="w-[80px] h-[80px] rounded-full absolute top-0 left-1/2 right-1/2 -translate-x-1/2 -translate-y-1/2"
      />
      <h1 className="sm:text-4xl text-2xl font-extrabold text-center">
        MORGANE SUPPA
      </h1>
      <div className="w-24 h-[2px] bg-black" />
      <div className="flex flex-col gap-4">
        <p className="text-sm">
          Depuis mes premiers pas, j'ai toujours été attirée par l'art et les
          jeux-vidéos. Le Level Design et la Narration furent immédiatement les
          spécialités où j'étais le plus à l'aise suivi du storytelling
          environnemental ainsi que le Level Art. Mon profil artistique fusionne
          avec mes compétences techniques. Mes capacités artistiques sont le
          socle de mes collaborations avec les autres pôles, une alliance que je
          pense indispensable pour donner vie à des projets. J'ai la chance
          d'adorer mon métier et c'est un plaisir pour moi de partager avec vous
          ce que j'ai réalisé.
        </p>
        <div
          ref={paragraphRef}
          className="overflow-hidden h-0 opacity-0 flex flex-col gap-4"
        >
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
          <h4 className="text-sm mt-2 font-semibold">
            Quelques point sur moi :
          </h4>
          <ul className="list-disc pl-4 text-sm">
            <li>
              Diplômée en Game Design concepteur en gamification (2020-2023)
            </li>
            <li>
              Fable The Lost Chapter, Titanfall 2, Ori and The Will Of The
              Wisps, Apex Legends, Baldur's Gate 3 sont mes jeux préférés.
            </li>
            <li>
              J'Autodidacte dans le dessin depuis plus de 15 ans, je fais du
              réalisme ainsi que du semi-réaliste très sombre.
            </li>
            <li>
              J'Pianiste depuis plus de 10 ans, je joue également de la guitare,
              du ukulélé et je chante également.
            </li>
            <li>
              J'Créatrice de pleins d'univers de Role Play sur Discord mais
              également Maître du jeu.
            </li>
          </ul>
        </div>
        <div
          className="flex items-center flex-col hover:bg-black2 hover:text-primary transition-all duration-300 rounded-lg p-4 cursor-pointer"
          onClick={handleToggleParagraph}
        >
          <p className="text-sm">
            {showParagraph ? "En voir moins" : "En voir plus"}
          </p>
          <ChevronDown
            size={24}
            className={`${showParagraph && "rotate-180"} transition-transform duration-300`}
          />
        </div>
      </div>
      {/* <div className="flex items-center justify-between w-full">
        <div>
          <Button label="Télécharger mon CV" size="sm" onClick={() => {}} />
        </div>
        <div className="flex items-center gap-4">
          <h3 className="text-sm font-semibold">Mes réseaux sociaux :</h3>
          <LinksIcons />
        </div>
      </div> */}
    </div>
  );
};

export default BentoAbout;
