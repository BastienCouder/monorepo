import { auth } from '@/auth';
import { currentRole, currentUser, roleCheckMiddleware } from '@/lib/authCheck';

jest.mock('@/auth', () => ({
    auth: jest.fn(),
}));

describe('currentUser', () => {
    it('should return the current user if there is a session', async () => {
        const mockSession = { user: { id: '1', name: 'John Doe', role: 'USER' } };
        (auth as jest.Mock).mockResolvedValue(mockSession);

        const user = await currentUser();
        expect(user).toEqual(mockSession.user);
    });

    it('should return undefined if there is no session', async () => {
        (auth as jest.Mock).mockResolvedValue(null);

        const user = await currentUser();
        expect(user).toBeUndefined();
    });
});

describe('currentRole', () => {
    it('should return the role of the current user if there is a session', async () => {
      const mockSession = { user: { id: '1', name: 'John Doe', role: 'ADMIN' } };
      (auth as jest.Mock).mockResolvedValue(mockSession);
  
      const role = await currentRole();
      expect(role).toEqual('ADMIN');
    });
  
    it('should return undefined if there is no session', async () => {
      (auth as jest.Mock).mockResolvedValue(null);
  
      const role = await currentRole();
      expect(role).toBeUndefined();
    });
  });
  

describe('roleCheckMiddleware', () => {
  it('should return true if the session role is in the specific roles', () => {
    const mockSession = { role: 'ADMIN' };

    const isAllowed = roleCheckMiddleware(mockSession);
    expect(isAllowed).toBe(true);
  });

  it('should return false if the session role is not in the specific roles', () => {
    const mockSession = { role: 'USER' };

    const isAllowed = roleCheckMiddleware(mockSession);
    expect(isAllowed).toBe(false);
  });

  it('should return false if there is no session or role', () => {
    const mockSession = {};

    const isAllowed = roleCheckMiddleware(mockSession);
    expect(isAllowed).toBe(false);
  });
});
