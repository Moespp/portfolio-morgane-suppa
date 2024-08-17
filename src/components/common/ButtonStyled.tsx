import Icon, { IconProps } from "./Icon";
import "../../styles/button-styled.css";

interface ButtonStyledProps {
  label: string;
  icon: IconProps;
  onClick?: () => void;
}

const ButtonStyled = ({ label, icon, onClick }: ButtonStyledProps) => {
  return (
    <button className="button-styled" onClick={onClick}>
      <span className="text-sm">
        <Icon {...icon} />
      </span>
      <p>{label}</p>
    </button>
  );
};

export default ButtonStyled;
