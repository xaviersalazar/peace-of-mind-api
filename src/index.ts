import { createServer } from "http";
import express from "express";
import { ApolloServer, gql } from "apollo-server-express";
import PrismaClientPkg from "@prisma/client";

const PrismaClient = PrismaClientPkg.PrismaClient;

const prisma = new PrismaClient();

const startServer = async () => {
  const app = express();
  const httpServer = createServer(app);

  const typeDefs = gql`
    type Query {
      services: [Service]
    }

    type Service {
      id: ID!
      title: String!
      price: String
      description: String
    }
  `;

  const resolvers = {
    Query: {
      services: () => {
        return prisma.service.findMany();
      },
    },
  };

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
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
