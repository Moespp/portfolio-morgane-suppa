interface HeroProps {
  videoSrc: string | undefined;
  children: React.ReactNode;
  className?: string;
}

const Hero = ({ videoSrc, children, className }: HeroProps) => {
  return (
    <section
      className={`relative flex flex-col gap-4 justify-center w-full min-h-[100vh] px-4 py-24 ${className}`}
      id="Hero"
    >
      <img
        src={videoSrc}
        alt="about"
        className="absolute w-screen h-full top-0 left-0 object-cover"
      />
      {children}
    </section>
  );
};

export default Hero;
