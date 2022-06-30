import type { InferGetStaticPropsType, NextPage } from "next";
import { GetStaticProps } from "next";

import Hero from "@components/Hero";
import Container from "@components/Container";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

const Home: NextPage = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
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

export default Home;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
    const translation = await serverSideTranslations(locale!, ["common"]);

    return {
        props: {
            ...translation,
        },
    };
};
