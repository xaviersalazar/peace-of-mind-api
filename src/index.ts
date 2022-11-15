import { createServer } from "http";
import express from "express";
import { ApolloServer, gql } from "apollo-server-express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface Context {
  prisma: PrismaClient;
}

const context: Context = {
  prisma: prisma,
};

const startServer = async () => {
  const app = express();
  const httpServer = createServer(app);

  const typeDefs = gql`
    type Query {
      services: [Service]
      categories: [Category]
      prices: [Price]
    }

    type Service {
      id: ID!
      title: String!
      description: String
      category: Category
      prices: [Price]
    }

    type Category {
      id: ID!
      categoryName: String!
      service: [Service]
    }

    type Price {
      id: ID!
      price: String
      unit: String
      hasUpcharge: Boolean
      service: Service
    }
  `;

  const resolvers = {
    Query: {
      services: () => context.prisma.service.findMany(),
    },
    Service: {
      category: (parent: any, _args: any, context: Context) => {
        return context.prisma.service
          .findUnique({
            where: { id: parent?.id },
          })
          .category();
      },
      prices: (parent: any, _args: any, context: Context) => {
        return context.prisma.service
          .findUnique({
            where: { id: parent?.id },
          })
          .prices();
      },
    },
  };

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: context,
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
