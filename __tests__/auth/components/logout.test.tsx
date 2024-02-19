import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as logoutAction from '@/app/(auth)/actions/logout.action';
import { LogoutButton } from '@/components/auth/logout';

jest.mock('@/app/(auth)/actions/logout.action', () => ({
  logout: jest.fn(),
}));

describe('LogoutButton', () => {
  it('calls the logout function on click', async () => {
    render(<LogoutButton>Logout</LogoutButton>);

   
    const button = screen.getByText('Logout');

    
    await userEvent.click(button);

    
    expect(logoutAction.logout).toHaveBeenCalledTimes(1);
  });

  it('renders its children correctly', () => {
    const buttonText = 'Sign Out';
    render(<LogoutButton>{buttonText}</LogoutButton>);

    
    expect(screen.getByText(buttonText)).toBeInTheDocument();
  });
});
