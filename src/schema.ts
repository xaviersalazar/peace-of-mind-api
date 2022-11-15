import { gql } from "apollo-server-express";
import { context, Context } from "./context.js";

export const typeDefs = gql`
  type Query {
    service(id: Int): Service
    services: [Service]
    servicesPaginated(skip: Int, take: Int): ServicePaginated
    servicesByCategory(categoryId: Int): [Service]
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

  type ServicePaginated {
    services: [Service]
    pageNumber: Int
    totalPages: Int
    totalCount: Int
  }
`;

export const resolvers = {
  Query: {
    service: async (parent: any, _args: any, context: Context) =>
      await context.prisma.service.findUnique({
        where: { id: _args.id },
      }),
    services: async () => await context.prisma.service.findMany(),
    servicesPaginated: async (
      parent: any,
      { skip, take }: any,
      context: Context
    ) => {
      const services = await context.prisma.service.findMany({
        skip,
        take,
        orderBy: {
          category: {
            categoryName: "asc",
          },
        },
      });
      const servicesCount = await context.prisma.service.count();

      return {
        services,
        pageNumber: Math.floor(skip / take) + 1,
        totalPages: Math.round(servicesCount / take),
        totalCount: servicesCount,
      };
    },
    servicesByCategory: async (parent: any, _args: any, context: Context) =>
      await context.prisma.service.findMany({
        where: {
          categoryId: {
            equals: _args.categoryId,
          },
        },
        orderBy: {
          title: "asc",
        },
      }),
  },
  Service: {
    category: (parent: any, _args: any, context: Context) =>
      context.prisma.service
        .findUnique({
          where: { id: parent?.id },
        })
        .category(),
    prices: (parent: any, _args: any, context: Context) =>
      context.prisma.service
        .findUnique({
          where: { id: parent?.id },
        })
        .prices(),
  },
};
