import { useLocation } from "@docusaurus/router";
import BackHomeLight from "@site/static/img/back_home-light.svg";
import BackHome from "@site/static/img/back_home.svg";
import LineSvg from "@site/static/img/line.svg";
import clsx from "clsx";
import React from "react";
import LinkWithBaseUrl from "../LinkWithBaseUrl";
import styles from "./styles.module.scss";

interface Path {
  name: string;
  href?: string;
}
interface IProps {
  className?: string;
  style?: React.CSSProperties;
  path?: Path[];
}
function getDefaultPath(): Path[] {
  let currentPathName = useLocation().pathname.slice(1);
  if (currentPathName.endsWith("/")) {
    currentPathName = currentPathName.slice(0, -1);
  }
  currentPathName = currentPathName.replace("zh/", "");
  currentPathName = currentPathName[0].toUpperCase() + currentPathName.slice(1);
  const path: Path[] = currentPathName.split("/").map((item) => {
    return {
      name: item,
    };
  });
  for (let i = 0; i < path.length - 1; i++) {
    path[i].href = `/${path[i].name.toLocaleLowerCase()}`;
  }
  return path;
}
export default function BreadCrumbs(props: IProps) {
  let path = getDefaultPath();
  const location = useLocation();
  if (props.path?.length) {
    path = props.path;
  }

  const pathLen = location.pathname.split("/").filter((item) => {
    return item != "" && item != "zh" && item != "blog";
  }).length;

  return (
    <div
      className={clsx(styles.breadcrumbs, props.className, {
        [styles.mdxPage]: pathLen === 2,
      })}
      style={props.style}
    >
      <LinkWithBaseUrl to={"/"} className={styles.backLogoA}>
        <BackHome className={styles.backLogoSvg} />
        <BackHomeLight className={styles.backLogoLightSvg} />
      </LinkWithBaseUrl>
      <div className={styles.path}>
        {path.map((item) => {
          const LinkBtn = item.href ? (
            <LinkWithBaseUrl className={styles.backPath} to={item.href}>
              {item.name}
            </LinkWithBaseUrl>
          ) : (
            <span className={styles.leafPath}>{item.name}</span>
          );
          return (
            <React.Fragment key={item.name}>
              <LineSvg className={styles.line} />
              {LinkBtn}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
