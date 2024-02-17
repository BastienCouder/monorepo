import { getPasswordResetTokenByEmail } from "@/lib/data/password-reset-token";
import { getVerificationTokenByEmail } from "@/lib/data/verification-token";
import { prisma } from "@/lib/prisma";
import { generatePasswordResetToken, generateVerificationToken } from "@/lib/token";
import { randomUUID } from "crypto";

jest.mock("crypto", () => ({
    randomUUID: jest.fn(),
  }));
  
  jest.mock("@/lib/prisma", () => ({
    prisma: {
      passwordResetToken: {
        delete: jest.fn(),
        create: jest.fn(),
      },
      verificationToken: {
        delete: jest.fn(),
        create: jest.fn(),
      },
    },
  }));
  
  jest.mock("@/lib/data/password-reset-token", () => ({
    getPasswordResetTokenByEmail: jest.fn(),
  }));
  
  jest.mock("@/lib/data/verification-token", () => ({
    getVerificationTokenByEmail: jest.fn(),
  }));
  

describe("generatePasswordResetToken", () => {
  it("should generate a new token if no existing token is found", async () => {
    (getPasswordResetTokenByEmail as jest.Mock).mockResolvedValue(null);
    (randomUUID as jest.Mock).mockReturnValue("unique-token-id");
    const mockExpires = new Date(new Date().getTime() + 3600 * 1000);
    (prisma.passwordResetToken.create as jest.Mock).mockResolvedValue({
      email: "test@example.com",
      token: "unique-token-id",
      expires: mockExpires,
    });

    const token = await generatePasswordResetToken("test@example.com");
    expect(token).toEqual({
      email: "test@example.com",
      token: "unique-token-id",
      expires: mockExpires,
    });
    expect(prisma.passwordResetToken.delete).not.toHaveBeenCalled();
    expect(prisma.passwordResetToken.create).toHaveBeenCalledWith({
      data: expect.any(Object),
    });
  });
});

describe("generateVerificationToken", () => {
  it("should generate a new token if no existing token is found", async () => {
    (getVerificationTokenByEmail as jest.Mock).mockResolvedValue(null);
    (randomUUID as jest.Mock).mockReturnValue("unique-verification-token-id");
    const mockExpires = new Date(new Date().getTime() + 3600 * 1000);
    (prisma.verificationToken.create as jest.Mock).mockResolvedValue({
      email: "verify@example.com",
      token: "unique-verification-token-id",
      expires: mockExpires,
    });

    const token = await generateVerificationToken("verify@example.com");
    expect(token).toEqual({
      email: "verify@example.com",
      token: "unique-verification-token-id",
      expires: mockExpires,
    });
    expect(prisma.verificationToken.delete).not.toHaveBeenCalled();
    expect(prisma.verificationToken.create).toHaveBeenCalledWith({
      data: expect.any(Object),
    });
  });
});
