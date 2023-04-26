import { gql } from "apollo-server-express";
import { context, Context } from "./context.js";

export const typeDefs = gql`
  type Query {
    service(id: Int): Service
    services: [Service]
    servicesPaginated(skip: Int, take: Int): ServicePaginated
    servicesByCategory(categoryId: Int): [Service]
    categories: [Category]
    units: [Unit]
    prices: [Price]
    search(searchInput: SearchInput): [Service]
  }

  type Mutation {
    editService(service: EditServiceInput!): Service
    deleteService(id: Int!): Service
  }

  type Service {
    id: ID!
    title: String!
    description: String
    category: Category
    prices: [Price]
    imgName: String
  }

  type Category {
    id: ID!
    categoryName: String!
    service: [Service]
  }

  type Unit {
    id: ID!
    name: String!
    prices: [Price]
  }

  type Price {
    id: ID!
    price: String
    unit: Unit
    hasUpcharge: Boolean
    service: Service
  }

  type ServicePaginated {
    services: [Service]
    pageNumber: Int
    totalPages: Int
    totalCount: Int
  }

  input UnitInput {
    id: ID!
    name: String!
  }

  input EditPriceInput {
    id: ID!
    price: String
    unit: UnitInput!
    hasUpcharge: Boolean
  }

  input EditServiceInput {
    id: ID!
    description: String
    prices: [EditPriceInput]
  }

  input SearchInput {
    searchValue: String!
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
    units: async (parent: any, _args: any, context: Context) =>
      await context.prisma.unit.findMany({
        orderBy: [
          {
            name: "asc",
          },
        ],
      }),
    search: async (parent: any, _args: any, context: Context) => 
      await context.prisma.service.findMany({
        take: 10,
        where: {
          OR: [
            {
              title: {
                contains: _args.searchInput.searchValue,
                mode: 'insensitive'
              }
            },
            {
              category: {
                categoryName: {
                  contains: _args.searchInput.searchValue,
                  mode: 'insensitive'
                }
              }
            }
          ],
          NOT: [
            {
              category: {
                categoryName: {
                  contains: 'Besame',
                  mode: 'insensitive'
                }
              }
            }
          ]
        }
      })
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
          id: +price.id,
          price: price.price,
          unitId: +price.unit.id,
          hasUpcharge: price.hasUpcharge,
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
    deleteService: async (parent: any, _args: any, context: Context) => {
      const id = +_args.id;

      await context.prisma.price.deleteMany({
        where: {
          serviceId: id,
        },
      });

      return await context.prisma.service.delete({
        where: { id },
      });
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
  Price: {
    unit: (parent: any, _args: any, context: Context) =>
      context.prisma.price
        .findUnique({
          where: { id: parent?.id },
        })
        .unit(),
  },
};
