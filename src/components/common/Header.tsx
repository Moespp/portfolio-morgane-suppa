import { useCallback } from "react";
import Button from "./Button";

const Header = () => {
  const clickLogo = useCallback(() => {
    const page = window.location.pathname;
    if (page === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.location.href = "/";
    }
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
      <h1
        className="sm:text-2xl text-xl font-extrabold leading-7 text-black uppercase"
        onClick={() => clickLogo()}
      >
        Morgane Suppa
      </h1>

      <div className="flex items-center gap-4">
        <a
          href="#"
          className="text-sm font-semibold leading-6 text-black hover:text-primary transition-all duration-300"
        >
          Acceuil
        </a>
        <Button
          onClick={() => {
            // sendmail
          }}
          label="Contact"
        />
      </div>
    </header>
  );
};

export default Header;
