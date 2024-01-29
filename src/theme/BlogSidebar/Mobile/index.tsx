import React from 'react';
import {useVisibleBlogSidebarItems} from '@docusaurus/theme-common/internal';
import {NavbarSecondaryMenuFiller} from '@docusaurus/theme-common';
import type {Props} from '@theme/BlogSidebar/Mobile';
import LinkWithBaseUrl from '@site/src/components/common/LinkWithBaseUrl';

function BlogSidebarMobileSecondaryMenu({sidebar}: Props): JSX.Element {
  const items = useVisibleBlogSidebarItems(sidebar.items);
  return (
    <ul className="menu__list">
      {items.map((item) => (
        <li key={item.permalink} className="menu__list-item">
          <LinkWithBaseUrl
            isNavLink
            to={item.permalink}
            className="menu__link"
            activeClassName="menu__link--active">
            {item.title}
          </LinkWithBaseUrl>
        </li>
      ))}
    </ul>
  );
}

export default function BlogSidebarMobile(props: Props): JSX.Element {
  return (
    <NavbarSecondaryMenuFiller
      component={BlogSidebarMobileSecondaryMenu}
      props={props}
    />
  );
}
