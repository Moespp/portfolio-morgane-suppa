interface HeroProps {
  videoSrc: string | undefined;
  children: React.ReactNode;
  className?: string;
}

const Hero = ({ videoSrc, children, className }: HeroProps) => {
  return (
    <section
      className={`relative flex flex-col gap-4 justify-center w-full min-h-[100vh] h-full px-4 ${className}`}
    >
      <img
        src={videoSrc}
        alt="about"
        className="absolute w-screen h-screen top-0 left-0 object-cover"
      />
      {children}
    </section>
  );
};

export default Hero;
