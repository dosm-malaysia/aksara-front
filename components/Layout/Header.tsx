import Image from "next/image";
import { CalendarIcon, HomeIcon, NewspaperIcon } from "@heroicons/react/solid";

import NavItem from "../Nav/Item";
import Container from "../Container";

const Header = () => {
  return (
    <div className="sticky top-0 left-0 w-full">
      <Container
        background="bg-white"
        className="flex items-center gap-4 py-[11px]"
      >
        <div className="flex gap-2">
          <div className="flex w-8 items-center justify-center">
            <Image src="/static/images/logo.png" width={48} height={36} />
          </div>
          <h3>AKSARA</h3>
        </div>
        <div className="flex gap-2">
          <NavItem
            title="Home"
            link="/"
            icon={<HomeIcon className="h-5 w-5 text-black" />}
          />
          <NavItem
            title="Articles"
            link="/articles"
            icon={<NewspaperIcon className="h-5 w-5 text-black" />}
          />
          <NavItem
            title="Data Catalog"
            link="/catalog"
            icon={<NewspaperIcon className="h-5 w-5 text-black" />}
          />
          <NavItem
            title="Data Release"
            link="/releases"
            icon={<CalendarIcon className="h-5 w-5 text-black" />}
          />
        </div>
      </Container>
    </div>
  );
};

export default Header;
