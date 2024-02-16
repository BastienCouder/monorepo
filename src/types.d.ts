import { UserFindUniqueArgs, PrismaClient } from '@prisma/client';

// Extend the PrismaClient user type with jest mocks for TypeScript
type MockPrismaClient = PrismaClient & {
  user: {
    findUnique: jest.Mock;
  };
};

// Use this type in your tests when you're working with the mocked Prisma client
declare module '@prisma/client' {
  interface PrismaClient extends MockPrismaClient {}
}
