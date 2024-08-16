import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";

const BentoAbout = () => {
  const { t } = useTranslation();

  const handleToggleParagraph = () => {
    document.getElementById("section-about")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-center sm:gap-6 gap-4 bg-white2 pt-14 px-6 sm:px-10 pb-4 rounded-xl shadow-lg`}
    >
      <img
        src="./img/morgane.png"
        alt="about"
        className="w-[80px] h-[80px] rounded-full absolute top-0 left-1/2 right-1/2 -translate-x-1/2 -translate-y-1/2"
      />
      <h1 className="sm:text-4xl text-2xl font-extrabold text-center">
        {t("home.hero.title")}
      </h1>
      <div className="w-24 h-[2px] bg-black" />
      <div className="flex flex-col gap-4">
        <p className="text-sm">{t("home.hero.description")}</p>
        <div
          className="flex items-center flex-col hover:bg-black2 hover:text-primary transition-all duration-300 rounded-lg p-4 cursor-pointer"
          onClick={handleToggleParagraph}
        >
          <p className="text-sm">{t("home.hero.more")}</p>
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
