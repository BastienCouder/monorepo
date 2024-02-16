import { getTwoFactorTokenByToken, getTwoFactorTokenByEmail } from "@/lib/data/two-factor-token";
import { MockContext, Context, createMockContext } from '@/lib/context';

let mockCtx: MockContext;
let ctx: Context;

beforeEach(() => {
  mockCtx = createMockContext();
  ctx = mockCtx as unknown as Context;
});

describe("TwoFactorToken data fetching", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("handles exception when fetching twoFactorToken by token", async () => {
    (ctx.prisma.twoFactorToken.findUnique as jest.Mock).mockRejectedValue(new Error("Database error"));

    const token = await getTwoFactorTokenByToken("invalidToken");

    expect(token).toBeNull();
  });

  it("handles exception when fetching twoFactorToken by email", async () => {
    (ctx.prisma.twoFactorToken.findFirst as jest.Mock).mockRejectedValue(new Error("Database error"));

    const token = await getTwoFactorTokenByEmail("error@example.com");

    expect(token).toBeNull();
  });

  it("returns null on database error for token lookup", async () => {
    (ctx.prisma.twoFactorToken.findUnique as jest.Mock).mockRejectedValue(new Error("Database error"));

    const token = await getTwoFactorTokenByToken("errorToken");

    expect(token).toBeNull();
  });

  it("returns null on database error for email lookup", async () => {
    (ctx.prisma.twoFactorToken.findFirst as jest.Mock).mockRejectedValue(new Error("Database error"));

    const token = await getTwoFactorTokenByEmail("error@example.com");

    expect(token).toBeNull();
  });
});
