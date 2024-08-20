// page legal mentions

import { useTranslation } from "react-i18next";
import ButtonStyled from "../../components/common/ButtonStyled";
import { useNavigate } from "react-router";

const LegalMention = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const hebergementContent = t("legalMention.hebergement.content", {
    returnObjects: true,
  }) as string[];
  const creationContent = t("legalMention.creation.content", {
    returnObjects: true,
  }) as string[];

  return (
    <main className="flex flex-col gap-12 max-w-[1500px] mx-auto w-full px-8 py-12">
      <div className="flex flex-col gap-4">
        <ButtonStyled
          label={t("common.back")}
          icon={{ name: "ArrowLeft", size: 24 }}
          onClick={() => navigate("/")}
          className="w-fit"
        />
        <h1 className="sm:text-4xl text-2xl font-bold">
          {t("legalMention.title")}
        </h1>
      </div>
      <div className="flex flex-col gap-8">
        {/* {content} */}
        <div className="flex flex-col gap-4">
          <h3 className="sm:text-2xl text-xl font-bold">
            {t("legalMention.hebergement.title")}
          </h3>
          <ul className="flex flex-col gap-2">
            {hebergementContent.map((content, index) => (
              <li key={index}>{content}</li>
            ))}
          </ul>
          <a
            href="https://www.hostinger.fr/"
            target="_blank"
            rel="noreferrer"
            className="text-primary hover:underline"
          >
            Hostinger
          </a>
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="sm:text-2xl text-xl font-bold">
            {t("legalMention.creation.title")}
          </h3>
          <ul className="flex flex-col gap-2">
            {creationContent.map((content, index) => (
              <li key={index}>{content}</li>
            ))}
          </ul>
          <a
            href={"https://www.alexymartinetprod.com/"}
            target="_blank"
            rel="noreferrer"
            className="text-primary hover:underline"
          >
            {t("legalMention.creation.link")}
          </a>
        </div>
      </div>
    </main>
  );
};

export default LegalMention;
