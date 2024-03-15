import Card from "../Card";
interface IProps {
  cardLine: {
    link: {
      text: string;
      href: string;
    };
    content?: string;
    title?: string;
    style?: React.CSSProperties;
  }[];
  itemWidth?: number | string;
}
export default function CardLine({ cardLine, itemWidth }: IProps) {
  return cardLine.map((card, i) => {
    return <Card key={i} {...card} style={{ width: itemWidth }}></Card>;
  });
}
