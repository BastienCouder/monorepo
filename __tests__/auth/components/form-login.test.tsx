import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as loginAction from '@/app/(auth)/actions/login.action';
import LoginForm from '@/components/auth/form-login';

jest.mock('@/auth', () => ({
  signIn: jest.fn(),
}));

jest.mock('@/app/(auth)/actions/login.action');
jest.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
}));

describe('LoginForm', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('renders correctly and submits with valid data', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    // Mock successful login
    (loginAction.login  as jest.Mock).mockResolvedValue({ success: 'Login successful' });

    // Fill in the form
    await user.type(screen.getByPlaceholderText('Email'), 'user@example.com');
    await user.type(screen.getByPlaceholderText('password'), 'password123');
    await user.click(screen.getByRole('button', { name: /login/i }));

    // Expect login to be called with correct values
    expect(loginAction.login  as jest.Mock).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'password123',
    }, undefined); // Assuming no callbackUrl is provided in this test scenario

    // Optionally, wait for success message to be displayed
    await waitFor(() => {
      expect(screen.getByText(/Login successful/i)).toBeInTheDocument();
    });
  });

});
