declare namespace NodeJS {
    export interface ProcessEnv {
        CMS_URL: string;
        CMS_GRAPHQL_URL: string;
        CMS_WEBHOOK_KEY: string;
        NEXT_PUBLIC_CMS_GRAPHQL_URL: string;
    }
}

declare module "*.gql" {
    import { DocumentNode } from "graphql";
    const Schema: DocumentNode;

    export = Schema;
}
