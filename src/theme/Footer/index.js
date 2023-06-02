import React from "react";
import Footer from "@theme-original/Footer";
import Docsly from "@docsly/react";
import "@docsly/react/styles.css";
import { useLocation } from "@docusaurus/router";
 
export default function FooterWrapper(props) {
  const { pathname } = useLocation();
  if (pathname.startsWith("/docs")) {
  return (
    <>
      <Footer {...props} />
      <Docsly publicId="private_lYJtMkHT9JmRH0vMOHvZU5M1VaQb1v1lNUckAiA9o1KGXSxgrY3kJMM5DG8LcWLx" pathname={pathname} />
    </>
  );
}
  return null;
}
