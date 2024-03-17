import { newVerification } from '@/server-actions/auth/new-verification';
import { getUserByEmail } from '@/lib/data/user';
import { getVerificationTokenByToken } from '@/lib/data/verification-token';
import { db } from '@/lib/prisma';
import { User } from '@/schemas/db-schema';

jest.mock('@/lib/data/user', () => ({
  getUserByEmail: jest.fn(),
}));
jest.mock('@/lib/data/verification-token', () => ({
  getVerificationTokenByToken: jest.fn(),
}));
jest.mock('@/lib/prisma', () => ({
  db: {
    user: {
      update: jest.fn(),
    },
    verificationToken: {
      delete: jest.fn(),
    },
  },
}));

const mockGetVerificationTokenByToken = getVerificationTokenByToken as jest.MockedFunction<typeof getVerificationTokenByToken>;
const mockGetUserByEmail = getUserByEmail as jest.MockedFunction<typeof getUserByEmail>;

it('returns an error if the token does not exist', async () => {
    mockGetVerificationTokenByToken.mockResolvedValueOnce(null);
    const result = await newVerification('nonexistent-token');
    expect(result).toEqual({ error: 'Token does not exist!' });
  });

  it('returns an error if the token has expired', async () => {
    mockGetVerificationTokenByToken.mockResolvedValueOnce({
      id: 'token-id',
      email: 'user@example.com',
      token:'token1234',
      expires: new Date(Date.now() - 1000), 
    });
    const result = await newVerification('expired-token');
    expect(result).toEqual({ error: 'Token has expired!' });
  });
  
  it('returns an error if the email does not exist', async () => {
    mockGetVerificationTokenByToken.mockResolvedValueOnce({
      id: 'token-id',
      email: 'nonexistent@example.com',
      token:'token1234',
      expires: new Date(Date.now() + 1000 * 60 * 60),
    });
    mockGetUserByEmail.mockResolvedValueOnce(null);
    const result = await newVerification('valid-token');
    expect(result).toEqual({ error: 'Email does not exist!' });
  });

  it('verifies the email successfully', async () => {
    const existingUser: User = { id: 'user-id', email: 'test@example.com' };

    mockGetVerificationTokenByToken.mockResolvedValueOnce({
      id: 'token-id',
      email: 'user@example.com',
      token:'token1234',
      expires: new Date(Date.now() + 1000 * 60 * 60),
    });
    mockGetUserByEmail.mockResolvedValueOnce(existingUser);
    const result = await newVerification('valid-token');
    expect(db.user.update).toHaveBeenCalledWith({
      where: { id: 'user-id' },
      data: {
        emailVerified: expect.any(Date),
        email: 'user@example.com',
      },
    });
    expect(db.verificationToken.delete).toHaveBeenCalledWith({
      where: { id: 'token-id' },
    });
    expect(result).toEqual({ success: 'Email verified!' });
  });
  