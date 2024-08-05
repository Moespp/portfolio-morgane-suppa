interface TitleProps {
  text: string;
}

const Title = ({ text }: TitleProps) => {
  return <h1 className="text-4xl font-extrabold">･━━━━･ {text} ･━━━━･</h1>;
};

export default Title;
