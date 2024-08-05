const ListProjects = () => {
  return (
    <div className="flex flex-col gap-4 w-full max-w-[1200px] mx-auto">
      <h2 className="text-4xl font-extrabold text-center">Mes projets</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-semibold">
            <a
              href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              target="_blank"
              rel="noreferrer"
            >
              YouTube
            </a>
          </h3>
          <p className="text-sm"> </p>
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-semibold">
            <a
              href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              target="_blank"
              rel="noreferrer"
            >
              YouTube
            </a>
          </h3>
          <p className="text-sm"> </p>
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-semibold">
            <a
              href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              target="_blank"
              rel="noreferrer"
            >
              YouTube
            </a>
          </h3>
          <p className="text-sm"> </p>
        </div>
      </div>
    </div>
  );
};

export default ListProjects;
