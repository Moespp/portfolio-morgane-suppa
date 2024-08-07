import { useParams } from "react-router";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";

const Project = () => {
  // récupérer l'id de l'url
  const id = useParams().id;

  return (
    <>
      <Header />
      <div>
        <h1>Project {id}</h1>
      </div>
      <Footer />
    </>
  );
};

export default Project;
