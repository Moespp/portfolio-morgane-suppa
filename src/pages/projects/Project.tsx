import { useParams } from "react-router";

const Project = () => {
  // récupérer l'id de l'url
  const id = useParams().id;

  return (
    <div>
      <h1>Project {id}</h1>
    </div>
  );
};

export default Project;
