import { checkEmail, checkIfEmailExists, checkPassword } from '@/lib/helpers/authHelper';
import { db } from '@/lib/prisma';
import * as bcrypt from 'bcryptjs';

jest.mock('@/lib/prisma', () => ({
    db: {
        user: {
            findUnique: jest.fn(),
        },
    },
}));

jest.mock('bcryptjs', () => ({
    compare: jest.fn(),
}));

describe('checkIfEmailExists', () => {
    it('should return true if the email exists', async () => {
        (db.user.findUnique as jest.Mock).mockResolvedValue({ email: 'test@example.com' });

        const exists = await checkIfEmailExists('test@example.com');
        expect(exists).toBe(true);
    });

    it('should return false if the email does not exist', async () => {
        (db.user.findUnique as jest.Mock).mockResolvedValue(null);

        const exists = await checkIfEmailExists('nonexistent@example.com');
        expect(exists).toBe(false);
    });
});

describe('checkEmail', () => {
    it('should return user if the email exists with a password', async () => {
        const mockUser = { email: 'test@example.com', password: 'hashedpassword' };
        (db.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

        const user = await checkEmail('test@example.com');
        expect(user).toEqual(mockUser);
    });

    it('should return null if the email does not exist', async () => {
        (db.user.findUnique as jest.Mock).mockResolvedValue(null);

        const user = await checkEmail('nonexistent@example.com');
        expect(user).toBeNull();
    });
});

describe('checkPassword', () => {
    it('should return true if the password matches', async () => {
        const mockUser = { email: 'test@example.com', password: 'hashedpassword' };
        (db.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);

        const isValid = await checkPassword('test@example.com', 'plaintextpassword');
        expect(isValid).toBe(true);
    });

    it('should return false if the password does not match', async () => {
        const mockUser = { email: 'test@example.com', password: 'hashedpassword' };
        (db.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
        (bcrypt.compare as jest.Mock).mockResolvedValue(false);

        const isValid = await checkPassword('test@example.com', 'wrongpassword');
        expect(isValid).toBe(false);
    });
});

