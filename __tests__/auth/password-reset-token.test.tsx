import { getPasswordResetTokenByToken, getPasswordResetTokenByEmail } from "@/lib/data/password-reset-token";
import { MockContext, Context, createMockContext } from '@/lib/context';

let mockCtx: MockContext;
let ctx: Context;

beforeEach(() => {
  mockCtx = createMockContext();
  ctx = mockCtx as unknown as Context;
});

describe("Password reset token fetching", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("fetches password reset token by token successfully", async () => {
    const mockPasswordResetToken = { id: "1", token: "token123", email: "user@example.com" };
    (ctx.prisma.passwordResetToken.findUnique as jest.Mock).mockResolvedValue(mockPasswordResetToken);

    const passwordResetToken = await getPasswordResetTokenByToken("token123");

    expect(passwordResetToken).toEqual(mockPasswordResetToken);
    expect(ctx.prisma.passwordResetToken.findUnique).toHaveBeenCalledWith({
      where: { token: "token123" },
    });
  });

  it("fetches password reset token by email successfully", async () => {
    const mockPasswordResetToken = { id: "2", token: "token456", email: "user2@example.com" };
    (ctx.prisma.passwordResetToken.findFirst as jest.Mock).mockResolvedValue(mockPasswordResetToken);

    const passwordResetToken = await getPasswordResetTokenByEmail("user2@example.com");

    expect(passwordResetToken).toEqual(mockPasswordResetToken);
    expect(ctx.prisma.passwordResetToken.findFirst).toHaveBeenCalledWith({
      where: { email: "user2@example.com" },
    });
  });

  // Additional tests for null and error cases can follow the same pattern.
});
