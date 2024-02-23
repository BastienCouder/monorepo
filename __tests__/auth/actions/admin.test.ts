
import { admin } from '@/app/(auth)/actions/admin.action';
import * as authCheck from '@/lib/authCheck';
import { UserRole } from '@prisma/client';

jest.mock('@/lib/authCheck');

describe('admin function', () => {
  it('returns success for admin role', async () => {
    jest.spyOn(authCheck, 'currentRole').mockResolvedValue(UserRole.ADMIN);

    const response = await admin();
    expect(response).toEqual({ success: 'Authorisé !' });
  });

  it('returns error for non-admin roles', async () => {
    jest.spyOn(authCheck, 'currentRole').mockResolvedValue(UserRole.USER);

    const response = await admin();
    expect(response).toEqual({ error: 'Non authorisé !' });
  });
});
