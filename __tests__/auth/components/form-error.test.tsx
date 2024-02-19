import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FormError } from '@/components/auth/form-error';

describe('FormError Component', () => {
  it('does not render anything if no message is provided', () => {
    render(<FormError />);
    expect(screen.queryByText(/.+/)).not.toBeInTheDocument();
  });

  it('renders the error message when provided', () => {
    const testMessage = 'This is an error!';
    render(<FormError message={testMessage} />);
    expect(screen.getByText(testMessage)).toBeInTheDocument();
  });

  it('contains a message when rendered', () => {
    const testMessage = 'Another error message';
    render(<FormError message={testMessage} />);
    const containerDiv = screen.getByText(testMessage).parentNode;
    
    expect(containerDiv).toHaveClass('bg-card p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive');
    expect(screen.getByText(testMessage)).toBeInTheDocument();
  });
});
