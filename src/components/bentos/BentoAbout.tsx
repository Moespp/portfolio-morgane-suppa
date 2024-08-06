import { ChevronDown } from "lucide-react";

const BentoAbout = () => {
  const handleToggleParagraph = () => {
    document.getElementById("section-about")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-center gap-6 bg-white2 pt-14 px-6 sm:px-10 pb-4 rounded-xl shadow-lg`}
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
          className="flex items-center flex-col hover:bg-black2 hover:text-primary transition-all duration-300 rounded-lg p-4 cursor-pointer"
          onClick={handleToggleParagraph}
        >
          <p className="text-sm">En savoir voir plus</p>
          <ChevronDown
            size={24}
            className={`transition-transform duration-300`}
          />
        </div>
      </div>
    </div>
  );
};

export default BentoAbout;
