import TipsBar from "@site/src/components/home/TipsBar";
import NavbarContent from "@theme/Navbar/Content";
import NavbarLayout from "@theme/Navbar/Layout";

export default function Navbar(): JSX.Element {
  return (
    <>
      <TipsBar />
      <NavbarLayout>
        <NavbarContent />
      </NavbarLayout>
    </>
  );
}
