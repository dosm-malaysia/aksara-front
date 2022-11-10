import { FunctionComponent, ReactElement } from "react";
import Link from "next/link";

interface AtProps {
  href: string;
  className?: string;
  children: string | ReactElement;
}

const At: FunctionComponent<AtProps> = ({ href, children, className }) => {
  return (
    <Link href={href}>
      <a className={className}>{children}</a>
    </Link>
  );
};

export default At;
