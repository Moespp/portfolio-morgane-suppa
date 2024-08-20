import React from "react";
import * as Icons from "lucide-react";

export type IconProps = {
  name: keyof typeof Icons;
  color?: string;
  size?: number;
  ref?: React.Ref<SVGSVGElement>;
  className?: string;
};

const Icon = ({
  name,
  color = "currentColor",
  size = 24,
  ref,
  className,
}: IconProps): JSX.Element | null => {
  const LucideIcon = Icons[name] as React.ElementType;

  if (!LucideIcon) {
    console.warn(`Icone ${name} non trouvée dans Lucide Icons`);
    return null;
  }

  return (
    <LucideIcon color={color} size={size} ref={ref} className={className} />
  );
};

export default Icon;
