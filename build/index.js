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
import { ApolloServer, gql } from "apollo-server-express";
import { context } from "./context";
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    const app = express();
    const httpServer = createServer(app);
    const typeDefs = gql `
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
    };
    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
        context: context,
    });
    yield apolloServer.start();
    apolloServer.applyMiddleware({
        app,
    });
    httpServer.listen({ port: process.env.PORT || 4000 }, () => console.log(`⚡ Server listening on http://localhost:4000${apolloServer.graphqlPath}`));
});
startServer();
