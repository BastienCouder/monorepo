import { getUserByEmail, getUserById } from '@/lib/auth/user';
import { db } from '@/lib/prisma';

jest.mock('@/lib/prisma', () => {
  return {
    db: {
      user: {
        findUnique: jest.fn(),
      },
    },
  };
});

describe('getUserByEmail', () => {
  it('should return a user object if the user is found', async () => {
    const mockUser = { id: '1', email: 'test@example.com', name: 'Test User' };
    (db.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    const user = await getUserByEmail('test@example.com');
    expect(user).toEqual(mockUser);
    expect(db.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'test@example.com' },
    });
  });

  it('should return null if no user is found', async () => {
    (db.user.findUnique as jest.Mock).mockResolvedValue(null);

    const user = await getUserByEmail('nonexistent@example.com');
    expect(user).toBeNull();
  });
});

describe('getUserById', () => {
  it('should return a user object if the user is found', async () => {
    const mockUser = { id: '1', email: 'test@example.com', name: 'Test User' };
    (db.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    const user = await getUserById('1');
    expect(user).toEqual(mockUser);
    expect(db.user.findUnique).toHaveBeenCalledWith({
      where: { id: '1' },
    });
  });

  it('should return null if no user is found', async () => {
    (db.user.findUnique as jest.Mock).mockResolvedValue(null);

    const user = await getUserById('nonexistent');
    expect(user).toBeNull();
  });
});
