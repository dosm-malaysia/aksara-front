import { FunctionComponent, ReactNode, useState } from "react";
import Button from "@components/Button";

interface SidebarProps {
  children: ReactNode;
  categories: string[];
  onSelect: (index: number) => void;
}

const Sidebar: FunctionComponent<SidebarProps> = ({ children, categories, onSelect }) => {
  const [selected, setSelected] = useState<number>();
  const styles = {
    base: "px-5 py-1.5 w-full rounded-none",
    active: "text-base border-l-2 border-black bg-washed text-black font-medium",
    default: "text-dim text-base",
  };
  return (
    <div className="flex w-full flex-row">
      {/* lg (>1280px) */}
      <div className="hidden border-r lg:block lg:w-1/5 ">
        <ul className="sticky top-14 flex h-[90vh] flex-col gap-0.5 overflow-auto pt-3">
          <li>
            <h5 className={styles.base}>Category</h5>
          </li>
          {categories.map((menu, index) => (
            <li>
              <Button
                className={[styles.base, selected === index ? styles.active : styles.default].join(
                  " "
                )}
                onClick={() => {
                  setSelected(index);
                  onSelect(index);
                }}
              >
                {menu}
              </Button>
            </li>
          ))}
        </ul>
      </div>
      {/* md (<1280px) */}
      <div className="block lg:hidden"></div>
      {/* main */}
      <div className="w-full">{children}</div>
    </div>
  );
};

export default Sidebar;
