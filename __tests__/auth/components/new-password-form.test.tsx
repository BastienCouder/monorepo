import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as newPasswordAction from '@/app/(auth)/actions/new-password.action';
import { NewPasswordForm } from '@/components/auth/new-password-form';

// Mock hooks et fonctions externes
jest.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams('token=some-token')
}));

jest.mock('@/app/(auth)/actions/new-password.action');

describe('NewPasswordForm', () => {
    (newPasswordAction.newPassword as jest.Mock).mockImplementation(() => 
    Promise.resolve({ success: 'Password reset successfully' })
  );

  it('affiche un message de succès après la soumission réussie du formulaire', async () => {
    render(<NewPasswordForm />);

    await userEvent.type(screen.getByPlaceholderText('******'), 'newPassword123');
    await userEvent.click(screen.getByRole('button', { name: /reset password/i }));

    await waitFor(() => {
      expect(screen.getByText(/password reset successfully/i)).toBeInTheDocument();
    });

    expect(newPasswordAction.newPassword).toHaveBeenCalledWith({ password: 'newPassword123' }, 'some-token');
  });

  it('affiche un message d\'erreur si la réinitialisation échoue', async () => {
    (newPasswordAction.newPassword as jest.Mock).mockImplementation(() => 
     Promise.resolve({ error: 'Error resetting password' })
);

    render(<NewPasswordForm />);

    await userEvent.type(screen.getByPlaceholderText('******'), 'newPassword123');
    await userEvent.click(screen.getByRole('button', { name: /reset password/i }));

    await waitFor(() => {
        expect(screen.getByText(/error resetting password/i)).toBeInTheDocument();
    });
  });
});
