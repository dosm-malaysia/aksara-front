import "graphiql/graphiql.css";
import dynamic from "next/dynamic";

const GraphiqQL = dynamic(() => import("graphiql"), { ssr: false });

// TODO: Disable this page in production by adding middleware that checks for build environment
export default () => {
    return (
        <div className="h-full min-h-screen">
            <GraphiqQL
                fetcher={async (graphQLParams, options) => {
                    const data = await fetch("http://localhost:8055/graphql", {
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
