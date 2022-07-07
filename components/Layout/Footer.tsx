import Link from "next/link";
import Image from "next/image";

import Container from "@components/Container";

const Footer = () => {
  return (
    <Container background="bg-washed py-12">
      <div className="flex w-full flex-col gap-6 text-sm md:flex-row md:justify-between md:gap-0">
        <div className="flex flex-col gap-2 md:flex-row md:gap-4">
          {/* LOGO */}
          <div className="mt-1 w-12">
            <Image src="/static/images/logo.png" width={48} height={36} />
          </div>
          <div>
            <div className="mb-2">
              <p className="text-base font-bold">PRIME MINISTER'S DEPARTMENT</p>
              <p className="text-base font-bold">DEPARTMENT OF STATISTICS MALAYSIA</p>
            </div>
            {/* COPYRIGHT */}
            <p className="text-dim">© 2022 Department of Statistics Malaysia</p>
          </div>
        </div>
        <div className="flex flex-col gap-6 md:flex-row md:gap-14">
          {/* SOURCES */}
          <div className="flex flex-col gap-2">
            <p className="font-bold">Source</p>
            <p className="text-dim">
              Website:{" "}
              <Link href="/">
                <span className="text-footer-link">AKSARA</span>
              </Link>
            </p>
            <p className="text-dim">
              Data:{" "}
              <Link href="/">
                <span className="text-footer-link">DOSM Github</span>
              </Link>
            </p>
          </div>
          {/* RESOURCES */}
          <div className="flex flex-col gap-2">
            <p className="font-bold">Resources</p>
            <Link href="/">
              <span className="text-footer-link">Meet the team</span>
            </Link>
            <Link href="/">
              <span className="text-footer-link">DOSM portal</span>
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Footer;
