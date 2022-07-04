import { DocumentNode } from "graphql";

class GQLPayload {
    operationName: string | undefined;
    query: string | undefined;
    variables: Record<string, any> | undefined;

    constructor(schema: DocumentNode, variables?: Record<string, any>) {
        this.query = schema.loc?.source.body;
        this.variables = variables;
    }
}

export default GQLPayload;
