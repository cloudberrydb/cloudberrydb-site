import dayjs from "dayjs";
import recentPosts from "../../.docusaurus/docusaurus-plugin-content-blog/default/blog-archive-80c.json";

export default function useGetNewBlogList(n: number = 4) {
  let blogPosts = recentPosts.blogPosts;
  // if (isZhLangrage()) {
  //  require("../../.docusaurus/docusaurus-plugin-content-blog/default/zh-blog-archive-8d7.json");
  // }

  blogPosts
    .sort((a, b) => {
      return +new Date(a.metadata.date) - +new Date(b.metadata.date);
    })
    .reverse();

  return blogPosts.slice(0, n).map((item) => {
    let date = item.metadata.date;
    // 格式化
    date = dayjs(date).format("MM/DD,YYYY");
    return {
      title: item.metadata.title,
      name: item.metadata.authors[0].name,
      date: date,
      content: item.metadata.description,
      href: item.metadata.permalink,
      authors: item.metadata.authors,
    };
  });
}
