import { useTranslation } from "react-i18next";
import BentoAbout from "../../components/bentos/BentoAbout";
import ButtonStyled from "../../components/common/ButtonStyled";
import Footer from "../../components/common/Footer";
import Header from "../../components/common/Header";
import SectionAbout from "./section/About";
import Hero from "./section/Hero";
import ListProjects from "./section/ListProjects";

const Home = () => {
  const { t } = useTranslation();
  return (
    <>
      <Header />
      <main className="flex flex-col items-center justify-center min-h-screen bg-white h-full">
        <Hero
          videoSrc="./img/project/noreya/IMG_0282.gif"
          className="items-center"
        >
          <div className="max-w-[700px] px-4 flex flex-col gap-4 items-center justify-center">
            <BentoAbout />
            <ButtonStyled
              label={t("home.hero.dowload")}
              icon={{ name: "Download", size: 24 }}
            />
            <ButtonStyled
              label={t("home.hero.contact")}
              icon={{ name: "Mail", size: 24 }}
            />
          </div>
        </Hero>
        <SectionAbout />
        <ListProjects />
      </main>
      <Footer />
    </>
  );
};

export default Home;
