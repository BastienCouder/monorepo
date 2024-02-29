import { createCourse } from '@/app/(dashboard)/dashboard/(routes)/courses/action/action/create-course';
import * as authCheck from '@/lib/authCheck';
import { db } from '@/lib/prisma';

// Mock des dépendances externes
jest.mock('@/lib/authCheck', () => ({
  currentUser: jest.fn(),
  roleCheckMiddleware: jest.fn(),
}));
jest.mock('@/lib/prisma', () => ({
  db: {
    course: {
      create: jest.fn(),
    },
  },
}));

describe('createCourse', () => {
  it('should throw an error if the user is unauthorized', async () => {
    (authCheck.currentUser as jest.Mock).mockResolvedValue({ id: 'user-id', role: 'USER' });
    (authCheck.roleCheckMiddleware as jest.Mock).mockReturnValue(false);

    await expect(createCourse('user-id', 'Test Course')).rejects.toThrow('Unauthorized');
  });

  it('should create a course if the user is authorized', async () => {
    (authCheck.currentUser as jest.Mock).mockResolvedValue({ id: 'user-id', role: 'ADMIN' });
    (authCheck.roleCheckMiddleware as jest.Mock).mockReturnValue(true);
    (db.course.create as jest.Mock).mockResolvedValue({ id: 'course-id', userId: 'user-id', title: 'Test Course' });

    const result = await createCourse('user-id', 'Test Course');

    expect(result).toEqual({ id: 'course-id', userId: 'user-id', title: 'Test Course' });
    expect(db.course.create).toHaveBeenCalledWith({
      data: {
        userId: 'user-id',
        title: 'Test Course',
      },
    });
  });
});
