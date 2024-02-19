import { getVerificationTokenByEmail } from '@/lib/data/verification-token';
import { prisma } from '@/lib/prisma';

jest.mock('@/lib/prisma', () => {
    return {
      prisma: {
        verificationToken: {
            findFirst: jest.fn(),
        },
      },
    };
  });

describe('getVerificationTokenByEmail', () => {
    it('should return a verification token object if found', async () => {
      const mockToken = { id: '2', email: 'verify@example.com', token: 'verifyToken456' };
      (prisma.verificationToken.findFirst as jest.Mock).mockResolvedValue(mockToken);
  
      const token = await getVerificationTokenByEmail('verify@example.com');
      expect(token).toEqual(mockToken);
      expect(prisma.verificationToken.findFirst).toHaveBeenCalledWith({
        where: { email: 'verify@example.com' },
      });
    });
  
    it('should return null if no verification token is found', async () => {
      (prisma.verificationToken.findFirst as jest.Mock).mockResolvedValue(null);
  
      const token = await getVerificationTokenByEmail('nonexistent@example.com');
      expect(token).toBeNull();
    });
  });
  