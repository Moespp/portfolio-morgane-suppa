import { useTranslation } from "react-i18next";
import BentoAbout from "../../components/bentos/BentoAbout";
import ButtonStyled from "../../components/common/ButtonStyled";
import Footer from "../../components/common/Footer";
import Header from "../../components/common/Header";
import SectionAbout from "./section/About";
import Hero from "./section/Hero";
import ListProjects from "./section/ListProjects";
import Modal from "react-modal";
import { useEffect, useState } from "react";
import PdfViewer from "../../components/pdf/PdfViewer";
import ArrowToTop from "../../components/common/ArrowToTop";

const Home = () => {
  const { t } = useTranslation();
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const dowloadPdf = () => {
    window.open("./pdf/Morgane_Suppa_CV.pdf");
  };

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

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
              label={t("home.hero.visualization")}
              icon={{ name: "Eye", size: 24 }}
              onClick={openModal}
              className="w-full"
            />
            <ButtonStyled
              label={t("home.hero.contact")}
              icon={{ name: "Mail", size: 24 }}
              onClick={() => window.open("mailto:morgane.suppa.pro@gmail.com")}
              className="w-full"
            />
          </div>
        </Hero>
        <ArrowToTop />
        <SectionAbout />
        <ListProjects />
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          className={
            "bg-white2 rounded-lg border-2 border-gray-200 shadow-lg px-8 py-6 w-fit flex flex-col gap-8 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          }
        >
          <PdfViewer fileUrl="./pdf/Morgane_Suppa_CV.pdf" />
          {/* Button télécharger le CV */}
          <div className="flex justify-center gap-8">
            <ButtonStyled
              label={t("home.hero.dowload")}
              icon={{ name: "Download", size: 24 }}
              onClick={dowloadPdf}
            />
            <ButtonStyled
              label={t("common.close")}
              icon={{ name: "X", size: 24 }}
              onClick={closeModal}
            />
          </div>
        </Modal>
      </main>
      <Footer />
    </>
  );
};

export default Home;
