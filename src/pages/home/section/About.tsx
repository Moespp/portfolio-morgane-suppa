import { useEffect, useState } from "react";
import Bento from "../../../components/bentos/Bento";
import LinksIcons from "../../../components/common/LinksIcons";
import Title from "../../../components/common/Title";
import { useTranslation } from "react-i18next";

const SectionAbout = () => {
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);

  const bento1Text = t("home.about.bento1", {
    returnObjects: true,
  }) as string[];

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

  const aboutText = t("home.about.bento2.content", {
    returnObjects: true,
  }) as string[];

  return (
    <section
      id="section-about"
      className="flex flex-col sm:gap-24 gap-8 items-center justify-center rounded-xl max-w-[1500px] mx-auto px-4 sm:px-10 sm:py-16 py-8"
    >
      {/* title about me */}
      <Title text={t("home.about.title")} />
      <div className="flex md:flex-row flex-col gap-4 w-full">
        <Bento className="flex flex-col justify-center gap-4 lg:w-1/2">
          <img
            src="./img/morgane.png"
            alt="about"
            className="w-[80px] h-[80px] rounded-full"
          />
          {Array.isArray(bento1Text) ? (
            bento1Text.map((text, index) => (
              <p key={index} className="text-sm">
                {text}
              </p>
            ))
          ) : (
            <p className="text-sm">Error</p>
          )}{" "}
        </Bento>
        <div className="flex flex-col items-center justify-center gap-4 lg:w-1/2">
          <Bento className="h-full">
            <h2 className="text-xl font-semibold">
              {t("home.about.bento2.title")}
            </h2>
            <ul className="list-disc pl-4 flex flex-col gap-2 text-sm">
              {Array.isArray(aboutText) ? (
                aboutText.map((text, index) => <li key={index}>{text}</li>)
              ) : (
                <p className="text-sm">Error</p>
              )}
            </ul>
          </Bento>
          <Bento
            row={!isMobile ? true : false}
            className="w-full gap-4 item-center justify-center"
          >
            <div className="flex flex-row gap-4 w-full items-center justify-between">
              <p className="text-sm font-semibold">
                {t("home.about.bento2.link")}
              </p>
              <LinksIcons />
            </div>
          </Bento>
        </div>
      </div>
    </section>
  );
};

export default SectionAbout;
