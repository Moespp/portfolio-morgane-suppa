import Title from "../../../components/common/Title";
import projects from "../../../data/projects/DataProjects";
import CardProject from "../../../components/card/CardProject";

const ListProjects = () => {
  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-[1500px] mx-auto sm:px-8 px-4">
      <Title text="Mes projets" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        {projects.map((project) => (
          <CardProject
            key={project.id}
            id={project.id}
            title={project.title}
            image={project.img}
            tags={project.tags}
            type={project.type}
          />
        ))}
      </div>
    </div>
  );
};

export default ListProjects;
