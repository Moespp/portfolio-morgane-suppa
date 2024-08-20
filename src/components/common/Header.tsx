import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ButtonStyled from "./ButtonStyled";

const Header = () => {
  const [IsMobile, setIsMobile] = useState(window.innerWidth > 768);
  const { i18n } = useTranslation();

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

  const toggleLanguage = () => {
    const newLanguage = i18n.language === "fr" ? "en" : "fr";
    i18n.changeLanguage(newLanguage);
  };

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
        <button
          onClick={toggleLanguage}
          className="text-sm font-semibold leading-6 text-black hover:text-primary transition-all duration-300 "
        >
          {i18n.language === "fr" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 32 32"
            >
              <path fill="#fff" d="M10 4H22V28H10z"></path>
              <path
                d="M5,4h6V28H5c-2.208,0-4-1.792-4-4V8c0-2.208,1.792-4,4-4Z"
                fill="#092050"
              ></path>
              <path
                d="M25,4h6V28h-6c-2.208,0-4-1.792-4-4V8c0-2.208,1.792-4,4-4Z"
                transform="rotate(180 26 16)"
                fill="#be2a2c"
              ></path>
              <path
                d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z"
                opacity=".15"
              ></path>
              <path
                d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z"
                fill="#fff"
                opacity=".2"
              ></path>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 32 32"
            >
              <rect
                x="1"
                y="4"
                width="30"
                height="24"
                rx="4"
                ry="4"
                fill="#fff"
              ></rect>
              <path
                fill="#be2a2a"
                d="M31 14L18 14 18 4 14 4 14 14 1 14 1 18 14 18 14 28 18 28 18 18 31 18 31 14z"
              ></path>
              <path
                d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z"
                opacity=".15"
              ></path>
              <path
                d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z"
                fill="#fff"
                opacity=".2"
              ></path>
            </svg>
          )}
        </button>
        {IsMobile ? (
          <ButtonStyled
            onClick={() => window.open("mailto:morgane.suppa.pro@gmail.com")}
            label="Contact"
          />
        ) : null}

        {/* Button pour changer de langue */}
      </div>
    </header>
  );
};

export default Header;
