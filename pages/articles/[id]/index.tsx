import { GetStaticProps, InferGetServerSidePropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticPaths } from "next";

import { post } from "@lib/api";
import GQLPayload from "graphql/class/GQLPayload";
import schema_path from "../../../graphql/schema/q_articles_path.gql";
import schema_article from "../../../graphql/schema/q_article_by_id.gql";
import { useChartParser } from "@hooks/useChartParser";

export default function ArticleShowPage({
  article,
}: InferGetServerSidePropsType<typeof getStaticProps>) {
  const { thumbnail, body, publicationDate } = {
    thumbnail: article.thumbnail,
    body: article.body[0],
    publicationDate: new Date(article.publication_date).toDateString(),
  };
  const { content } = useChartParser(body.content, article.charts);

  return (
    <>
      <div className="mx-auto min-h-screen w-full max-w-screen-lg py-16">
        <div className="article-parent space-y-3">
          <h1>{body.title}</h1>
          <h5>{body.description}</h5>
          <small>
            By <a href="#">[AuthorName]</a> | [AuthorSocial] | {publicationDate}
          </small>
        </div>
        {thumbnail && (
          <div className="pt-8 pb-8 md:text-center">
            {/* TODO: Replace with process.env.NEXT_PUBLIC_CMS_URL */}
            <img src={`http://localhost:8055/assets/${thumbnail.id}`} alt={thumbnail.title} />
            <small>
              {thumbnail.title && <i>{thumbnail.title} -- </i>}
              {thumbnail.description && <span> {thumbnail.description}</span>}
            </small>
          </div>
        )}
        <article>{content}</article>
      </div>
    </>
  );
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
      article: result.article,
    },
    revalidate: 5,
  };
};
