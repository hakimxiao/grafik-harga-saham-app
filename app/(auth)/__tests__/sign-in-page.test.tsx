import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignIn from '../sign-in/page';

// Mock console methods
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();
const mockConsoleError = jest.spyOn(console, 'log').mockImplementation();

describe('SignIn Page', () => {
  beforeEach(() => {
    mockConsoleLog.mockClear();
    mockConsoleError.mockClear();
  });

  afterAll(() => {
    mockConsoleLog.mockRestore();
    mockConsoleError.mockRestore();
  });

  describe('Rendering', () => {
    it('should render sign in page with title', () => {
      render(<SignIn />);
      
      expect(screen.getByText('Sign In | Signalist')).toBeInTheDocument();
    });

    it('should render email input field', () => {
      render(<SignIn />);
      
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('user@gmail.com')).toBeInTheDocument();
    });

    it('should render password input field', () => {
      render(<SignIn />);
      
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Masukkan password anda')).toBeInTheDocument();
    });

    it('should render submit button', () => {
      render(<SignIn />);
      
      expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
    });

    it('should render footer link to sign up', () => {
      render(<SignIn />);
      
      expect(screen.getByText('Tidak punya akun')).toBeInTheDocument();
      expect(screen.getByText('Sign Up')).toBeInTheDocument();
    });

    it('should have link to sign up page', () => {
      render(<SignIn />);
      
      const signUpLink = screen.getByRole('link', { name: 'Sign Up' });
      expect(signUpLink).toHaveAttribute('href', '/sign-up');
    });
  });

  describe('Form Validation', () => {
    it('should show error when email is empty and form is submitted', async () => {
      const user = userEvent.setup();
      render(<SignIn />);
      
      const submitButton = screen.getByRole('button', { name: 'Sign In' });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Email harus di isi')).toBeInTheDocument();
      });
    });

    it('should show error when password is empty and form is submitted', async () => {
      const user = userEvent.setup();
      render(<SignIn />);
      
      const submitButton = screen.getByRole('button', { name: 'Sign In' });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Password harus di isi')).toBeInTheDocument();
      });
    });

    it('should show both errors when both fields are empty', async () => {
      const user = userEvent.setup();
      render(<SignIn />);
      
      const submitButton = screen.getByRole('button', { name: 'Sign In' });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Email harus di isi')).toBeInTheDocument();
        expect(screen.getByText('Password harus di isi')).toBeInTheDocument();
      });
    });

    it('should validate on blur', async () => {
      const user = userEvent.setup();
      render(<SignIn />);
      
      const emailInput = screen.getByLabelText('Email');
      await user.click(emailInput);
      await user.tab();
      
      await waitFor(() => {
        expect(screen.getByText('Email harus di isi')).toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    it('should call onSubmit with form data when valid', async () => {
      const user = userEvent.setup();
      render(<SignIn />);
      
      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: 'Sign In' });
      
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(mockConsoleLog).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        });
      });
    });

    it('should disable button while submitting', async () => {
      const user = userEvent.setup();
      render(<SignIn />);
      
      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: 'Sign In' });
      
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);
      
      expect(submitButton).toHaveTextContent('Signing In');
    });

    it('should not submit with invalid data', async () => {
      const user = userEvent.setup();
      render(<SignIn />);
      
      const submitButton = screen.getByRole('button', { name: 'Sign In' });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Email harus di isi')).toBeInTheDocument();
      });
      
      expect(mockConsoleLog).not.toHaveBeenCalled();
    });
  });

  describe('User Interactions', () => {
    it('should accept email input', async () => {
      const user = userEvent.setup();
      render(<SignIn />);
      
      const emailInput = screen.getByLabelText('Email');
      await user.type(emailInput, 'user@example.com');
      
      expect(emailInput).toHaveValue('user@example.com');
    });

    it('should accept password input', async () => {
      const user = userEvent.setup();
      render(<SignIn />);
      
      const passwordInput = screen.getByLabelText('Password');
      await user.type(passwordInput, 'mypassword');
      
      expect(passwordInput).toHaveValue('mypassword');
    });

    it('should hide password text', () => {
      render(<SignIn />);
      
      const passwordInput = screen.getByLabelText('Password');
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('should clear validation errors when user types', async () => {
      const user = userEvent.setup();
      render(<SignIn />);
      
      const submitButton = screen.getByRole('button', { name: 'Sign In' });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Email harus di isi')).toBeInTheDocument();
      });
      
      const emailInput = screen.getByLabelText('Email');
      await user.type(emailInput, 'test@example.com');
      
      await waitFor(() => {
        expect(screen.queryByText('Email harus di isi')).not.toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long email', async () => {
      const user = userEvent.setup();
      render(<SignIn />);
      
      const longEmail = 'a'.repeat(100) + '@example.com';
      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      
      await user.type(emailInput, longEmail);
      await user.type(passwordInput, 'password');
      
      const submitButton = screen.getByRole('button', { name: 'Sign In' });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(mockConsoleLog).toHaveBeenCalled();
      });
    });

    it('should handle special characters in password', async () => {
      const user = userEvent.setup();
      render(<SignIn />);
      
      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'P@$$w0rd!#$');
      
      expect(passwordInput).toHaveValue('P@$$w0rd!#$');
    });

    it('should handle multiple rapid submissions', async () => {
      const user = userEvent.setup();
      render(<SignIn />);
      
      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: 'Sign In' });
      
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password');
      
      await user.click(submitButton);
      await user.click(submitButton);
      await user.click(submitButton);
      
      // Should still work normally
      expect(submitButton).toBeInTheDocument();
    });

    it('should handle whitespace in email', async () => {
      const user = userEvent.setup();
      render(<SignIn />);
      
      const emailInput = screen.getByLabelText('Email');
      await user.type(emailInput, '  test@example.com  ');
      
      expect(emailInput).toHaveValue('  test@example.com  ');
    });
  });

  describe('Accessibility', () => {
    it('should have proper form structure', () => {
      render(<SignIn />);
      
      const form = screen.getByRole('button', { name: 'Sign In' }).closest('form');
      expect(form).toBeInTheDocument();
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<SignIn />);
      
      await user.tab();
      expect(screen.getByLabelText('Email')).toHaveFocus();
      
      await user.tab();
      expect(screen.getByLabelText('Password')).toHaveFocus();
      
      await user.tab();
      expect(screen.getByRole('button', { name: 'Sign In' })).toHaveFocus();
    });

    it('should have accessible labels', () => {
      render(<SignIn />);
      
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
    });
  });

  describe('Internationalization', () => {
    it('should display Indonesian error messages', async () => {
      const user = userEvent.setup();
      render(<SignIn />);
      
      const submitButton = screen.getByRole('button', { name: 'Sign In' });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Email harus di isi')).toBeInTheDocument();
        expect(screen.getByText('Password harus di isi')).toBeInTheDocument();
      });
    });

    it('should display Indonesian placeholder text', () => {
      render(<SignIn />);
      
      expect(screen.getByPlaceholderText('Masukkan password anda')).toBeInTheDocument();
    });

    it('should display Indonesian footer text', () => {
      render(<SignIn />);
      
      expect(screen.getByText('Tidak punya akun')).toBeInTheDocument();
    });
  });
});