import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import SelectField from '../SelectField';

const mockOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
];

// Wrapper component to provide react-hook-form context
const SelectFieldWrapper = ({
  name = 'testSelect',
  label = 'Test Select',
  placeholder = 'Select an option',
  options = mockOptions,
  required = false,
  defaultValue = '',
}: {
  name?: string;
  label?: string;
  placeholder?: string;
  options?: readonly { value: string; label: string }[];
  required?: boolean;
  defaultValue?: string;
}) => {
  const {
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      [name]: defaultValue,
    },
  });

  return (
    <SelectField
      name={name}
      label={label}
      placeholder={placeholder}
      options={options}
      control={control}
      error={errors[name]}
      required={required}
    />
  );
};

describe('SelectField', () => {
  describe('Rendering', () => {
    it('should render with label', () => {
      render(<SelectFieldWrapper />);
      
      expect(screen.getByText('Test Select')).toBeInTheDocument();
    });

    it('should render with placeholder', () => {
      render(<SelectFieldWrapper placeholder="Choose your option" />);
      
      expect(screen.getByText('Choose your option')).toBeInTheDocument();
    });

    it('should render trigger button', () => {
      render(<SelectFieldWrapper />);
      
      const trigger = screen.getByRole('combobox');
      expect(trigger).toBeInTheDocument();
    });

    it('should have correct class on trigger', () => {
      render(<SelectFieldWrapper />);
      
      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveClass('select-trigger');
    });
  });

  describe('Options Rendering', () => {
    it('should render all options when opened', async () => {
      const user = userEvent.setup();
      render(<SelectFieldWrapper />);
      
      const trigger = screen.getByRole('combobox');
      await user.click(trigger);
      
      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument();
        expect(screen.getByText('Option 2')).toBeInTheDocument();
        expect(screen.getByText('Option 3')).toBeInTheDocument();
      });
    });

    it('should render custom options', async () => {
      const user = userEvent.setup();
      const customOptions = [
        { value: 'growth', label: 'Growth' },
        { value: 'income', label: 'Income' },
      ];
      
      render(<SelectFieldWrapper options={customOptions} />);
      
      const trigger = screen.getByRole('combobox');
      await user.click(trigger);
      
      await waitFor(() => {
        expect(screen.getByText('Growth')).toBeInTheDocument();
        expect(screen.getByText('Income')).toBeInTheDocument();
      });
    });

    it('should handle empty options array', () => {
      render(<SelectFieldWrapper options={[]} />);
      
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('should handle single option', async () => {
      const user = userEvent.setup();
      const singleOption = [{ value: 'only', label: 'Only Option' }];
      
      render(<SelectFieldWrapper options={singleOption} />);
      
      const trigger = screen.getByRole('combobox');
      await user.click(trigger);
      
      await waitFor(() => {
        expect(screen.getByText('Only Option')).toBeInTheDocument();
      });
    });
  });

  describe('User Interactions', () => {
    it('should open dropdown on click', async () => {
      const user = userEvent.setup();
      render(<SelectFieldWrapper />);
      
      const trigger = screen.getByRole('combobox');
      await user.click(trigger);
      
      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeVisible();
      });
    });

    it('should close dropdown after selection', async () => {
      const user = userEvent.setup();
      render(<SelectFieldWrapper />);
      
      const trigger = screen.getByRole('combobox');
      await user.click(trigger);
      
      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeVisible();
      });
      
      const option = screen.getByText('Option 1');
      await user.click(option);
      
      await waitFor(() => {
        expect(screen.queryByText('Option 2')).not.toBeInTheDocument();
      });
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<SelectFieldWrapper />);
      
      const trigger = screen.getByRole('combobox');
      trigger.focus();
      
      await user.keyboard('[Space]');
      
      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeVisible();
      });
    });
  });

  describe('Default Values', () => {
    it('should display default selected value', () => {
      render(<SelectFieldWrapper defaultValue="option2" />);
      
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    it('should show placeholder when no default value', () => {
      render(<SelectFieldWrapper placeholder="Please select" />);
      
      expect(screen.getByText('Please select')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long option labels', async () => {
      const user = userEvent.setup();
      const longOptions = [
        { 
          value: 'long1', 
          label: 'This is a very long option label that might overflow the container' 
        },
      ];
      
      render(<SelectFieldWrapper options={longOptions} />);
      
      const trigger = screen.getByRole('combobox');
      await user.click(trigger);
      
      await waitFor(() => {
        expect(screen.getByText('This is a very long option label that might overflow the container')).toBeInTheDocument();
      });
    });

    it('should handle special characters in options', async () => {
      const user = userEvent.setup();
      const specialOptions = [
        { value: 'special1', label: 'Option & Special <chars>' },
        { value: 'special2', label: "Option's Quote" },
      ];
      
      render(<SelectFieldWrapper options={specialOptions} />);
      
      const trigger = screen.getByRole('combobox');
      await user.click(trigger);
      
      await waitFor(() => {
        expect(screen.getByText('Option & Special <chars>')).toBeInTheDocument();
        expect(screen.getByText("Option's Quote")).toBeInTheDocument();
      });
    });

    it('should handle unicode characters in options', async () => {
      const user = userEvent.setup();
      const unicodeOptions = [
        { value: 'unicode1', label: '日本語' },
        { value: 'unicode2', label: '한국어' },
        { value: 'unicode3', label: 'العربية' },
      ];
      
      render(<SelectFieldWrapper options={unicodeOptions} />);
      
      const trigger = screen.getByRole('combobox');
      await user.click(trigger);
      
      await waitFor(() => {
        expect(screen.getByText('日本語')).toBeInTheDocument();
        expect(screen.getByText('한국어')).toBeInTheDocument();
        expect(screen.getByText('العربية')).toBeInTheDocument();
      });
    });

    it('should handle numeric values', async () => {
      const user = userEvent.setup();
      const numericOptions = [
        { value: '1', label: 'One' },
        { value: '2', label: 'Two' },
      ];
      
      render(<SelectFieldWrapper options={numericOptions} />);
      
      const trigger = screen.getByRole('combobox');
      await user.click(trigger);
      
      await waitFor(() => {
        expect(screen.getByText('One')).toBeInTheDocument();
        expect(screen.getByText('Two')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have accessible label', () => {
      render(<SelectFieldWrapper label="Investment Goal" />);
      
      expect(screen.getByText('Investment Goal')).toBeInTheDocument();
    });

    it('should have combobox role', () => {
      render(<SelectFieldWrapper />);
      
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('should support keyboard interaction', async () => {
      const user = userEvent.setup();
      render(<SelectFieldWrapper />);
      
      const trigger = screen.getByRole('combobox');
      await user.tab();
      
      expect(trigger).toHaveFocus();
    });
  });

  describe('Investment Goals Options', () => {
    const investmentGoals = [
      { value: 'Growth', label: 'Pertumbuhan' },
      { value: 'Income', label: 'Pendapatan' },
      { value: 'Balanced', label: 'Seimbang' },
      { value: 'Conservative', label: 'Konservatif' },
    ];

    it('should render investment goals options', async () => {
      const user = userEvent.setup();
      render(<SelectFieldWrapper options={investmentGoals} />);
      
      const trigger = screen.getByRole('combobox');
      await user.click(trigger);
      
      await waitFor(() => {
        expect(screen.getByText('Pertumbuhan')).toBeInTheDocument();
        expect(screen.getByText('Pendapatan')).toBeInTheDocument();
        expect(screen.getByText('Seimbang')).toBeInTheDocument();
        expect(screen.getByText('Konservatif')).toBeInTheDocument();
      });
    });
  });

  describe('Risk Tolerance Options', () => {
    const riskOptions = [
      { value: 'Low', label: 'Rendah' },
      { value: 'Medium', label: 'Sedang' },
      { value: 'High', label: 'Tinggi' },
    ];

    it('should render risk tolerance options', async () => {
      const user = userEvent.setup();
      render(<SelectFieldWrapper options={riskOptions} />);
      
      const trigger = screen.getByRole('combobox');
      await user.click(trigger);
      
      await waitFor(() => {
        expect(screen.getByText('Rendah')).toBeInTheDocument();
        expect(screen.getByText('Sedang')).toBeInTheDocument();
        expect(screen.getByText('Tinggi')).toBeInTheDocument();
      });
    });
  });

  describe('Industry Options', () => {
    const industryOptions = [
      { value: 'Technology', label: 'Teknologi' },
      { value: 'Healthcare', label: 'Kesehatan' },
      { value: 'Finance', label: 'Keuangan' },
      { value: 'Energy', label: 'Energi' },
      { value: 'Consumer Goods', label: 'Barang Konsumen' },
    ];

    it('should render industry options', async () => {
      const user = userEvent.setup();
      render(<SelectFieldWrapper options={industryOptions} />);
      
      const trigger = screen.getByRole('combobox');
      await user.click(trigger);
      
      await waitFor(() => {
        expect(screen.getByText('Teknologi')).toBeInTheDocument();
        expect(screen.getByText('Kesehatan')).toBeInTheDocument();
        expect(screen.getByText('Keuangan')).toBeInTheDocument();
      });
    });
  });
});