import { MEET_THE_COMMUNITY } from "@site/src/consts/homeContent";
import { useEffect, useState } from "react";
import getGithubContributors, {
  ContributorItem,
} from "./getGithubContributors";
import styles from "./index.module.scss";
export default function MeetTheCommunity() {
  const [contributors, setContributors] = useState<ContributorItem[]>([]);
  useEffect(() => {
    getGithubContributors().then((c) => {
      setContributors(c.slice(0, 119));
    });
  }, []);
  return (
    <div className={styles.meetTheCommunity}>
      <div className={styles.bgImg}></div>
      <div className={styles.title}>{MEET_THE_COMMUNITY.title}</div>
      <div className={styles.contributorList}>
        {contributors.map((c) => (
          <div className={styles.contributorItem} key={c.id}>
            <a
              href="https://github.com/cloudberrydb/cloudberrydb/graphs/contributors"
              target="_blank"
              rel="noreferrer"
            >
              <img src={c.avatarURL} alt="" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
