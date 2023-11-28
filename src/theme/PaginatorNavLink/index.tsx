import React from "react";
import clsx from "clsx";
import type { Props } from "@theme/PaginatorNavLink";
import LinkWithBaseUrl from "@site/src/components/common/LinkWithBaseUrl";

export default function PaginatorNavLink(props: Props): JSX.Element {
  const { permalink, title, subLabel, isNext } = props;
  return (
    <LinkWithBaseUrl
      className={clsx(
        "pagination-nav__link",
        isNext ? "pagination-nav__link--next" : "pagination-nav__link--prev"
      )}
      to={permalink}
    >
      {subLabel && <div className="pagination-nav__sublabel">{subLabel}</div>}
      <div className="pagination-nav__label single-line-overflow hide-before-after">
        {title}
      </div>
    </LinkWithBaseUrl>
  );
}
