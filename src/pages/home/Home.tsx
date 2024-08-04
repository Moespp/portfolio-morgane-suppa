import BentoAbout from "../../components/bentos/BentoAbout";
import Footer from "../../components/common/Footer";
import Header from "../../components/common/Header";

const Home = () => {
  return (
    <>
      <Header />
      <main className="flex flex-col items-center justify-center min-h-screen px-4 py-12 sm:px-6 lg:px-8 bg-white">
        <h1>Home</h1>
        <BentoAbout />
      </main>
      <Footer />
    </>
  );
};

export default Home;
