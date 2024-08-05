import BentoAbout from "../../components/bentos/BentoAbout";
import Footer from "../../components/common/Footer";
import Header from "../../components/common/Header";
import Hero from "../../components/section/Hero";
import ListProjects from "../../components/section/ListProjects";

const Home = () => {
  return (
    <>
      <Header />
      <main className="flex flex-col items-center justify-center min-h-screen bg-white h-full">
        <Hero videoSrc="./img/project/noreya/IMG_0282.gif">
          <BentoAbout />
        </Hero>
        <ListProjects />
      </main>
      <Footer />
    </>
  );
};

export default Home;
