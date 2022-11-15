import { createServer } from "http";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { typeDefs, resolvers } from "./schema.js";
import { context } from "./context.js";

const startServer = async () => {
  const app = express();
  const httpServer = createServer(app);

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: context,
    introspection: true,
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({
    app,
  });

  httpServer.listen({ port: process.env.PORT || 4000 }, () =>
    console.log(
      `⚡ Server listening on http://localhost:4000${apolloServer.graphqlPath}`
    )
  );
};

startServer();
