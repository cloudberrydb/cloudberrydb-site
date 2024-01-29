import Card from "../Card";
interface IProps {
  link: {
    text: string;
    href: string;
  };
  content?: string;
  title?: string;
  style?: React.CSSProperties;
}
export default function CardLine({ cardLine }: { cardLine: IProps[] }) {
  return cardLine.map((card, i) => {
    return <Card key={i} {...card}></Card>;
  });
}
