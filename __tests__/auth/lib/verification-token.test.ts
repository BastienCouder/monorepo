import { getVerificationTokenByEmail } from '@/lib/auth/verification-token';
import { db } from '@/lib/prisma';

jest.mock('@/lib/prisma', () => {
    return {
      db: {
        verificationToken: {
            findFirst: jest.fn(),
        },
      },
    };
  });

describe('getVerificationTokenByEmail', () => {
    it('should return a verification token object if found', async () => {
      const mockToken = { id: '2', email: 'verify@example.com', token: 'verifyToken456' };
      (db.verificationToken.findFirst as jest.Mock).mockResolvedValue(mockToken);
  
      const token = await getVerificationTokenByEmail('verify@example.com');
      expect(token).toEqual(mockToken);
      expect(db.verificationToken.findFirst).toHaveBeenCalledWith({
        where: { email: 'verify@example.com' },
      });
    });
  
    it('should return null if no verification token is found', async () => {
      (db.verificationToken.findFirst as jest.Mock).mockResolvedValue(null);
  
      const token = await getVerificationTokenByEmail('nonexistent@example.com');
      expect(token).toBeNull();
    });
  });
  