
import * as bcrypt from 'bcryptjs';
import { db } from '@/lib/prisma';
import * as userData from '@/lib/data/user';
import * as tokens from '@/lib/tokens';
import * as email from '@/lib/email';
import { register } from '@/server-actions/auth/register.action';
import { User } from '@/schemas/db-schema';

jest.mock('bcryptjs', () => ({
    hash: jest.fn().mockResolvedValue('hashedPassword'),
}));
jest.mock('@/lib/prisma', () => ({
    __esModule: true,
    db: {
    user: {
        create: jest.fn(),
    },
}
}));
jest.mock('@/lib/data/user', () => ({
    getUserByEmail: jest.fn(),
}))
jest.mock('@/lib/tokens', () => ({
    generateVerificationToken: jest.fn(),
}));
jest.mock('@/lib/email', () => ({
    sendVerificationEmail: jest.fn(),
}));

const mockGetUserByEmail = userData.getUserByEmail as jest.MockedFunction<typeof userData.getUserByEmail>;

const mockGenerateVerificationToken = tokens.generateVerificationToken as jest.MockedFunction<typeof tokens.generateVerificationToken>;

it('should return an error for invalid fields', async () => {
    const result = await register({ email: 'invalid', password: '', name: 'Test' });
    expect(result).toEqual({ error: 'Invalid fields!' });
});

it('should return an error if the email is already in use', async () => {
    const existingUser: User = { id: 'user-id', email: 'test@example.com' };

    mockGetUserByEmail.mockResolvedValueOnce(existingUser);
    const result = await register({ email: 'test@example.com', password: 'password123', name: 'Test User' });
    expect(result).toEqual({ error: 'Email already in use!' });
});

it('should successfully register a new user and send a verification email', async () => {
    mockGetUserByEmail.mockResolvedValueOnce(null);
    ((bcrypt.hash as unknown) as jest.Mock).mockResolvedValue('hashedPassword');
    mockGenerateVerificationToken.mockResolvedValue({
        id: 'id-token',
        email: 'new@example.com',
        token: 'verification-token',
        expires: new Date(Date.now() + 1000 * 60 * 60),
    });

    const result = await register({ email: 'new@example.com', password: 'password123', name: 'New User' });

    expect(db.user.create).toHaveBeenCalledWith({
        data: {
            name: 'New User',
            email: 'new@example.com',
            password: 'hashedPassword',
        },
    });
    expect(email.sendVerificationEmail).toHaveBeenCalledWith('new@example.com', 'verification-token');
    expect(result).toEqual({ success: 'Confirmation email sent!' });
});
