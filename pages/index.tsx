import type { InferGetStaticPropsType } from "next";
import type { Page, ReactElement } from "@lib/types";
import { GetStaticProps } from "next";
import { post } from "@lib/helpers";
import { Hero, Container, Layout } from "@components/index";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

// TODO: Remove below imports later
import QueryArticle from "../graphql/schema/q_article_by_id.gql";
import GQLPayload from "graphql/class/GQLPayload";

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

Home.layout = (page: ReactElement) => {
    return <Layout>{page}</Layout>;
};

export default Home;

export const getStaticProps: GetStaticProps = async ({ locale, defaultLocale }) => {
    const translation = await serverSideTranslations(locale!, ["common"]);

    // Example: Calling a GraphQL query
    const article = await post("CMS_GRAPH", null, new GQLPayload(QueryArticle, { lang: locale ?? defaultLocale, id: 5 }));
    console.log(article);

    return {
        props: {
            ...translation,
        },
        revalidate: 5,
    };
};
