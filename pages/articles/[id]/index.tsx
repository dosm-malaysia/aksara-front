import { GetStaticProps, InferGetServerSidePropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticPaths } from "next";

import { post } from "@lib/helpers";
import GQLPayload from "graphql/class/GQLPayload";
import schema_path from "../../../graphql/schema/q_articles_path.gql";
import schema_article from "../../../graphql/schema/q_article_by_id.gql";

export default function ArticleShowPage({
  article,
}: InferGetServerSidePropsType<typeof getStaticProps>) {
  return <>{JSON.stringify(article)}</>;
}

export const getStaticPaths: GetStaticPaths = async ctx => {
  const result = await post("CMS_GRAPH", null, new GQLPayload(schema_path));
  const paths = (result.articles as Array<any>).map((article: any) => {
    return {
      params: {
        id: article.id,
      },
    };
  });

  return {
    paths: paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params, locale, defaultLocale }) => {
  const translation = await serverSideTranslations(locale!, ["common"]);

  // Example of how to query via GraphQL schema
  const result = await post(
    "CMS_GRAPH",
    null,
    new GQLPayload(schema_article, { lang: locale ?? defaultLocale, id: params!.id })
  );

  return {
    props: {
      ...translation,
      article: result,
      //   data: result,
    },
    revalidate: 5,
  };
};
