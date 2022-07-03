import "graphiql/graphiql.css";
import dynamic from "next/dynamic";

const GraphiqQL = dynamic(() => import("graphiql"), { ssr: false });

export default () => {
    return (
        <div className="h-full min-h-screen">
            <GraphiqQL
                fetcher={async (graphQLParams, options) => {
                    const data = await fetch(process.env.NEXT_PUBLIC_CMS_GRAPHQL_URL, {
                        method: "POST",
                        headers: {
                            "Accept": "application/json",
                            "Content-Type": "application/json",
                            ...options!.headers,
                        },
                        body: JSON.stringify(graphQLParams),
                    });
                    return data.json().catch(() => data.text());
                }}
                editorTheme={"dracula"}
            />
        </div>
    );
};
