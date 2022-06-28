import Link from "next/link";
import React, { FunctionComponent } from "react";

type NavButtonProps = {
  icon?: JSX.Element;
  title: string;
  link: string;
};

const NavButton: FunctionComponent<NavButtonProps> = ({
  icon,
  title,
  link,
}) => {
  return (
    <div className="flex gap-2 rounded-md bg-white px-2 py-[6px] text-sm font-medium hover:cursor-pointer hover:bg-washed">
      {icon}
      <Link href={link}>{title}</Link>
    </div>
  );
};

export default NavButton;
