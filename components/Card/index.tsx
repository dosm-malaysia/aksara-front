import { FunctionComponent, ReactNode } from "react";

interface CardProps {
  type?: "default" | "gray";
  className?: string;
  children: ReactNode;
  onClick?: () => Function;
}

const Card: FunctionComponent<CardProps> = ({ type = "default", children, className, onClick }) => {
  return (
    <div
      className={[
        ...[
          className
            ? className
            : type === "gray"
            ? `rounded-xl border border-outline bg-background p-4.5`
            : `rounded-xl border border-outline bg-white p-6 shadow-lg`,
        ],
        ...[onClick ? "cursor-pointer" : ""],
      ].join(" ")}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
