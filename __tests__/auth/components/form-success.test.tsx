import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FormSuccess } from '@/components/auth/form-success';

describe('FormSuccess Component', () => {
  it('does not render anything if no message is provided', () => {
    render(<FormSuccess />);
    expect(screen.queryByText(/.+/)).not.toBeInTheDocument();
  });

  it('renders the success message when provided', () => {
    const testMessage = 'Success!';
    render(<FormSuccess message={testMessage} />);
    expect(screen.getByText(testMessage)).toBeInTheDocument();
  });

  it('contains an icon and a message with correct styling when rendered', () => {
    const testMessage = 'Operation successful';
    render(<FormSuccess message={testMessage} />);
    
    const containerDiv = screen.getByText(testMessage).parentNode;
    
    expect(containerDiv).toHaveClass('bg-card p-3 rounded-md flex items-center gap-x-2 text-sm text-emerald-500');
    expect(screen.getByText(testMessage)).toBeInTheDocument();
  });
});
