import { toDate } from "@lib/helpers";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import {
  FunctionComponent,
  ReactElement,
  ReactNode,
  forwardRef,
  LegacyRef,
  ForwardedRef,
} from "react";

interface SectionProps {
  className?: string;
  title?: string | ReactElement;
  description?: string | ReactElement;
  children?: ReactNode;
  menu?: ReactNode;
  date?: string | null;
  ref?: ForwardedRef<HTMLElement> | undefined;
}

const Section: FunctionComponent<SectionProps> = forwardRef(
  (
    { title, className = "border-b py-12", description, children, date, menu },
    ref: LegacyRef<HTMLElement> | undefined
  ) => {
    const { t } = useTranslation();
    const router = useRouter();

    const displayDate = (): string => {
      if (date === undefined || date === null) return "";
      return toDate(date, "dd MMM yyyy, HH:mm", router.locale);
    };
    return (
      <section className={className} ref={ref}>
        <div className="pb-6">
          <div className="flex flex-col items-start gap-2 lg:flex-row lg:items-center lg:justify-between">
            {title && typeof title === "string" ? <h4>{title}</h4> : title}
            {date && date !== null && (
              <span className="text-right text-sm text-dim">
                {t("common.data_of", { date: displayDate() })}
              </span>
            )}
          </div>
          {(description || menu) && (
            <div className="flex flex-wrap justify-between gap-6 pt-4 md:flex-nowrap ">
              {description && typeof description === "string" ? (
                <p className="whitespace-pre-line text-base text-dim">{description}</p>
              ) : (
                description
              )}
              {menu && <div className="flex gap-3">{menu}</div>}
            </div>
          )}
        </div>
        {children}
      </section>
    );
  }
);

export default Section;
