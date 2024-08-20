import { Link } from "react-router-dom";
import LinksIcons from "./LinksIcons";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

const Footer = () => {
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(window.innerWidth > 768);

  useEffect(() => {
    window.addEventListener("resize", () => {
      setIsMobile(window.innerWidth > 768);
    });

    return () => {
      window.removeEventListener("resize", () => {
        setIsMobile(window.innerWidth > 768);
      });
    };
  }, []);

  return (
    <footer className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8 bg-white">
      <div className="flex flex-col sm:flex-row sm:gap-4 gap-1">
        <p className="text-sm font-semibold leading-6 text-black">
          © 2024 Morgane Suppa
        </p>
        {!isMobile ? null : <p>-</p>}
        <Link
          to="/legal-mentions"
          className="text-sm font-semibold leading-6 text-black hover:text-primary transition-all duration-300"
        >
          {t("legalMention.title")}
        </Link>
      </div>

      <LinksIcons />
    </footer>
  );
};

export default Footer;
