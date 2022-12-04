import { FunctionComponent, ReactNode, useState } from "react";
import { Transition } from "@headlessui/react";
import Button from "@components/Button";
import { Bars3BottomLeftIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "next-i18next";

interface SidebarProps {
  children: ReactNode;
  categories: string[];
  onSelect: (index: number) => void;
}

const Sidebar: FunctionComponent<SidebarProps> = ({ children, categories, onSelect }) => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<number>();
  const [show, setShow] = useState<boolean>(false);
  const styles = {
    base: "px-4 lg:px-5 py-2 w-full rounded-none",
    active: "border-l-2 border-black bg-washed text-black font-medium",
    default: "text-dim",
  };
  return (
    <>
      <div className="flex w-full flex-row">
        {/* Desktop */}
        <div className="hidden border-r lg:block lg:w-1/5 ">
          <ul className="sticky top-14 flex h-[90vh] flex-col gap-0.5 overflow-auto pt-3">
            <li>
              <h5 className={styles.base}>{t("catalogue.category")}</h5>
            </li>
            {categories.length > 0 ? (
              categories.map((menu, index) => (
                <li key={index} title={menu}>
                  <Button
                    className={[
                      styles.base,
                      selected === index ? styles.active : styles.default,
                    ].join(" ")}
                    onClick={() => {
                      setSelected(index);
                      onSelect(index);
                    }}
                  >
                    {menu}
                  </Button>
                </li>
              ))
            ) : (
              <p className={[styles.base, "text-sm italic text-dim"].join(" ")}>
                {t("common.no_entries")}
              </p>
            )}
          </ul>
        </div>

        <div className="relative h-full w-full">
          {/* Mobile */}
          <>
            <div className="absolute top-20 block h-full lg:hidden">
              <Button
                className="sticky top-36 flex border bg-white font-medium"
                icon={<Bars3BottomLeftIcon className="h-4 w-4" />}
                onClick={() => setShow(true)}
              >
                {t("catalogue.category")}
              </Button>
            </div>
            <Transition
              show={show}
              as="div"
              className="fixed top-14 left-0 z-30 flex h-screen w-2/3 flex-col border border-l-0 bg-white shadow-md"
              enter="transition-opacity duration-75"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity duration-150"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <ul className="flex flex-col gap-1 overflow-auto pt-2">
                <li className="flex items-baseline justify-between">
                  <h5 className={styles.base}>{t("catalogue.category")}</h5>
                  <Button
                    className="mr-3 border text-sm"
                    icon={<XMarkIcon className="h-4 w-4" />}
                    onClick={() => setShow(false)}
                  >
                    {t("common.close")}
                  </Button>
                </li>
                {categories.map((menu, index) => (
                  <li>
                    <Button
                      className={[
                        styles.base,
                        selected === index ? styles.active : styles.default,
                      ].join(" ")}
                      onClick={() => {
                        setSelected(index);
                        onSelect(index);
                        setShow(false);
                      }}
                    >
                      {menu}
                    </Button>
                  </li>
                ))}
              </ul>
            </Transition>
          </>
          {/* Content */}
          {children}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
