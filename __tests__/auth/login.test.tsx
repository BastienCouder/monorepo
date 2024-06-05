import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import LoginPage from '@/app/(auth)/login/page';
import * as loginAction from '@/server/auth/login.action';

// Mock pour la fonction login
jest.mock('@/app/(auth)/actions/login.action', () => ({
  login: jest.fn((formData, callbackUrl) => Promise.resolve({
    success: true,
  })),
}));
jest.mock('next/navigation', () => ({
  useSearchParams: () => {
    return {
      get: jest.fn((key) => {
        if (key === 'callbackUrl') return 'someCallbackUrl';
        if (key === 'error') return 'OAuthAccountNotLinked';
        return null;
      }),
    };
  },
}));

describe('LoginPage', () => {
  it('renders the login page', () => {
    render(<LoginPage />);
    expect(screen.getByText('Welcome back')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('name@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('******')).toBeInTheDocument();
  });

  it('calls login action on form submit with correct data', async () => {
    render(<LoginPage />);

    // Simuler l'entrée de l'utilisateur
    fireEvent.change(screen.getByPlaceholderText('name@example.com'), { target: { value: 'test@gmail.com' } });
    fireEvent.change(screen.getByPlaceholderText('******'), { target: { value: 'test1234' } });

    // Simuler la soumission du formulaire
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    // Attendre que la promesse de login soit appelée
    await waitFor(() => expect(loginAction.login).toHaveBeenCalled());

    // Vérifier que login a été appelé avec les bonnes données
    expect(loginAction.login).toHaveBeenCalledWith({
      email: 'test@gmail.com',
      password: 'test1234',
    }, 'someCallbackUrl');
  });
});
