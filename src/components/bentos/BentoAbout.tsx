import Button from "../common/Button";

const BentoAbout = () => {
  return (
    <div className="relative flex flex-col items-center justify-center max-w-[700px] gap-6 bg-white2 py-14 px-10 sm:px-6 lg:px-8 rounded-xl shadow-lg">
      {/* img fixed en haut */}
      <img
        src="./img/morgane.png"
        alt="about"
        // rounded immage 40px width and height
        className="w-[80px] h-[80px] rounded-full absolute top-0 left-1/2 right-1/2 -translate-x-1/2 -translate-y-1/2"
      />
      <h1 className="text-4xl font-extrabold">MORGANE SUPPA</h1>
      {/* separator */}
      <div className="w-24 h-[2px] bg-black" />
      <p className="text-sm">
        Depuis mes premiers pas, j'ai toujours été attirée par l'art et les
        jeux-vidéos. Le Level Design et la Narration furent immédiatement les
        spécialités où j'étais le plus à l'aise suivi du storytelling
        environnemental ainsi que le Level Art. Mon profil artistique fusionne
        avec mes compétences techniques. Mes capacités artistiques sont le socle
        de mes collaborations avec les autres pôles, une alliance que je pense
        indispensable pour donner vie à des projets. J'ai la chance d'adorer mon
        métier et c'est un plaisir pour moi de partager avec vous ce que j'ai
        réalisé.
      </p>
      <Button label="Voir plus" size="sm" onClick={() => {}} />
    </div>
  );
};

export default BentoAbout;
