import { useRef } from "react";
import Icon, { IconProps } from "./Icon";

type ButtonProps = {
  theme?: "fill" | "outline";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  label: string;
  type?: "button" | "submit" | "reset";
  onClick: () => void;
  className?: string;
  firstIcon?: IconProps;
  secondIcon?: IconProps;
};

const Button = ({
  theme = "fill",
  size = "md",
  disabled = false,
  label,
  type = "button",
  onClick,
  className = "",
  firstIcon,
  secondIcon,
}: ButtonProps) => {
  const getSizeClass = () => {
    if (window.innerWidth < 640) return "text-sm px-2 py-1";
    else if (window.innerWidth < 1024) return "text-md px-3 py-2";
    return {
      sm: "text-sm px-2 py-1",
      md: "text-md px-3 py-2",
      lg: "text-lg px-4 py-3",
    }[size];
  };

  const getThemeClass = () => {
    return {
      fill: "bg-button-fill-default text-button-fill-text hover:bg-button-fill-hover",
      outline:
        "border border-button-outline-default text-button-outline-text hover:bg-button-outline-hover",
    }[theme];
  };

  const iconSpan = (iconProps: IconProps, margin: string) => (
    <span className={margin}>
      <Icon {...iconProps} />
    </span>
  );

  return (
    <button
      className={`flex w-fit font-bold items-center gap-2 px-4 py-2 rounded-md ${getSizeClass()} ${getThemeClass()} ${className}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {firstIcon && iconSpan(firstIcon, "")}
      <p>{label}</p>
      {secondIcon && iconSpan(secondIcon, "")}
    </button>
  );
};

export default Button;
