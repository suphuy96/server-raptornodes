import { makeExecutableSchema } from "@graphql-tools/schema";
import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";
import Schemas from "./schemas/index";
import resolvers from "./resolvers/index";

export const schema = makeExecutableSchema({
    typeDefs: mergeTypeDefs(Schemas),
    resolvers: mergeResolvers(resolvers),
});
