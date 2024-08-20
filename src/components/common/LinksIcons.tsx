import { LucideLinkedin, Twitter } from "lucide-react";

const LinksIcons = () => {
  return (
    <div className="flex items-center gap-4">
      <a
        href="https://x.com/GameDesign_Moe"
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-semibold text-black hover:text-primary transition-all duration-300"
      >
        <Twitter />
      </a>
      <a
        href="https://www.artstation.com/moespp"
        className="text-sm font-semibold hover:[&>*]:stroke-primary [&>*]:transition-all [&>*]:duration-300"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg
          fill="none"
          stroke="#202020"
          strokeWidth={2}
          width="24px"
          height="24px"
          viewBox="0 0 28 28"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0 17.723l2.027 3.505h.001a2.424 2.424 0 0 0 2.164 1.333h13.457l-2.792-4.838H0zm24 .025c0-.484-.143-.935-.388-1.314L15.728 2.728a2.424 2.424 0 0 0-2.142-1.289H9.419L21.598 22.54l1.92-3.325c.378-.637.482-.919.482-1.467zm-11.129-3.462L7.428 4.858l-5.444 9.428h10.887z" />
        </svg>
      </a>
      <a
        href="https://www.linkedin.com/in/morgane-suppa/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-semibold text-black hover:text-primary transition-all duration-300"
      >
        <LucideLinkedin />
      </a>
    </div>
  );
};

export default LinksIcons;
