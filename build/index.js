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
import PrismaClientPkg from "@prisma/client";
const PrismaClient = PrismaClientPkg.PrismaClient;
const prisma = new PrismaClient();
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    const app = express();
    const httpServer = createServer(app);
    const typeDefs = gql `
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
    yield apolloServer.start();
    apolloServer.applyMiddleware({
        app,
    });
    httpServer.listen({ port: process.env.PORT || 4000 }, () => console.log(`⚡ Server listening on http://localhost:4000${apolloServer.graphqlPath}`));
});
startServer();
