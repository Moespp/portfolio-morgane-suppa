interface TitleProps {
  text: string;
}

const Title = ({ text }: TitleProps) => {
  return (
    <h1 className="sm:text-4xl text-xl font-extrabold">･━━━･ {text} ･━━━･</h1>
  );
};

export default Title;
