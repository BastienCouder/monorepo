
import { getUserByEmail, getUserById } from "@/lib/data/user";
import { MockContext, Context, createMockContext } from '@/lib/context'

let mockCtx: MockContext
let ctx: Context

beforeEach(() => {
  mockCtx = createMockContext()
  ctx = mockCtx as unknown as Context
})

describe("User data fetching", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns null on exception for email", async () => {
    (ctx.prisma.user.findUnique as jest.Mock).mockRejectedValue(new Error("Database error"));
  
    const user = await getUserByEmail("error@example.com");
  
    expect(user).toBeNull();
  });
  
  it("returns null on exception for id", async () => {
    (ctx.prisma.user.findUnique as jest.Mock).mockRejectedValue(new Error("Database error"));
  
    const user = await getUserById("error-id");
  
    expect(user).toBeNull();
  });

  it("returns null on exception for email", async () => {
    (ctx.prisma.user.findUnique as jest.Mock).mockResolvedValue(new Error("Database error"));

    const user = await getUserByEmail("error@example.com");

    expect(user).toBeNull();
  });

  it("returns null on exception for id", async () => {
    (ctx.prisma.user.findUnique as jest.Mock).mockResolvedValue(new Error("Database error"));

    const user = await getUserById("error-id");

    expect(user).toBeNull();
  });
});
