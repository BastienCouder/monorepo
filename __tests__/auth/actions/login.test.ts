import * as userLib from '@/lib/data/user';
import * as tokensLib from '@/lib/tokens';
import * as emailLib from '@/lib/email';
import { login } from '@/app/(auth)/actions/login.action';
import { User } from '@/schemas/db-schema';

jest.mock('@/lib/data/user');
jest.mock('@/lib/data/two-factor-token');
jest.mock('@/lib/data/two-factor-confirmation');
jest.mock('@/lib/tokens');
jest.mock('@/lib/email');
jest.mock('@/lib/prisma', () => ({
    __esModule: true,
    prisma: {
    user: {
        read: jest.fn(),
    },}
}));
jest.mock('@/auth');


const mockGetUserByEmail = userLib.getUserByEmail as jest.MockedFunction<typeof userLib.getUserByEmail>;
const mockGenerateTwoFactorToken =  tokensLib.generateTwoFactorToken as jest.MockedFunction<typeof tokensLib.generateTwoFactorToken>;
beforeEach(() => {
    jest.resetAllMocks();
    // Et d'autres initialisations au besoin
  });

it('should return an error for invalid fields', async () => {
    const result = await login({ email: 'invalid', password: '', code: '' });
    expect(result).toEqual({ error: 'Invalid fields!' });
  });

  it('should return an error if the email does not exist', async () => {
    const existingUser: User = { id: 'user-id', email: 'user@example.com' };

    mockGetUserByEmail.mockResolvedValueOnce(existingUser);
    const result = await login({ email: 'nonexistent@example.com', password: 'password123', code: '' });
    expect(result).toEqual({ error: 'Email does not exist!' });
  });

//   it('should require two-factor authentication if enabled and no code provided', async () => {
//     const existingUser: User = { id: 'user-id', email: 'user@example.com',password: 'password123' };

//     mockGetUserByEmail.mockResolvedValueOnce(existingUser);
//     mockGenerateTwoFactorToken.mockResolvedValue({id:'user-id', email: 'user@example.com', token: '123456', expires: new Date(Date.now() + 10000) });
//     const result = await login({ email: 'user@example.com', password: 'password123', code: '' });
//     expect(result).toEqual({ twoFactor: true });
//     expect(emailLib.sendTwoFactorTokenEmail).toHaveBeenCalledWith('user@example.com', '123456');
//   });
  