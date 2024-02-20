import Translate from "@docusaurus/Translate";
import useBaseUrl from "@docusaurus/useBaseUrl";
import useGetNewBlogList from "@site/src/hooks/useGetNewBlogList";
import clsx from "clsx";
import LinkWithBaseUrl from "../../common/LinkWithBaseUrl";
import styles from "./styles.module.scss";

interface Author {
  name: string;
  imageURL: string;
}
function singleAuthor(author: Author, date: string) {
  return (
    <div className={clsx(styles.author, styles.singleAuthor)}>
      <div className={styles.nameLogo}>
        <img
          className={styles.portrait}
          src={useBaseUrl(author.imageURL)}
          alt=""
        />
        <span className="name">{author.name}</span>
      </div>
      <div className="date">{date}</div>
    </div>
  );
}
function multipleAuthor(author: Author[], date: string) {
  return (
    <div className={clsx(styles.author, styles.multipleAuthor)}>
      <div className={styles.info}>
        <div>
          {author.map((item, i) => (
            <img
              key={i}
              className={styles.portrait}
              src={useBaseUrl(item.imageURL)}
              alt=""
            />
          ))}
        </div>
        <div className={styles.date}>{date}</div>
      </div>
    </div>
  );
}

export default function BlogPosts() {
  const itemDom = useGetNewBlogList().map((item, i) => {
    return (
      <LinkWithBaseUrl to={item.href} key={i}>
        <div className={styles.item}>
          <div className={clsx(styles.title)}>{item.title}</div>
          {item.authors.length === 1
            ? singleAuthor(item.authors[0], item.date)
            : multipleAuthor(item.authors, item.date)}
        </div>
      </LinkWithBaseUrl>
    );
  });
  return (
    <div className={styles.wrap}>
      <div className={styles.gTitle}>
        <Translate>Blog Posts</Translate>
      </div>
      <div className={styles.listWrap}>{itemDom}</div>
    </div>
  );
}
