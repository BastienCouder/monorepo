import { createCategory } from '@/app/(dashboard)/dashboard/(routes)/courses/action/action/category';
import * as authCheck from '@/lib/authCheck';
import { db } from '@/lib/prisma';

// Mock des dépendances externes
jest.mock('@/lib/authCheck', () => ({
  currentUser: jest.fn(),
  roleCheckMiddleware: jest.fn(),
}));
jest.mock('@/lib/prisma', () => ({
  db: {
    category: {
      create: jest.fn(),
    },
  },
}));

describe('createCategory', () => {
  it('should throw an error if the user is unauthorized', async () => {
    (authCheck.currentUser as jest.Mock).mockResolvedValue({ id: 'user-id', role: 'USER' });
    (authCheck.roleCheckMiddleware as jest.Mock).mockReturnValue(false);

    await expect(createCategory({name: 'Test Category' })).rejects.toThrow('Unauthorized');
  });

  it('should create a category if the user is authorized', async () => {
    (authCheck.currentUser as jest.Mock).mockResolvedValue({ id: 'user-id', role: 'ADMIN' });
    (authCheck.roleCheckMiddleware as jest.Mock).mockReturnValue(true);
    (db.category.create as jest.Mock).mockResolvedValue({ id: 'course-id', name: 'Test Category' });

    const result = await createCategory({ name: 'Test Category'});

    expect(result).toEqual({ success: 'Category Create Successfully!' });
    expect(db.category.create).toHaveBeenCalledWith({
      data: {
        name: 'Test Category',
      },
    });
  });
});
