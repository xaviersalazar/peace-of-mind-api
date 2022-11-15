var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createServer } from "http";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { typeDefs, resolvers } from "./schema.js";
import { context } from "./context.js";
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    const app = express();
    const httpServer = createServer(app);
    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
        context: context,
        introspection: true,
    });
    yield apolloServer.start();
    apolloServer.applyMiddleware({
        app,
    });
    httpServer.listen({ port: process.env.PORT || 4000 }, () => console.log(`⚡ Server listening on http://localhost:4000${apolloServer.graphqlPath}`));
});
startServer();
