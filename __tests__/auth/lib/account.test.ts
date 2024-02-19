import { getAccountByUserId } from '@/lib/data/account';
import { prisma } from '@/lib/prisma';

jest.mock('@/lib/prisma', () => {
  return {
    prisma: {
      account: {
        findFirst: jest.fn(),
      },
    },
  };
});

describe('getAccountByUserId', () => {
  it('should return an account object if found', async () => {
    const mockAccount = {
      id: '3',
      userId: '1',
      provider: 'provider',
      type: 'type',
    };
    (prisma.account.findFirst as jest.Mock).mockResolvedValue(mockAccount);

    const account = await getAccountByUserId('1');
    expect(account).toEqual(mockAccount);
    expect(prisma.account.findFirst).toHaveBeenCalledWith({
      where: { userId: '1' },
    });
  });

  it('should return null if no account is found', async () => {
    (prisma.account.findFirst as jest.Mock).mockResolvedValue(null);

    const account = await getAccountByUserId('nonexistent');
    expect(account).toBeNull();
  });
});
