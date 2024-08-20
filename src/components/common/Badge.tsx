interface BadgeProps {
  text: string;
  color: string;
  className?: string;
}

const Badge = ({ text, color, className }: BadgeProps) => {
  return (
    <div
      className={`badge ${color} text-xs font-semibold rounded-full px-2 py-1 text-white ${className}`}
    >
      {text}
    </div>
  );
};

export default Badge;
