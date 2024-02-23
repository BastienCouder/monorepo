import { updateCourse } from '@/app/(dashboard)/action/update-course';
import * as authCheck from '@/lib/authCheck';
import { db } from '@/lib/prisma';

jest.mock('@/lib/authCheck', () => ({
  currentUser: jest.fn(),
  roleCheckMiddleware: jest.fn(),
}));
jest.mock('@/lib/prisma', () => ({
  db: {
    course: {
      update: jest.fn(),
    },
  },
}));

describe('updateCourse', () => {
  it('returns an error if the user is unauthorized', async () => {
    (authCheck.currentUser as jest.Mock).mockResolvedValue({ userId: 'user-id' });
    (authCheck.roleCheckMiddleware as jest.Mock).mockResolvedValue(false);

    const result = await updateCourse('course-id', { title: 'Updated Course' });

    expect(result).toEqual({ error: 'Unauthorized' });
  });

  it('updates a course if the user is authorized', async () => {
    (authCheck.currentUser as jest.Mock).mockResolvedValue({ userId: 'user-id' });
    (authCheck.roleCheckMiddleware as jest.Mock).mockResolvedValue(true);
    (db.course.update as jest.Mock).mockResolvedValue({
      id: 'course-id',
      userId: 'user-id',
      title: 'Updated Course',
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await updateCourse('course-id', { title: 'Updated Course' });

    expect(result).toHaveProperty('id', 'course-id');
    expect(result).toHaveProperty('title', 'Updated Course');
    expect(db.course.update).toHaveBeenCalledWith({
      where: { id: 'course-id' },
      data: { title: 'Updated Course' },
    });
  });
});
