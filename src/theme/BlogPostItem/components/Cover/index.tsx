import { useBlogPost } from "@docusaurus/theme-common/internal";
import useBaseUrl from "@docusaurus/useBaseUrl";
interface IProps {
  style?: React.CSSProperties;
  onClick?: () => void;
}
export default function Cover(props: IProps) {
  const { metadata } = useBlogPost();

  return (
    <img
      style={{
        width: "100%",
        cursor: "pointer",
        ...props.style,
      }}
      onClick={props.onClick}
      src={useBaseUrl(metadata.frontMatter.image)}
      alt=""
    />
  );
}
