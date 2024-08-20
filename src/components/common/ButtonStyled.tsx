import Icon, { IconProps } from "./Icon";
import "../../styles/button-styled.css";

interface ButtonStyledProps {
  label: string;
  icon?: IconProps;
  onClick?: () => void;
  className?: string;
}

const ButtonStyled = ({
  label,
  icon,
  onClick,
  className,
}: ButtonStyledProps) => {
  return (
    <button className={`button-styled ${className}`} onClick={onClick}>
      {icon && (
        <span className="text-sm">
          <Icon {...icon} />
        </span>
      )}
      <p>{label}</p>
    </button>
  );
};

export default ButtonStyled;
