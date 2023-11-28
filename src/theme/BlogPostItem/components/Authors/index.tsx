import { useBlogPost } from "@docusaurus/theme-common/internal";
import useBaseUrl from "@docusaurus/useBaseUrl";
import Popper from "@site/src/components/common/Popper";
export default function BlogPostItemHeaderAuthors({
  styles,
}: {
  styles?: React.CSSProperties;
}): JSX.Element {
  const {
    metadata: { authors, formattedDate },
    assets,
  } = useBlogPost();
  const authorsCount = authors.length;
  if (authorsCount === 0) {
    return null;
  }

  const authorsDom = authors.map((author) => {
    return (
      <span
        key={author.name}
        style={{
          width: 20,
          height: 20,
          borderRadius: "50%",
          display: "inline-block",
          overflow: "hidden",
          boxSizing: "border-box",
          border: "1px solid var(--portrait-border-color)",
        }}
      >
        <Popper content={author.name}>
          <img
            style={{ width: 18, height: 18 }}
            src={useBaseUrl(author.imageURL)}
            srcSet={author.imageURL}
            alt=""
          />
        </Popper>
      </span>
    );
  });
  return (
    <div
      style={{
        color: "var(--sub-text-color-2)",
        fontSize: 12,
        display: "flex",
        alignItems: "center",
        marginTop: 17,
        ...styles,
      }}
    >
      <span>By </span>
      <span
        style={{
          marginRight: 23,
          marginLeft: 10,
          height: 22,
        }}
      >
        {authorsDom}
      </span>
      <span>{formattedDate}</span>
    </div>
  );
}
