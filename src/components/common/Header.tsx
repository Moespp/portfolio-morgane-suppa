import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ButtonStyled from "./ButtonStyled";

const Header = () => {
  const [IsMobile, setIsMobile] = useState(window.innerWidth > 768);

  const handleResize = () => {
    setIsMobile(window.innerWidth > 768);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const clickLogo = useCallback(() => {
    const page = window.location.pathname;
    if (page === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.location.href = "/";
    }
  }, []);

  const goToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
      <h1
        className="sm:text-2xl text-xl font-extrabold leading-7 text-black uppercase"
        onClick={() => clickLogo()}
      >
        Morgane Suppa
      </h1>

      <div className="flex items-center gap-4">
        <Link
          to="/"
          onClick={() => goToTop()}
          className="text-sm font-semibold leading-6 text-black hover:text-primary transition-all duration-300"
        >
          Acceuil
        </Link>
        {IsMobile ? (
          <ButtonStyled
            onClick={() => window.open("mailto:morgane.suppa.pro@gmail.com")}
            label="Contact"
          />
        ) : null}
      </div>
    </header>
  );
};

export default Header;
