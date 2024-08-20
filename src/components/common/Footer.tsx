import { Link } from "react-router-dom";
import LinksIcons from "./LinksIcons";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8 bg-white">
      <div className="flex gap-4">
        {/* legal mentions */}
        <Link
          to="/legal-mentions"
          className="text-sm font-semibold leading-6 text-black hover:text-primary transition-all duration-300"
        >
          Mentions légales
        </Link>
        <p className="text-sm font-semibold leading-6 text-black">
          © 2023 Morgane Suppa
        </p>
      </div>

      <LinksIcons />
    </footer>
  );
};

export default Footer;
