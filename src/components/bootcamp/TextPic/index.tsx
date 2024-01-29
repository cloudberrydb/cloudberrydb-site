import useBaseUrl from "@docusaurus/useBaseUrl";
import clsx from "clsx";
import styles from "./styles.module.scss";

export default function TextPic() {
  return (
    <div className={styles.wrap}>
      <div className={clsx(styles.text, "sub-text")}>
        These tutorials showcase how Cloudberry Database can address day-to-day
        tasks performed in typical DW, BI and data science environments. It is
        designed to be used with the Cloudberry Database Sandbox, which is based
        on the Docker with the CentOS 7.9 OS.
      </div>
      <div className={styles.picture}>
        <img src={useBaseUrl("/img/bootcamp/cmd.png")} alt="" />
      </div>
    </div>
  );
}
