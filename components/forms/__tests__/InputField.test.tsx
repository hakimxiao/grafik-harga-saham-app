import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import InputField from '../InputField';

// Wrapper component to provide react-hook-form context
const InputFieldWrapper = ({
  name = 'testInput',
  label = 'Test Label',
  placeholder = 'Test Placeholder',
  type = 'text',
  validation = {},
  disabled = false,
  defaultValue = '',
}: {
  name?: string;
  label?: string;
  placeholder?: string;
  type?: string;
  validation?: object;
  disabled?: boolean;
  defaultValue?: string;
}) => {
  const {
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      [name]: defaultValue,
    },
  });

  return (
    <InputField
      name={name}
      label={label}
      placeholder={placeholder}
      type={type}
      register={register}
      error={errors[name]}
      validation={validation}
      disabled={disabled}
    />
  );
};

describe('InputField', () => {
  describe('Rendering', () => {
    it('should render with label and input field', () => {
      render(<InputFieldWrapper />);
      
      expect(screen.getByText('Test Label')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Test Placeholder')).toBeInTheDocument();
    });

    it('should render with correct input type', () => {
      render(<InputFieldWrapper type="password" />);
      
      const input = screen.getByPlaceholderText('Test Placeholder');
      expect(input).toHaveAttribute('type', 'password');
    });

    it('should render with email type', () => {
      render(<InputFieldWrapper type="email" placeholder="Enter email" />);
      
      const input = screen.getByPlaceholderText('Enter email');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('should have correct id attribute matching name prop', () => {
      render(<InputFieldWrapper name="emailField" />);
      
      const input = screen.getByPlaceholderText('Test Placeholder');
      expect(input).toHaveAttribute('id', 'emailField');
    });

    it('should associate label with input using htmlFor', () => {
      render(<InputFieldWrapper name="testField" label="Test Field" />);
      
      const label = screen.getByText('Test Field');
      const input = screen.getByPlaceholderText('Test Placeholder');
      
      expect(label).toHaveAttribute('for', 'testField');
      expect(input).toHaveAttribute('id', 'testField');
    });
  });

  describe('Disabled State', () => {
    it('should render disabled input when disabled prop is true', () => {
      render(<InputFieldWrapper disabled={true} />);
      
      const input = screen.getByPlaceholderText('Test Placeholder');
      expect(input).toBeDisabled();
    });

    it('should apply disabled styles', () => {
      render(<InputFieldWrapper disabled={true} />);
      
      const input = screen.getByPlaceholderText('Test Placeholder');
      expect(input).toHaveClass('opacity-50', 'cursor-not-allowed');
    });

    it('should not accept input when disabled', async () => {
      const user = userEvent.setup();
      render(<InputFieldWrapper disabled={true} />);
      
      const input = screen.getByPlaceholderText('Test Placeholder');
      await user.type(input, 'test');
      
      expect(input).toHaveValue('');
    });
  });

  describe('User Interactions', () => {
    it('should accept text input', async () => {
      const user = userEvent.setup();
      render(<InputFieldWrapper />);
      
      const input = screen.getByPlaceholderText('Test Placeholder');
      await user.type(input, 'Hello World');
      
      expect(input).toHaveValue('Hello World');
    });

    it('should accept special characters', async () => {
      const user = userEvent.setup();
      render(<InputFieldWrapper />);
      
      const input = screen.getByPlaceholderText('Test Placeholder');
      await user.type(input, '!@#$%^&*()');
      
      expect(input).toHaveValue('!@#$%^&*()');
    });

    it('should handle clearing input', async () => {
      const user = userEvent.setup();
      render(<InputFieldWrapper defaultValue="Initial Value" />);
      
      const input = screen.getByPlaceholderText('Test Placeholder');
      expect(input).toHaveValue('Initial Value');
      
      await user.clear(input);
      expect(input).toHaveValue('');
    });

    it('should accept numeric input in text field', async () => {
      const user = userEvent.setup();
      render(<InputFieldWrapper />);
      
      const input = screen.getByPlaceholderText('Test Placeholder');
      await user.type(input, '12345');
      
      expect(input).toHaveValue('12345');
    });

    it('should handle paste events', async () => {
      const user = userEvent.setup();
      render(<InputFieldWrapper />);
      
      const input = screen.getByPlaceholderText('Test Placeholder');
      await user.click(input);
      await user.paste('Pasted Text');
      
      expect(input).toHaveValue('Pasted Text');
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long input', async () => {
      const user = userEvent.setup();
      render(<InputFieldWrapper />);
      
      const longText = 'a'.repeat(1000);
      const input = screen.getByPlaceholderText('Test Placeholder');
      await user.type(input, longText);
      
      expect(input).toHaveValue(longText);
    });

    it('should handle unicode characters', async () => {
      const user = userEvent.setup();
      render(<InputFieldWrapper />);
      
      const input = screen.getByPlaceholderText('Test Placeholder');
      await user.type(input, '你好世界 🌍');
      
      expect(input).toHaveValue('你好世界 🌍');
    });

    it('should handle empty string as value', () => {
      render(<InputFieldWrapper defaultValue="" />);
      
      const input = screen.getByPlaceholderText('Test Placeholder');
      expect(input).toHaveValue('');
    });

    it('should handle whitespace-only input', async () => {
      const user = userEvent.setup();
      render(<InputFieldWrapper />);
      
      const input = screen.getByPlaceholderText('Test Placeholder');
      await user.type(input, '   ');
      
      expect(input).toHaveValue('   ');
    });
  });

  describe('Accessibility', () => {
    it('should have accessible label', () => {
      render(<InputFieldWrapper label="Email Address" />);
      
      expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      render(
        <div>
          <InputFieldWrapper name="field1" label="Field 1" />
          <InputFieldWrapper name="field2" label="Field 2" />
        </div>
      );
      
      const input1 = screen.getByLabelText('Field 1');
      const input2 = screen.getByLabelText('Field 2');
      
      await user.tab();
      expect(input1).toHaveFocus();
      
      await user.tab();
      expect(input2).toHaveFocus();
    });

    it('should have proper ARIA attributes when disabled', () => {
      render(<InputFieldWrapper disabled={true} />);
      
      const input = screen.getByPlaceholderText('Test Placeholder');
      expect(input).toHaveAttribute('disabled');
    });
  });

  describe('Password Field Specifics', () => {
    it('should hide password text', () => {
      render(<InputFieldWrapper type="password" placeholder="Enter password" />);
      
      const input = screen.getByPlaceholderText('Enter password');
      expect(input).toHaveAttribute('type', 'password');
    });

    it('should accept password input', async () => {
      const user = userEvent.setup();
      render(<InputFieldWrapper type="password" placeholder="Enter password" />);
      
      const input = screen.getByPlaceholderText('Enter password');
      await user.type(input, 'SecureP@ssw0rd');
      
      expect(input).toHaveValue('SecureP@ssw0rd');
    });
  });

  describe('Different Input Types', () => {
    it('should render number input', () => {
      render(<InputFieldWrapper type="number" placeholder="Enter number" />);
      
      const input = screen.getByPlaceholderText('Enter number');
      expect(input).toHaveAttribute('type', 'number');
    });

    it('should render tel input', () => {
      render(<InputFieldWrapper type="tel" placeholder="Enter phone" />);
      
      const input = screen.getByPlaceholderText('Enter phone');
      expect(input).toHaveAttribute('type', 'tel');
    });

    it('should render url input', () => {
      render(<InputFieldWrapper type="url" placeholder="Enter URL" />);
      
      const input = screen.getByPlaceholderText('Enter URL');
      expect(input).toHaveAttribute('type', 'url');
    });
  });
});