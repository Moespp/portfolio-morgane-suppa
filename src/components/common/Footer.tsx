import LinksIcons from "./LinksIcons";

const Footer = () => {
  return (
    <footer className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8 bg-white">
      <p className="text-sm font-semibold leading-6 text-black">
        © 2023 Morgane Suppa
      </p>

      <LinksIcons />
    </footer>
  );
};

export default Footer;
