import type { InferGetStaticPropsType } from "next";
import type { Page, ReactElement } from "@lib/types";
import { GetStaticProps } from "next";
import { post } from "@lib/helpers";
import { Hero, Container, Layout } from "@components/index";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

// TODO: Need a better naming scheme for the gql schemas. Also, use alias for webpack import
// import schema from "../../graphql/schema/q_articles.gql";
// import GQLPayload from "graphql/class/GQLPayload";

const ArticleIndex: Page = ({ data }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation();

  return (
    <>
      <Hero background="hero-light-1">
        <h3 className="mb-2">{t("hero.h3")}</h3>
        <p className="max-w-3xl text-dim">{t("hero.p")}</p>
      </Hero>
      <Container className="min-h-screen">
        <div>This is the articles index page</div>

        {JSON.stringify(data)}
      </Container>
    </>
  );
};

export default ArticleIndex;

export const getStaticProps: GetStaticProps = async ({ locale, defaultLocale }) => {
  const translation = await serverSideTranslations(locale!, ["common"]);

  // Example of how to query via GraphQL schema
  // const result = await post(
  //     "CMS_GRAPH",
  //     null,
  //     new GQLPayload(schema, { lang: locale ?? defaultLocale })
  // );

  return {
    props: {
      ...translation,
      //   data: result,
    },
    revalidate: 5,
  };
};
