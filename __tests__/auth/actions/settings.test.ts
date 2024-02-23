// settings.test.ts

import * as userLib from '@/lib/data/user';
import * as authCheck from '@/lib/authCheck';
import * as emailLib from '@/lib/email';
import * as tokensLib from '@/lib/tokens';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/prisma';
import { settings } from '@/app/(auth)/actions/settings';
import { User } from '@/schemas/db-schema';


jest.mock('@/lib/data/user');
jest.mock('@/lib/authCheck');
jest.mock('@/lib/email');
jest.mock('@/lib/tokens');
jest.mock('bcryptjs', () => ({
    ...jest.requireActual('bcryptjs'), // Ceci garde les autres fonctions de bcryptjs intactes et non mockées
    hash: jest.fn().mockResolvedValue('hashedPassword'),
  }));
jest.mock('@/lib/prisma', () => ({
    __esModule: true,
   db: {
    user: {
        update: jest.fn(),
    },}
}));
jest.mock('@/auth', () => ({
    ...jest.requireActual('@/auth'),
    update: jest.fn().mockImplementation(() => Promise.resolve(/* valeur de retour souhaitée */)),
  }));

const mockGetUserByEmail = userLib.getUserByEmail as jest.MockedFunction<typeof userLib.getUserByEmail>;
const mockGetUserById = userLib.getUserById as jest.MockedFunction<typeof userLib.getUserById>;
const mockCurrentUser = authCheck.currentUser as jest.MockedFunction<typeof authCheck.currentUser>;
const mockSendVerificationEmail = emailLib.sendVerificationEmail as jest.MockedFunction<typeof emailLib.sendVerificationEmail>;
const mockGenerateVerificationToken = tokensLib.generateVerificationToken as jest.MockedFunction<typeof tokensLib.generateVerificationToken>;
const mockBcryptHash = bcrypt.hash as jest.MockedFunction<typeof bcrypt.hash>;
const mockPrismaUserUpdate = db.user.update as jest.Mock;

beforeEach(() => {
    jest.resetAllMocks();
    ((bcrypt.hash as unknown) as jest.Mock).mockResolvedValue('hashedPassword');

    // Configurez d'autres mocks ici
  });
it('returns an error if the user is unauthorized', async () => {
    mockCurrentUser.mockResolvedValueOnce(undefined);
    const existingUser: User = { id: 'user-id', email: 'existing@example.com' };

    const values = (existingUser);
    const result = await settings(values);
    expect(result).toEqual({ error: 'Unauthorized' });
});
// it('sends a verification email when changing the email', async () => {
//     const existingUser: User = { id: 'user-id', email: 'existing@example.com' };

//     mockCurrentUser.mockResolvedValueOnce({ id: 'user-id', role: 'USER', isTwoFactorEnabled: false, isOAuth: false });
//     mockGetUserById.mockResolvedValueOnce(existingUser);
//     mockGetUserByEmail.mockResolvedValueOnce(null);
//     mockGenerateVerificationToken.mockResolvedValueOnce({
//         id: 'id-token',
//         email: 'test@example.com',
//         token: 'resetToken123',
//         expires: new Date(Date.now() + 1000 * 60 * 60)
//     });

//     const result = await settings({ email: 'new@example.com',role: 'USER'});

//     expect(mockSendVerificationEmail).toHaveBeenCalledWith('new@example.com', 'verification-token');
//     expect(result).toEqual({ success: 'Verification email sent!' });
// });

// it('updates user settings and changes password successfully', async () => {
//     const UserExemple: User = { id: 'user-id', email: 'existing@example.com' };

//     mockCurrentUser.mockResolvedValueOnce(UserExemple);
//     mockGetUserById.mockResolvedValueOnce(UserExemple);
//     ((bcrypt.hash as unknown) as jest.Mock).mockResolvedValue('hashedPassword');

//     mockPrismaUserUpdate.mockResolvedValueOnce({ id: 'user-id', email: 'user@example.com', isTwoFactorEnabled: true });

//     const result = await settings({ role: 'USER',password: 'oldPassword', newPassword: 'newPassword', isTwoFactorEnabled: true });

//     expect(mockBcryptHash).toHaveBeenCalledWith('newPassword', 10);
//     expect(mockPrismaUserUpdate).toHaveBeenCalled();
//     expect(result).toEqual({ success: 'Settings Updated!' });
// });
