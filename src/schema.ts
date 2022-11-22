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

  type Mutation {
    editService(service: EditServiceInput!): Service
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

  input EditPriceInput {
    id: ID!
    price: String
    unit: String
    hasUpcharge: Boolean
  }

  input EditServiceInput {
    id: ID!
    description: String
    prices: [EditPriceInput]
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
        orderBy: [
          {
            category: {
              categoryName: "asc",
            },
          },
          {
            title: "asc",
          },
        ],
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
  Mutation: {
    editService: async (parent: any, _args: any, context: Context) => {
      const id = +_args.service.id;

      await context.prisma.price.deleteMany({
        where: {
          serviceId: id,
        },
      });

      await context.prisma.price.createMany({
        data: _args.service.prices.map((price: any) => ({
          ...price,
          id: +price.id,
          serviceId: id,
        })),
      });

      await context.prisma.service.update({
        where: { id },
        data: {
          description: _args.service.description,
        },
      });

      return await context.prisma.service.findUnique({ where: { id } });
    },
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
