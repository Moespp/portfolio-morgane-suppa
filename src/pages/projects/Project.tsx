import { useNavigate, useParams } from "react-router";
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
import ButtonStyled from "../../components/common/ButtonStyled";
import { Link } from "react-router-dom";
import Icon from "../../components/common/Icon";

const stringToNumber = (str: string): number => parseInt(str, 10);

const Project = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const project = projects.find((p) => p.id === id);

  const projectIdNumber = stringToNumber(id ?? "0");

  const totalProjects = projects.length;

  // Find the next valid project
  const getNextValidProject = (currentId: number) => {
    let nextId = currentId;
    for (let i = 0; i < totalProjects; i++) {
      nextId = (nextId % totalProjects) + 1;
      const nextProject = projects.find((p) => p.id === nextId.toString());
      if (nextProject && !nextProject.externalLink) {
        return nextProject;
      }
    }
    return null; // Return null if no valid next project is found
  };

  const nextProject = getNextValidProject(projectIdNumber);

  const pageContent = project?.page;

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [widthVideo, setWidthVideo] = useState(window.innerWidth);
  const [heightVideo, setHeightVideo] = useState(widthVideo * 0.5625);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const handleResize = () => {
    const newWidth = window.innerWidth > 1500 ? 1500 : window.innerWidth;
    setWidthVideo(newWidth);
    setHeightVideo(newWidth * 0.5625);
    setIsMobile(window.innerWidth < 768);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Chemin de traduction
  const translateProjectPath = `${project?.translation}`;

  // Affichage des chemins pour débogage
  console.log("translateProjectPath:", translateProjectPath);
  console.log(
    "Conception path:",
    `${translateProjectPath}.conception.description`
  );

  const conceptionDesc = t(`${translateProjectPath}.conception.description`, {
    returnObjects: true,
  }) as string[];
  const blockoutDesc = t(`${translateProjectPath}.blockout.description`, {
    returnObjects: true,
  }) as string[];
  const renduDesc = t(`${translateProjectPath}.rendu.description`, {
    returnObjects: true,
  }) as string[];

  return (
    <>
      <Header />
      <main className="flex flex-col gap-32 items-start justify-start bg-white pb-32">
        <Hero videoSrc={pageContent?.backgroundImage} className="items-start">
          <div className="max-w-[1500px] mx-auto w-full sm:px-10 flex flex-col gap-4 items-start justify-start">
            {/* bento avec button retour  */}

            <ButtonStyled
              label={t("common.back")}
              icon={{ name: "ArrowLeft", size: 24 }}
              onClick={() => navigate("/")}
            />

            <Bento className="max-w-[700px]">
              <h1 className="text-4xl font-bold mb-2">{project?.title}</h1>
              <p>{t(`${translateProjectPath}.hero.description`)}</p>
              <p>{t(`${translateProjectPath}.hero.works`)}</p>
              <p>Moteur: {pageContent?.moteur}</p>
              <p>Outils: {pageContent?.tools}</p>
              <p>OS: {pageContent?.plateforme.join(", ")}</p>
            </Bento>
            <Bento
              className="w-full flex flex-wrap gap-4 items-start max-w-[700px]"
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
        <section className="flex flex-col gap-4 items-center justify-center mx-auto">
          <Title text={t(`projects.sectionTitle.trailer`)} className="mb-12" />
          <iframe
            width={widthVideo > 1500 ? 1500 : widthVideo}
            height={heightVideo}
            className="px-4 sm:px-10 max-w-[1500px] mx-auto"
            src={pageContent?.video}
            title="Noreya: The Gold Project - Release Trailer - Coming on June 21St to Steam"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          ></iframe>
        </section>

        <section className="flex flex-col md:gap-24 gap-12 items-start justify-start px-4 sm:px-10 max-w-[1500px] mx-auto">
          <Title
            text={t("projects.sectionTitle.about")}
            className="mb-12 mx-auto"
          />
          <CardWithCarousel
            title={t(`${translateProjectPath}.conception.title`)}
            description={conceptionDesc}
            carouselImages={pageContent?.conceptionImage ?? []}
          />
          <CardWithCarousel
            title={t(`${translateProjectPath}.blockout.title`)}
            description={blockoutDesc}
            carouselImages={pageContent?.blockoutImage ?? []}
            reverse
          />
          <CardWithCarousel
            title={t(`${translateProjectPath}.rendu.title`)}
            description={renduDesc}
            carouselImages={pageContent?.renduImage ?? []}
          />
        </section>

        <section className="flex flex-col gap-4 items-center justify-start px-4 sm:px-10 max-w-[1500px] mx-auto">
          <Title text={t(`projects.sectionTitle.gameplay`)} className="mb-12" />
          <Bento className="w-fit items-center" row={!isMobile}>
            <div className="w-full md:w-1/2 h-fit">
              <h3 className="text-xl font-bold mb-2">
                {t(`${translateProjectPath}.gameplay.card4.title`)}
              </h3>
              <p className="text-sm">
                {t(`${translateProjectPath}.gameplay.card4.description`)}
              </p>
            </div>
            <img
              src={pageContent?.gameplayImageCard4}
              alt="gameplay"
              className="w-full md:w-1/2"
            />
          </Bento>
          <div className="flex flex-col gap-4 md:flex-row">
            <Bento className="w-full md:w-1/2 h-fit">
              <img src={pageContent?.gameplayImageCard1} alt="gameplay" />
              <p className="text-sm">
                {t(`${translateProjectPath}.gameplay.card1.description`)}
              </p>
            </Bento>
            <Bento className="w-full md:w-1/2 h-fit">
              <img src={pageContent?.gameplayImageCard2} alt="gameplay" />
              <p className="text-sm">
                {t(`${translateProjectPath}.gameplay.card2.description`)}
              </p>
            </Bento>
            <Bento className="w-full md:w-1/2 h-fit">
              <img src={pageContent?.gameplayImageCard3} alt="gameplay" />
              <p className="text-sm">
                {t(`${translateProjectPath}.gameplay.card3.description`)}
              </p>
            </Bento>
          </div>
        </section>
        <section className="flex flex-col gap-24 justify-start px-4 sm:px-10 max-w-[700px] w-full">
          {/* projet suivant */}
          <div>
            <h3 className="sm:text-xl text-lg font-bold mb-2">
              {t("projects.next_project")}
            </h3>
            <Link
              to={`/project/${nextProject?.id}`}
              className="w-fit flex gap-4 items-end hover:gap-8 [&>svg]:hover:rotate-0 transition-all duration-300"
            >
              <h2 className="text-2xl sm:text-4xl font-semibold">
                {nextProject?.title}
              </h2>
              <Icon
                name="ArrowRight"
                size={32}
                className="-rotate-45 transition-all duration-300"
              />
              {/* ArrowRight */}
            </Link>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="sm:text-4xl text-2xl font-bold m-0">
              {t("projects.collaborate.title")}
            </h3>
            {/* separator */}
            <div className="w-full h-[1px] bg-black"></div>
            <p className="">{t("projects.collaborate.description")}</p>
            <ButtonStyled
              label={t("common.contact")}
              icon={{ name: "Mail", size: 24 }}
              onClick={() => window.open("mailto:morgane.suppa.pro@gmail.com")}
              className="w-fit mt-4"
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Project;
