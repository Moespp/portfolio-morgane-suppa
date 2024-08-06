import "../../styles/card-project.css";
import Badge from "../common/Badge";

interface CardProjectProps {
  id: string;
  title: string;
  image: string;
  tags: string[];
  type: "Pro" | "Perso";
}

const CardProject = ({ title, image, tags, type }: CardProjectProps) => {
  return (
    <div className="card-project">
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
    </div>
  );
};

export default CardProject;
