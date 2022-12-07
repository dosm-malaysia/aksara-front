import Link from "next/link";
import Image from "next/image";
import { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "next-i18next";
import {
  HomeIcon,
  Bars3BottomRightIcon,
  ChartBarSquareIcon,
  RectangleGroupIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

import { languages } from "@lib/options";

import { routes } from "@lib/routes";
import { useLanguage } from "@hooks/useLanguage";
import { useWindowWidth } from "@hooks/useWindowWidth";

import Nav from "@components/Nav";
import NavItem from "@components/Nav/Item";
import Dropdown from "@components/Dropdown";
import Container from "@components/Container";
import MegaMenu from "@components/Nav/MegaMenu";

interface HeaderProps {
  stateSelector?: ReactElement;
}

const Header: FunctionComponent<HeaderProps> = ({ stateSelector }) => {
  const { t } = useTranslation("common");
  const { language, onLanguageChange } = useLanguage();

  //   const width = useWindowWidth();
  //   const isTablet = width <= BREAKPOINTS.MD;

  const [isTabletNavOpen, setIsTabletNavOpen] = useState(false);

  // TODO: build items from API
  const megaMenuItems = [
    {
      title: t("nav.megamenu.categories.demography"),
      list: [{ title: t("nav.megamenu.dashboards.kawasanku"), link: routes.KAWASANKU }],
    },
    {
      title: t("nav.megamenu.categories.economy"),
      list: [
        { title: t("nav.megamenu.dashboards.labour_market"), link: routes.LABOUR_MARKET },
        { title: t("nav.megamenu.dashboards.composite_index"), link: routes.COMPOSITE_INDEX },
      ],
    },
  ];

  return (
    <div className="fixed top-0 left-0 z-20 w-full">
      <Container background="bg-white" className="flex items-center gap-4 border-b py-[11px]">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <div className="flex cursor-pointer gap-2">
                <div className="flex w-8 items-center justify-center">
                  <Image src="/static/images/logo.png" width={48} height={36} />
                </div>
                <h4>data.dosm.gov.my</h4>
              </div>
            </Link>
            <Nav isTabletNavOpen={isTabletNavOpen}>
              <NavItem
                title={t("nav.home")}
                link="/"
                icon={<HomeIcon className="h-5 w-5 text-black" />}
                onClick={() => setIsTabletNavOpen(false)}
              />
              {/* DASHBOARD MEGA MENU */}
              <MegaMenu
                title={t("nav.dashboards")}
                icon={<RectangleGroupIcon className="h-5 w-5 text-black" />}
              >
                <Container className="relative grid gap-4 py-3 md:grid-cols-4 md:gap-6 md:py-6">
                  {megaMenuItems.map((item, index) => (
                    <div key={item.title} className="text-sm">
                      <p className="mb-2 font-bold">{item.title}</p>
                      <ul className="flex flex-col gap-2">
                        {item.list.map((li, index) => (
                          <li
                            key={item.title.concat(index.toString())}
                            className="text-footer-link"
                          >
                            <Link href={li.link}>
                              <a onClick={() => setIsTabletNavOpen(false)}>{li.title}</a>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </Container>
              </MegaMenu>
              <NavItem
                title={t("nav.catalogue")}
                link="/data-catalogue"
                icon={<ChartBarSquareIcon className="h-5 w-5 text-black" />}
                onClick={() => setIsTabletNavOpen(false)}
              />
            </Nav>
          </div>
          <div className="flex items-center gap-4">
            {stateSelector}
            {/* LANGUAGE DROPDOWN */}
            <Dropdown selected={language} onChange={onLanguageChange} options={languages} />
            {/* MOBILE NAV ICONS */}
            {isTabletNavOpen ? (
              <XMarkIcon
                className="block h-4 w-4 text-black md:hidden"
                onClick={() => setIsTabletNavOpen(false)}
              />
            ) : (
              <Bars3BottomRightIcon
                className="block h-4 w-4 text-black md:hidden"
                onClick={() => setIsTabletNavOpen(true)}
              />
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Header;
