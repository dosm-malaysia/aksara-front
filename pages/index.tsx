import type { InferGetStaticPropsType } from "next";
import type { Page } from "@lib/types";
import { GetStaticProps } from "next";
import { Hero, Container } from "@components/index";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

const Home: Page = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation();

  return (
    <>
      <Hero background="hero-light-1">
        <h3 className="mb-2">{t("hero.h3")}</h3>
        <p className="max-w-3xl text-dim">{t("hero.p")}</p>
      </Hero>
      <Container className="min-h-screen"> </Container>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale, defaultLocale }) => {
  const translation = await serverSideTranslations(locale!, ["common"]);

  return {
    props: {
      ...translation,
    },
    revalidate: 5,
  };
};

export default Home;
