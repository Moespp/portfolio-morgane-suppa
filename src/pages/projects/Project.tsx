import { useParams } from "react-router";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import Hero from "../home/section/Hero";
import projects from "../../data/projects/DataProjects";
import Bento from "../../components/bentos/Bento";
import Badge from "../../components/common/Badge";
import { useTranslation } from "react-i18next";
import CardWithCarousel from "./section/cardWithCarousel";
import Title from "../../components/common/Title";
import { useEffect, useState } from "react";

const Project = () => {
  const { t } = useTranslation();

  const id = useParams().id;
  const project = projects.find((p) => p.id === id);
  const pageContent = project?.page;
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [widthVideo, setWidthVideo] = useState(window.innerWidth);
  const [heightVideo, setHeightVideo] = useState(widthVideo * 0.5625);
  // const heightVideo = widthVideo * 0.5625;

  useEffect(() => {
    window.addEventListener("resize", () => {
      setWidthVideo(window.innerWidth > 1500 ? 1500 : window.innerWidth);
      setHeightVideo(
        window.innerWidth > 1500 ? 1500 * 0.5625 : window.innerWidth * 0.5625
      );
      if (window.innerWidth < 768) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    });

    return () => {
      window.removeEventListener("resize", () => {
        setWidthVideo(window.innerWidth);
        setHeightVideo(widthVideo * 0.5625);
        if (window.innerWidth < 768) {
          setIsMobile(true);
        } else {
          setIsMobile(false);
        }
      });
    };
  }, [widthVideo]);

  const conceptionDesc = t("projects.noreya.conception.description", {
    returnObjects: true,
  }) as string[];

  const blockoutDesc = t("projects.noreya.blockout.description", {
    returnObjects: true,
  }) as string[];
  const renduDesc = t("projects.noreya.rendu.description", {
    returnObjects: true,
  }) as string[];

  return (
    <>
      <Header />
      <main className="flex flex-col gap-32 items-start justify-start bg-white pb-32">
        <Hero videoSrc={pageContent?.backgroundImage} className="items-start">
          <div className="max-w-[1500px] mx-auto w-full sm:px-10 flex flex-col gap-4 items-start justify-start">
            <Bento className="max-w-[700px]">
              <h1 className="text-4xl font-bold mb-2">{project?.title}</h1>
              <p>{project?.description}</p>
              <p>Moteur: {pageContent?.moteur}</p>
              <p>Outils: {pageContent?.tools}</p>
              <p>OS: {pageContent?.plateforme.join(", ")}</p>
            </Bento>
            <Bento
              className="w-full flex flex-row gap-4 items-start max-w-[700px]"
              row
            >
              {pageContent?.gameType.map((tag, index) => (
                <Badge
                  key={index}
                  text={tag}
                  color="bg-blue-500"
                  className="w-fit text-lg"
                />
              ))}
            </Bento>
          </div>
        </Hero>
        {/* Section vidéo youtube */}
        <section className="flex flex-col gap-4 items-center justify-center mx-auto">
          <iframe
            width={widthVideo > 1500 ? 1500 : widthVideo}
            height={heightVideo}
            className="px-4 sm:px-10 max-w-[1500px] mx-auto"
            src="https://www.youtube.com/embed/OWS6J3d5wi4"
            title="Noreya: The Gold Project - Release Trailer - Coming on June 21St to Steam"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          ></iframe>
        </section>

        <section className="flex flex-col md:gap-24 gap-12 items-start justify-start px-4 sm:px-10 max-w-[1500px] mx-auto">
          <CardWithCarousel
            title={t("projects.noreya.conception.title")}
            description={conceptionDesc}
            carouselImages={pageContent?.conceptionImage ?? []}
          />
          <CardWithCarousel
            title={t("projects.noreya.blockout.title")}
            description={blockoutDesc}
            carouselImages={pageContent?.blockoutImage ?? []}
            reverse
          />
          <CardWithCarousel
            title={t("projects.noreya.rendu.title")}
            description={renduDesc}
            carouselImages={pageContent?.renduImage ?? []}
          />
        </section>
        {/* section gameplay */}
        <section className="flex flex-col gap-4 items-center justify-start px-4 sm:px-10 max-w-[1500px] mx-auto">
          <Bento className="w-full md:w-fit text-center">
            <Title text={t("projects.noreya.gameplay.title")} />
          </Bento>
          <Bento className="w-fit items-center" row={!isMobile}>
            <div className="w-full md:w-1/2 h-fit">
              <h3 className="text-xl font-bold mb-2">
                {t("projects.noreya.gameplay.card4.title")}
              </h3>
              <p className="text-sm">
                {t("projects.noreya.gameplay.card4.description")}
              </p>
            </div>
            <img
              src={pageContent?.gameplayImageCard4}
              alt="gameplay"
              className="w-full md:w-1/2"
            />
          </Bento>
          <div className="flex flex-col gap-4 md:flex-row ">
            <Bento className="w-full md:w-1/2 h-fit">
              <img src={pageContent?.gameplayImageCard1} alt="gameplay" />
              <p className="text-sm">
                {t("projects.noreya.gameplay.card1.description")}
              </p>
            </Bento>
            <Bento className="w-full md:w-1/2 2 h-fit">
              <img src={pageContent?.gameplayImageCard2} alt="gameplay" />
              <p className="text-sm">
                {t("projects.noreya.gameplay.card2.description")}
              </p>
            </Bento>
            <Bento className="w-full md:w-1/2 2 h-fit">
              <img src={pageContent?.gameplayImageCard3} alt="gameplay" />
              <p className="text-sm">
                {t("projects.noreya.gameplay.card3.description")}
              </p>
            </Bento>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Project;
