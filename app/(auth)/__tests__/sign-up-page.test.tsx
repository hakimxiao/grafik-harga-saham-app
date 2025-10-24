import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignUp from '../sign-up/page';

// Mock console methods
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();

describe('SignUp Page', () => {
  beforeEach(() => {
    mockConsoleLog.mockClear();
  });

  afterAll(() => {
    mockConsoleLog.mockRestore();
  });

  describe('Rendering', () => {
    it('should render sign up page with title', () => {
      render(<SignUp />);
      
      expect(screen.getByText('Sign Up & Personalize')).toBeInTheDocument();
    });

    it('should render full name input field', () => {
      render(<SignUp />);
      
      expect(screen.getByLabelText('Nama Lengkap')).toBeInTheDocument();
    });

    it('should render email input field', () => {
      render(<SignUp />);
      
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
    });

    it('should render password input field', () => {
      render(<SignUp />);
      
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
    });

    it('should render country select field', () => {
      render(<SignUp />);
      
      expect(screen.getByText('Negara')).toBeInTheDocument();
    });

    it('should render investment goals select', () => {
      render(<SignUp />);
      
      expect(screen.getByText('Tujuan Investasi')).toBeInTheDocument();
    });

    it('should render risk tolerance select', () => {
      render(<SignUp />);
      
      expect(screen.getByText('Toleransi Resiko')).toBeInTheDocument();
    });

    it('should render preferred industry select', () => {
      render(<SignUp />);
      
      expect(screen.getByText('Industri Pilihan')).toBeInTheDocument();
    });

    it('should render submit button', () => {
      render(<SignUp />);
      
      expect(screen.getByRole('button', { name: 'Mulailah Perjalanan Investasi Anda' })).toBeInTheDocument();
    });

    it('should render footer link to sign in', () => {
      render(<SignUp />);
      
      expect(screen.getByText('Sudah punya aku')).toBeInTheDocument();
      expect(screen.getByText('Sign In')).toBeInTheDocument();
    });
  });

  describe('Default Values', () => {
    it('should have US as default country', () => {
      render(<SignUp />);
      
      expect(screen.getByText('United States')).toBeInTheDocument();
    });

    it('should have Growth as default investment goal', () => {
      render(<SignUp />);
      
      const investmentGoalsSelect = screen.getByText('Pertumbuhan');
      expect(investmentGoalsSelect).toBeInTheDocument();
    });

    it('should have Medium as default risk tolerance', () => {
      render(<SignUp />);
      
      expect(screen.getByText('Sedang')).toBeInTheDocument();
    });

    it('should have Technology as default preferred industry', () => {
      render(<SignUp />);
      
      expect(screen.getByText('Teknologi')).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should show error when full name is empty', async () => {
      const user = userEvent.setup();
      render(<SignUp />);
      
      const fullNameInput = screen.getByLabelText('Nama Lengkap');
      await user.click(fullNameInput);
      await user.tab();
      
      await waitFor(() => {
        expect(screen.getByText('Nama lengkap harus di isi')).toBeInTheDocument();
      });
    });

    it('should show error when email is empty', async () => {
      const user = userEvent.setup();
      render(<SignUp />);
      
      const emailInput = screen.getByLabelText('Email');
      await user.click(emailInput);
      await user.tab();
      
      await waitFor(() => {
        expect(screen.getByText('Email harus di isi')).toBeInTheDocument();
      });
    });

    it('should show error when password is empty', async () => {
      const user = userEvent.setup();
      render(<SignUp />);
      
      const passwordInput = screen.getByLabelText('Password');
      await user.click(passwordInput);
      await user.tab();
      
      await waitFor(() => {
        expect(screen.getByText('Password harus di isi')).toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    it('should submit form with all required fields filled', async () => {
      const user = userEvent.setup();
      render(<SignUp />);
      
      // Fill in form fields
      const fullNameInput = screen.getByLabelText('Nama Lengkap');
      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      
      await user.type(fullNameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(passwordInput, 'SecurePass123');
      
      const submitButton = screen.getByRole('button', { name: 'Mulailah Perjalanan Investasi Anda' });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(mockConsoleLog).toHaveBeenCalledWith(
          expect.objectContaining({
            fullName: 'John Doe',
            email: 'john@example.com',
            password: 'SecurePass123',
            country: 'US',
            investmentGoals: 'Growth',
            riskTolerance: 'Medium',
            preferredIndustry: 'Technology',
          })
        );
      });
    });

    it('should show submitting state on button', async () => {
      const user = userEvent.setup();
      render(<SignUp />);
      
      const fullNameInput = screen.getByLabelText('Nama Lengkap');
      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      
      await user.type(fullNameInput, 'Jane Doe');
      await user.type(emailInput, 'jane@example.com');
      await user.type(passwordInput, 'password123');
      
      const submitButton = screen.getByRole('button', { name: 'Mulailah Perjalanan Investasi Anda' });
      await user.click(submitButton);
      
      expect(submitButton).toHaveTextContent('Membuat akun');
    });
  });

  describe('User Interactions', () => {
    it('should accept text input in full name field', async () => {
      const user = userEvent.setup();
      render(<SignUp />);
      
      const fullNameInput = screen.getByLabelText('Nama Lengkap');
      await user.type(fullNameInput, 'Test User');
      
      expect(fullNameInput).toHaveValue('Test User');
    });

    it('should accept email input', async () => {
      const user = userEvent.setup();
      render(<SignUp />);
      
      const emailInput = screen.getByLabelText('Email');
      await user.type(emailInput, 'test@example.com');
      
      expect(emailInput).toHaveValue('test@example.com');
    });

    it('should accept password input and hide it', async () => {
      const user = userEvent.setup();
      render(<SignUp />);
      
      const passwordInput = screen.getByLabelText('Password');
      expect(passwordInput).toHaveAttribute('type', 'password');
      
      await user.type(passwordInput, 'MySecretPassword');
      expect(passwordInput).toHaveValue('MySecretPassword');
    });

    it('should allow changing country selection', async () => {
      const user = userEvent.setup();
      render(<SignUp />);
      
      const countryButton = screen.getByRole('combobox', { name: /negara/i });
      await user.click(countryButton);
      
      await waitFor(() => {
        expect(screen.getByText('Canada')).toBeInTheDocument();
      });
    });

    it('should allow changing investment goals', async () => {
      const user = userEvent.setup();
      render(<SignUp />);
      
      const investmentGoalsButton = screen.getAllByRole('combobox')[1];
      await user.click(investmentGoalsButton);
      
      await waitFor(() => {
        expect(screen.getByText('Pendapatan')).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle full name with special characters', async () => {
      const user = userEvent.setup();
      render(<SignUp />);
      
      const fullNameInput = screen.getByLabelText('Nama Lengkap');
      await user.type(fullNameInput, "O'Brien-Smith");
      
      expect(fullNameInput).toHaveValue("O'Brien-Smith");
    });

    it('should handle unicode characters in full name', async () => {
      const user = userEvent.setup();
      render(<SignUp />);
      
      const fullNameInput = screen.getByLabelText('Nama Lengkap');
      await user.type(fullNameInput, 'José María');
      
      expect(fullNameInput).toHaveValue('José María');
    });

    it('should handle very long password', async () => {
      const user = userEvent.setup();
      render(<SignUp />);
      
      const longPassword = 'a'.repeat(100);
      const passwordInput = screen.getByLabelText('Password');
      await user.type(passwordInput, longPassword);
      
      expect(passwordInput).toHaveValue(longPassword);
    });

    it('should handle email with plus addressing', async () => {
      const user = userEvent.setup();
      render(<SignUp />);
      
      const emailInput = screen.getByLabelText('Email');
      await user.type(emailInput, 'user+test@example.com');
      
      expect(emailInput).toHaveValue('user+test@example.com');
    });
  });

  describe('Accessibility', () => {
    it('should have proper form structure', () => {
      render(<SignUp />);
      
      const form = screen.getByRole('button', { name: 'Mulailah Perjalanan Investasi Anda' }).closest('form');
      expect(form).toBeInTheDocument();
    });

    it('should support keyboard navigation through fields', async () => {
      const user = userEvent.setup();
      render(<SignUp />);
      
      await user.tab();
      expect(screen.getByLabelText('Nama Lengkap')).toHaveFocus();
      
      await user.tab();
      expect(screen.getByLabelText('Email')).toHaveFocus();
      
      await user.tab();
      expect(screen.getByLabelText('Password')).toHaveFocus();
    });

    it('should have accessible labels for all fields', () => {
      render(<SignUp />);
      
      expect(screen.getByLabelText('Nama Lengkap')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
      expect(screen.getByText('Negara')).toBeInTheDocument();
    });
  });

  describe('Internationalization', () => {
    it('should display Indonesian labels', () => {
      render(<SignUp />);
      
      expect(screen.getByText('Nama Lengkap')).toBeInTheDocument();
      expect(screen.getByText('Negara')).toBeInTheDocument();
      expect(screen.getByText('Tujuan Investasi')).toBeInTheDocument();
      expect(screen.getByText('Toleransi Resiko')).toBeInTheDocument();
      expect(screen.getByText('Industri Pilihan')).toBeInTheDocument();
    });

    it('should display Indonesian placeholder text', () => {
      render(<SignUp />);
      
      expect(screen.getByPlaceholderText('Jaka Dantara')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Masukkan katasandi yang kuat')).toBeInTheDocument();
    });

    it('should display Indonesian button text', () => {
      render(<SignUp />);
      
      expect(screen.getByRole('button', { name: 'Mulailah Perjalanan Investasi Anda' })).toBeInTheDocument();
    });

    it('should display Indonesian error messages', async () => {
      const user = userEvent.setup();
      render(<SignUp />);
      
      const fullNameInput = screen.getByLabelText('Nama Lengkap');
      await user.click(fullNameInput);
      await user.tab();
      
      await waitFor(() => {
        expect(screen.getByText('Nama lengkap harus di isi')).toBeInTheDocument();
      });
    });
  });

  describe('Integration with Select Components', () => {
    it('should work with all select fields', async () => {
      const user = userEvent.setup();
      render(<SignUp />);
      
      // Investment Goals
      const investmentGoalsButton = screen.getAllByRole('combobox')[1];
      await user.click(investmentGoalsButton);
      
      await waitFor(() => {
        expect(screen.getByText('Pendapatan')).toBeInTheDocument();
      });
      
      // Risk Tolerance
      const riskButton = screen.getAllByRole('combobox')[2];
      await user.click(riskButton);
      
      await waitFor(() => {
        expect(screen.getByText('Tinggi')).toBeInTheDocument();
      });
    });
  });
});