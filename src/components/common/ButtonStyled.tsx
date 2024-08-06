import Icon, { IconProps } from "./Icon";
import "../../styles/button-styled.css";

interface ButtonStyledProps {
  label: string;
  icon: IconProps;
}

const ButtonStyled = ({ label, icon }: ButtonStyledProps) => {
  return (
    <button className="button-styled">
      <span className="text-sm">
        <Icon {...icon} />
      </span>
      <p>{label}</p>
    </button>
  );
};

export default ButtonStyled;
