import { getAccountByUserId } from '@/lib/data/account';
import { db } from '@/lib/prisma';

jest.mock('@/lib/prisma', () => {
  return {
    db: {
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
    (db.account.findFirst as jest.Mock).mockResolvedValue(mockAccount);

    const account = await getAccountByUserId('1');
    expect(account).toEqual(mockAccount);
    expect(db.account.findFirst).toHaveBeenCalledWith({
      where: { userId: '1' },
    });
  });

  it('should return null if no account is found', async () => {
    (db.account.findFirst as jest.Mock).mockResolvedValue(null);

    const account = await getAccountByUserId('nonexistent');
    expect(account).toBeNull();
  });
});
