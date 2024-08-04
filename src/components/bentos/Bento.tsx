// create bento component

interface BentoProps {
  children: React.ReactNode;
}

const Bento = ({ children }: BentoProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 sm:px-6 lg:px-8 bg-white text-black">
      {children}
    </div>
  );
};

export default Bento;
