import { getPasswordResetTokenByEmail } from "@/lib/data/password-reset-token";
import { prisma } from "@/lib/prisma";

jest.mock("@/lib/prisma", () => {
    return {
        prisma: {
            passwordResetToken: {
                findFirst: jest.fn(),
            },
        },
    };
});

describe("getPasswordResetTokenByEmail", () => {

    it("should return a password reset token object if found", async () => {
        const mockToken = { id: "1", email: "test@example.com", token: "resetToken123" };
        (prisma.passwordResetToken.findFirst as jest.Mock).mockResolvedValue(mockToken);

        const token = await getPasswordResetTokenByEmail("test@example.com");
        expect(token).toEqual(mockToken);
        expect(prisma.passwordResetToken.findFirst).toHaveBeenCalledWith({
            where: { email: "test@example.com" },
        });
    });

    it("should return null if no password reset token is found", async () => {
        (prisma.passwordResetToken.findFirst as jest.Mock).mockResolvedValue(null);

        const token = await getPasswordResetTokenByEmail("nonexistent@example.com");
        expect(token).toBeNull();
    });
});