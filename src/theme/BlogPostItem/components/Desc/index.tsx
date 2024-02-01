import { useBlogPost } from "@docusaurus/theme-common/internal";
export default function Desc({ style }: { style?: React.CSSProperties }) {
  const { metadata } = useBlogPost();
  return (
    <div
      className="two-lines-ellipsis"
      style={{ color: "var(--sub-text-color-2)", lineHeight: "26px", ...style }}
    >
      {metadata.description}
    </div>
  );
}
