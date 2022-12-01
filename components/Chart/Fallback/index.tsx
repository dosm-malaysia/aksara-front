import { Suspense, FunctionComponent, ReactNode } from "react";

interface FallbackProps {
  fallback: ReactNode;
  children: ReactNode;
}

const Fallback: FunctionComponent<FallbackProps> = ({ children, fallback }) => {
  return <Suspense fallback={fallback}>{children}</Suspense>;
};

export default Fallback;
