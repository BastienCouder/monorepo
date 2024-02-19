import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { reset } from '@/app/(auth)/actions/reset.action';
import { ResetForm } from '@/components/auth/reset-form';
import * as resetAction from '@/app/(auth)/actions/reset.action';

jest.mock('@/app/(auth)/actions/reset.action', () => ({
  reset: jest.fn(),
}));

const mockReset = resetAction.reset as jest.MockedFunction<typeof resetAction.reset>;

mockReset.mockImplementation(() =>
  Promise.resolve({ success: 'Reset email sent successfully!' })
);

describe('ResetForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('submits the form and displays success message', async () => {
    render(<ResetForm />);

    await userEvent.type(screen.getByPlaceholderText('user@exemple.com'), 'user@example.com');
    await userEvent.click(screen.getByRole('button', { name: 'Send reset email' }));

    await waitFor(() => expect(screen.getByText('Reset email sent successfully!')).toBeInTheDocument());

    expect(reset).toHaveBeenCalledWith({ email: 'user@example.com' });
  });

  it('displays an error message on submission failure', async () => {
    mockReset.mockImplementation(() => Promise.resolve({ error: 'An error occurred' }));

    render(<ResetForm />);

    await userEvent.type(screen.getByPlaceholderText('user@exemple.com'), 'user@example.com');
    await userEvent.click(screen.getByRole('button', { name: 'Send reset email' }));

    await waitFor(() => expect(screen.getByText('An error occurred')).toBeInTheDocument());
  });
});
