import { FunctionComponent, ReactElement } from "react";
import Link from "next/link";

interface AtProps {
  href: string;
  className?: string;
  children: string | ReactElement;
  scrollTop?: boolean;
}

const At: FunctionComponent<AtProps> = ({ href, children, className, scrollTop = true }) => {
  return (
    <Link href={href} scroll={scrollTop}>
      <a className={className}>{children}</a>
    </Link>
  );
};

export default At;
