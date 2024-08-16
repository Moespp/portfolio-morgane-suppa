interface TitleProps {
  text: string;
  className?: string;
}

const Title = ({ text, className }: TitleProps) => {
  return (
    <h1 className={`sm:text-4xl text-xl font-extrabold ${className}`}>
      ･━━━･ {text} ･━━━･
    </h1>
  );
};

export default Title;
