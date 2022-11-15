import { gql } from "apollo-server-express";
import { context, Context } from "./context.js";

export const typeDefs = gql`
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

export const resolvers = {
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
