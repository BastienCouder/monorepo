import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ShowPassword from '@/components/auth/show-password';

describe('ShowPassword Component', () => {
  it('toggles password visibility when the button is clicked', async () => {
    const setPasswordMock = jest.fn();

    render(<ShowPassword password="password" isPending={false} setPassword={setPasswordMock} />);

    expect(screen.getByPlaceholderText('password')).toHaveAttribute('type', 'password');

    const toggleButton = screen.getByRole('button', { name: 'password' });
    await userEvent.click(toggleButton);

    expect(screen.getByPlaceholderText('password')).toHaveAttribute('type', 'text');

    await userEvent.click(toggleButton);
    expect(screen.getByPlaceholderText('password')).toHaveAttribute('type', 'password');
  });

  it('is disabled when isPending is true', () => {
    render(<ShowPassword password="password" isPending={true} setPassword={jest.fn()} />);

    expect(screen.getByPlaceholderText('password')).toBeDisabled();
  });
});
