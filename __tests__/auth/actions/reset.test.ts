jest.mock('@/lib/data/user', () => ({
    getUserByEmail: jest.fn(),
  }));
  
  jest.mock('@/lib/tokens', () => ({
    generatePasswordResetToken: jest.fn(),
  }));
  
  jest.mock('@/lib/email', () => ({
    sendPasswordResetEmail: jest.fn(),
  }));
  
import { getUserByEmail } from '@/lib/data/user';
import { generatePasswordResetToken } from '@/lib/tokens';
import { sendPasswordResetEmail } from '@/lib/email';
import { User } from '@/schemas/db-schema';
import { reset } from '@/app/(auth)/actions/reset.action';

const mockGetUserByEmail = getUserByEmail as jest.MockedFunction<typeof getUserByEmail>;
const mockGeneratePasswordResetToken = generatePasswordResetToken as jest.MockedFunction<typeof generatePasswordResetToken>;
const mockSendPasswordResetEmail = sendPasswordResetEmail as jest.MockedFunction<typeof sendPasswordResetEmail>;

describe('reset function', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return an error for invalid email', async () => {
    const result = await reset({ email: 'invalidEmail' });
    expect(result).toEqual({ error: 'Invalid emaiL!' });
  });

  it('should return an error if email not found', async () => {
    mockGetUserByEmail.mockResolvedValueOnce(null);
    const result = await reset({ email: 'test@example.com' });
    expect(result).toEqual({ error: 'Email not found!' });
  });

  it('should send reset email for valid email', async () => {
    const existingUser: User = { id: 'user-id', email: 'existing@example.com' };

    mockGetUserByEmail.mockResolvedValueOnce(existingUser);
    mockGeneratePasswordResetToken.mockResolvedValueOnce({
        id:'id-token',
      email: 'test@example.com',
      token: 'resetToken123',
      expires: new Date(Date.now() + 1000 * 60 * 60),
    });
    const result = await reset({ email: 'test@example.com' });
    expect(mockSendPasswordResetEmail).toHaveBeenCalledWith('test@example.com', 'resetToken123');
    expect(result).toEqual({ success: 'Reset email sent!' });
  });
});
