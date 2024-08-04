const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-extrabold leading-7 text-black uppercase">
        Morgane Suppa
      </h1>

      <div className="flex items-center gap-4">
        <a
          href="#"
          className="text-sm font-semibold leading-6 text-black hover:text-primary transition-all duration-300"
        >
          About
        </a>
        <a
          href="#"
          className="text-sm font-semibold leading-6 text-black hover:text-primary transition-all duration-300"
        >
          Projects
        </a>
        <a
          href="#"
          className="text-sm font-semibold leading-6 text-black hover:text-primary transition-all duration-300"
        >
          Contact
        </a>
      </div>
    </header>
  );
};

export default Header;
