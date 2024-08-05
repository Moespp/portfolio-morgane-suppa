interface HeroProps {
  videoSrc: string;
  children: React.ReactNode;
}

const Hero = ({ videoSrc, children }: HeroProps) => {
  return (
    <div className="relative flex flex-col justify-center items-center w-full min-h-[100vh] h-full px-4">
      <img
        src={videoSrc}
        alt="about"
        className="absolute w-screen h-screen top-0 left-0 object-cover"
      />
      {children}
    </div>
  );
};

export default Hero;
