import { getPasswordResetTokenByEmail, getPasswordResetTokenByToken } from '@/lib/auth/password-reset-token';
import { db } from '@/lib/prisma';

jest.mock('@/lib/prisma', () => {
    return {
        db: {
            passwordResetToken: {
                findFirst: jest.fn(),
                findUnique: jest.fn(),
            },
        },
    };
});

describe('getPasswordResetTokenByEmail', () => {

    it('should return a password reset token object if found', async () => {
        const mockToken = { id: '1', email: 'test@example.com', token: 'resetToken123' };
        (db.passwordResetToken.findFirst as jest.Mock).mockResolvedValue(mockToken);

        const token = await getPasswordResetTokenByEmail('test@example.com');
        expect(token).toEqual(mockToken);
        expect(db.passwordResetToken.findFirst).toHaveBeenCalledWith({
            where: { email: 'test@example.com' },
        });
    });

    it('should return null if no password reset token is found', async () => {
        (db.passwordResetToken.findFirst as jest.Mock).mockResolvedValue(null);

        const token = await getPasswordResetTokenByEmail('nonexistent@example.com');
        expect(token).toBeNull();
    });
});
describe('getPasswordResetTokenByToken', () => {
    it('should return a password reset token object if found', async () => {
        const mockToken = { id: '1', email: 'test@example.com', token: 'resetToken123' };
        (db.passwordResetToken.findUnique as jest.Mock).mockResolvedValue(mockToken);

        const token = await getPasswordResetTokenByToken('resetToken123');
        expect(token).toEqual(mockToken);
        expect(db.passwordResetToken.findUnique).toHaveBeenCalledWith({
            where: { token: 'resetToken123' },
        });
    });

    it('should return null if no password reset token is found', async () => {
        (db.passwordResetToken.findUnique as jest.Mock).mockResolvedValue(null);

        const token = await getPasswordResetTokenByToken('nonexistentresetToken123');
        expect(token).toBeNull();
    });
});