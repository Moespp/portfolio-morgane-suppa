import { TagDTO } from "../../data/projects/InterfacesProjects";
import "../../styles/card-project.css";
import Badge from "../common/Badge";
import { Link } from "react-router-dom";

interface CardProjectProps {
  id: string;
  title: string;
  image: string;
  tags: TagDTO[];
  type: "Pro" | "Perso";
  externalLink?: string;
}

const CardProject = ({
  id,
  title,
  image,
  tags,
  type,
  externalLink,
}: CardProjectProps) => {
  const link = externalLink ? externalLink : `/project/${id}`;

  return (
    <Link
      className="card-project justify-self-center	w-full"
      to={link}
      target={`${externalLink ? "_blank" : ""}`}
    >
      <img
        src={image}
        alt="illustration du projet"
        className="card-project__img"
      />
      <div className="card-project__content">
        <div className="flex flex-wrap gap-2 items-center">
          <Badge text={type} color="bg-black" className="w-min uppercase" />
          {tags.map((tag) => (
            <Badge key={tag} text={tag} color="bg-red" />
          ))}
        </div>
        <h2 className="text-2xl font-semibold">{title}</h2>
      </div>
    </Link>
  );
};

export default CardProject;
