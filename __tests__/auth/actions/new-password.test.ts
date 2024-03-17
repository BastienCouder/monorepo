
import * as z from 'zod';
import bcrypt from 'bcryptjs';
import * as passwordResetTokenData from '@/lib/data/password-reset-token';
import * as userData from '@/lib/data/user';
import { db } from '@/lib/prisma';
import { newPassword } from '@/server-actions/auth/new-password.action';
import { User } from '@/schemas/db-schema';

jest.mock('bcryptjs', () => ({
    hash: jest.fn().mockResolvedValue('hashedPassword'),
}));
jest.mock('@/lib/prisma', () => ({
    __esModule: true,
    db: {
      user: {
        update: jest.fn().mockResolvedValue({ id: 'user-id', password: 'hashedPassword' }),
      },
      passwordResetToken: {
        delete: jest.fn().mockResolvedValue({ id: 'token-id' }),
      },
    },
  }));
  
jest.mock('@/lib/data/password-reset-token', () => ({
    getPasswordResetTokenByToken: jest.fn(),
}));
jest.mock('@/lib/data/user', () => ({
    getUserByEmail: jest.fn(),
}));

jest.mock('@/lib/data/password-reset-token');

const mockedGetPasswordResetTokenByToken = passwordResetTokenData.getPasswordResetTokenByToken as jest.MockedFunction<typeof passwordResetTokenData.getPasswordResetTokenByToken>;
const mockedGetUserByEmail = userData.getUserByEmail as jest.MockedFunction<typeof userData.getUserByEmail>;

describe('newPassword function', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return an error if token is missing', async () => {
        const result = await newPassword({ password: 'newPassword123' });
        expect(result).toEqual({ error: 'Missing token!' });
    });

    it('should return an error for invalid fields', async () => {
        const result = await newPassword({ password: 'short' }, 'valid-token');
        expect(result).toEqual({ error: 'Invalid fields!' });
    });

    it('should return an error for an invalid token', async () => {
        mockedGetPasswordResetTokenByToken.mockResolvedValueOnce(null);
        const result = await newPassword({ password: 'ValidPassword123' }, 'invalid-token');
        expect(result).toEqual({ error: 'Invalid token!' });
    });

    it('should return an error if the token has expired', async () => {
        const expiredToken = {
            id: 'token-id',
            token: 'expired-token',
            email: 'test@example.com',
            expires: new Date(Date.now() - 1000)
        };
        mockedGetPasswordResetTokenByToken.mockResolvedValueOnce(expiredToken);
        const result = await newPassword({ password: 'ValidPassword123' }, 'expired-token');
        expect(result).toEqual({ error: 'Token has expired!' });
    });

    it('should return an error if the email does not exist', async () => {
        const validToken = {
            id: 'token-id',
            token: 'valid-token',
            email: 'nonexistent@example.com',
            expires: new Date(Date.now() + 1000 * 60 * 60), 
        };
        mockedGetPasswordResetTokenByToken.mockResolvedValueOnce(validToken);
        mockedGetUserByEmail.mockResolvedValueOnce(null);
        const result = await newPassword({ password: 'ValidPassword123' }, 'valid-token');
        expect(result).toEqual({ error: 'Email does not exist!' });
    });

    it('should successfully update the password', async () => {
        const validToken = {
            id: 'token-id',
            token: 'valid-token',
            email: 'existing@example.com',
            expires: new Date(Date.now() + 1000 * 60 * 60),
        };
        const existingUser: User = { id: 'user-id', email: 'existing@example.com' };
        mockedGetPasswordResetTokenByToken.mockResolvedValueOnce(validToken);
        mockedGetUserByEmail.mockResolvedValueOnce(existingUser);
        ((bcrypt.hash as unknown) as jest.Mock).mockResolvedValue('hashedPassword');
        (db.user.update as jest.Mock).mockResolvedValueOnce({ id: 'user-id', password: 'hashedPassword' });
        (db.passwordResetToken.delete as jest.Mock).mockResolvedValueOnce({ id: 'token-id' });

        const result = await newPassword({ password: 'ValidPassword123' }, 'valid-token');
        expect(result).toEqual({ success: 'Password updated!' });
    });
});

