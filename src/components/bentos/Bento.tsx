// create bento component

interface BentoProps {
  children: React.ReactNode;
  className?: string;
  row?: boolean;
}

const Bento = ({ children, className, row }: BentoProps) => {
  return (
    <div
      className={`flex ${row ? "flex-row justify-start" : "flex-col justify-center"} gap-4 px-4 py-6 sm:px-6 bg-white2 rounded-xl shadow-lg ${
        className || ""
      }`}
    >
      {children}
    </div>
  );
};

export default Bento;
