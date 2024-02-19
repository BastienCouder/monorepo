// import React from 'react';
// import { render, screen, waitFor, fireEvent } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
// import { register } from '@/app/(auth)/actions/register.action';
// import RegisterForm from '@/components/auth/form-register';

// // Mocking the external dependencies
// jest.mock('next-auth/react', () => ({
//   signIn: jest.fn(),
// }));

// jest.mock('@/app/(auth)/actions/register.action');

// // Optional: Mock Zod if you're manipulating or bypassing validations in tests
// describe('RegisterForm', () => {
//   it('submits form with valid data', async () => {
//     const user = userEvent.setup();
//     render(<RegisterForm />);

//     // Mock implementation if needed, e.g., for testing loading states
//     (register as jest.Mock).mockResolvedValue({ success: 'Account created successfully' });
    
//     await user.type(screen.getByPlaceholderText('name'), 'John Doe');
//     await user.type(screen.getByPlaceholderText('email'), 'john@example.com');
//     await user.type(screen.getByPlaceholderText('password'), 'password123');
//     await user.click(screen.getByRole('button', { name: /register/i }));

//     expect(register).toHaveBeenCalledWith({
//       name: 'John Doe',
//       email: 'john@example.com',
//       password: 'password123',
//     });
//   });
// });
// it('displays success message on successful registration', async () => {
//   (register as jest.Mock).mockResolvedValue({ success: 'Account created successfully' });
//   render(<RegisterForm />);

//   const user = userEvent.setup();
//   await user.type(screen.getByPlaceholderText('email'), 'john@example.com');
//   await user.type(screen.getByPlaceholderText('password'), 'password123');
//   await user.click(screen.getByRole('button', { name: /register/i }));

//   await waitFor(() => {
//     expect(screen.getByText(/account created successfully/i)).toBeInTheDocument();
//   });
// });
// it('displays error message on registration failure', async () => {
//   (register as jest.Mock).mockResolvedValue
//   ({ error: 'Registration failed'  });
//   render(<RegisterForm />);

//   const user = userEvent.setup();
//   await user.type(screen.getByPlaceholderText('email'), 'john@example.com');
//   await user.type(screen.getByPlaceholderText('password'), 'password123');
//   await user.click(screen.getByRole('button', { name: /register/i }));

//   await waitFor(() => {
//     expect(screen.getByText(/registration failed/i)).toBeInTheDocument();
//   });
// });
