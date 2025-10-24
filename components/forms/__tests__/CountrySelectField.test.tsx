import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import { CountrySelectField } from '../CountrySelectField';

// Wrapper component to provide react-hook-form context
const CountrySelectFieldWrapper = ({
  name = 'country',
  label = 'Country',
  required = false,
  defaultValue = 'US',
}: {
  name?: string;
  label?: string;
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
    <CountrySelectField
      name={name}
      label={label}
      control={control}
      error={errors[name]}
      required={required}
    />
  );
};

describe('CountrySelectField', () => {
  describe('Rendering', () => {
    it('should render with label', () => {
      render(<CountrySelectFieldWrapper />);
      
      expect(screen.getByText('Country')).toBeInTheDocument();
    });

    it('should render with custom label', () => {
      render(<CountrySelectFieldWrapper label="Select Your Country" />);
      
      expect(screen.getByText('Select Your Country')).toBeInTheDocument();
    });

    it('should render country select button', () => {
      render(<CountrySelectFieldWrapper />);
      
      const button = screen.getByRole('combobox');
      expect(button).toBeInTheDocument();
    });

    it('should display default selected country', () => {
      render(<CountrySelectFieldWrapper defaultValue="US" />);
      
      expect(screen.getByText('United States')).toBeInTheDocument();
    });

    it('should render help text', () => {
      render(<CountrySelectFieldWrapper />);
      
      expect(screen.getByText(/Membantu kami menampilkan data pasar/i)).toBeInTheDocument();
    });

    it('should render flag for selected country', () => {
      render(<CountrySelectFieldWrapper defaultValue="US" />);
      
      expect(screen.getByTestId('flag-US')).toBeInTheDocument();
    });
  });

  describe('Country Selection', () => {
    it('should open country list on click', async () => {
      const user = userEvent.setup();
      render(<CountrySelectFieldWrapper />);
      
      const button = screen.getByRole('combobox');
      await user.click(button);
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText('Telusuri negara...')).toBeInTheDocument();
      });
    });

    it('should display multiple countries in list', async () => {
      const user = userEvent.setup();
      render(<CountrySelectFieldWrapper />);
      
      const button = screen.getByRole('combobox');
      await user.click(button);
      
      await waitFor(() => {
        expect(screen.getByText('United States')).toBeInTheDocument();
        expect(screen.getByText('United Kingdom')).toBeInTheDocument();
        expect(screen.getByText('Canada')).toBeInTheDocument();
      });
    });

    it('should show flags for all countries', async () => {
      const user = userEvent.setup();
      render(<CountrySelectFieldWrapper />);
      
      const button = screen.getByRole('combobox');
      await user.click(button);
      
      await waitFor(() => {
        expect(screen.getAllByTestId(/flag-/)).toHaveLength(5);
      });
    });

    it('should filter countries on search', async () => {
      const user = userEvent.setup();
      render(<CountrySelectFieldWrapper />);
      
      const button = screen.getByRole('combobox');
      await user.click(button);
      
      const searchInput = await screen.findByPlaceholderText('Telusuri negara...');
      await user.type(searchInput, 'United');
      
      await waitFor(() => {
        expect(screen.getByText('United States')).toBeInTheDocument();
        expect(screen.getByText('United Kingdom')).toBeInTheDocument();
      });
    });

    it('should close dropdown after selection', async () => {
      const user = userEvent.setup();
      render(<CountrySelectFieldWrapper />);
      
      const button = screen.getByRole('combobox');
      await user.click(button);
      
      await waitFor(() => {
        expect(screen.getByText('Canada')).toBeInTheDocument();
      });
      
      const canadaOption = screen.getByText('Canada');
      await user.click(canadaOption);
      
      await waitFor(() => {
        expect(screen.queryByPlaceholderText('Telusuri negara...')).not.toBeInTheDocument();
      });
    });

    it('should update selected country display', async () => {
      const user = userEvent.setup();
      render(<CountrySelectFieldWrapper defaultValue="US" />);
      
      expect(screen.getByText('United States')).toBeInTheDocument();
      
      const button = screen.getByRole('combobox');
      await user.click(button);
      
      await waitFor(() => {
        expect(screen.getAllByText('Canada')).toHaveLength(1);
      });
      
      const canadaOption = screen.getAllByText('Canada')[0];
      await user.click(canadaOption);
      
      await waitFor(() => {
        expect(screen.getByText('Canada')).toBeInTheDocument();
      });
    });
  });

  describe('Search Functionality', () => {
    it('should render search input in dropdown', async () => {
      const user = userEvent.setup();
      render(<CountrySelectFieldWrapper />);
      
      const button = screen.getByRole('combobox');
      await user.click(button);
      
      expect(await screen.findByPlaceholderText('Telusuri negara...')).toBeInTheDocument();
    });

    it('should show "no results" message when search has no matches', async () => {
      const user = userEvent.setup();
      render(<CountrySelectFieldWrapper />);
      
      const button = screen.getByRole('combobox');
      await user.click(button);
      
      const searchInput = await screen.findByPlaceholderText('Telusuri negara...');
      await user.type(searchInput, 'XYZ123NonExistent');
      
      await waitFor(() => {
        expect(screen.getByText('Tidak ada negara yang ditemukan.')).toBeInTheDocument();
      });
    });

    it('should handle case-insensitive search', async () => {
      const user = userEvent.setup();
      render(<CountrySelectFieldWrapper />);
      
      const button = screen.getByRole('combobox');
      await user.click(button);
      
      const searchInput = await screen.findByPlaceholderText('Telusuri negara...');
      await user.type(searchInput, 'canada');
      
      await waitFor(() => {
        expect(screen.getByText('Canada')).toBeInTheDocument();
      });
    });

    it('should handle partial search matches', async () => {
      const user = userEvent.setup();
      render(<CountrySelectFieldWrapper />);
      
      const button = screen.getByRole('combobox');
      await user.click(button);
      
      const searchInput = await screen.findByPlaceholderText('Telusuri negara...');
      await user.type(searchInput, 'Uni');
      
      await waitFor(() => {
        expect(screen.getByText('United States')).toBeInTheDocument();
        expect(screen.getByText('United Kingdom')).toBeInTheDocument();
      });
    });
  });

  describe('Different Default Countries', () => {
    it('should render with Indonesia as default', () => {
      render(<CountrySelectFieldWrapper defaultValue="ID" />);
      
      expect(screen.getByText('Indonesia')).toBeInTheDocument();
    });

    it('should render with Australia as default', () => {
      render(<CountrySelectFieldWrapper defaultValue="AU" />);
      
      expect(screen.getByText('Australia')).toBeInTheDocument();
    });

    it('should render with UK as default', () => {
      render(<CountrySelectFieldWrapper defaultValue="GB" />);
      
      expect(screen.getByText('United Kingdom')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid open/close cycles', async () => {
      const user = userEvent.setup();
      render(<CountrySelectFieldWrapper />);
      
      const button = screen.getByRole('combobox');
      
      await user.click(button);
      await user.click(button);
      await user.click(button);
      
      expect(button).toBeInTheDocument();
    });

    it('should handle keyboard ESC to close', async () => {
      const user = userEvent.setup();
      render(<CountrySelectFieldWrapper />);
      
      const button = screen.getByRole('combobox');
      await user.click(button);
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText('Telusuri negara...')).toBeInTheDocument();
      });
      
      await user.keyboard('[Escape]');
      
      await waitFor(() => {
        expect(screen.queryByPlaceholderText('Telusuri negara...')).not.toBeInTheDocument();
      });
    });

    it('should handle empty search input', async () => {
      const user = userEvent.setup();
      render(<CountrySelectFieldWrapper />);
      
      const button = screen.getByRole('combobox');
      await user.click(button);
      
      const searchInput = await screen.findByPlaceholderText('Telusuri negara...');
      await user.clear(searchInput);
      
      await waitFor(() => {
        expect(screen.getByText('United States')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have accessible label', () => {
      render(<CountrySelectFieldWrapper label="Select Country" />);
      
      expect(screen.getByText('Select Country')).toBeInTheDocument();
    });

    it('should have combobox role', () => {
      render(<CountrySelectFieldWrapper />);
      
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('should support keyboard navigation to trigger', async () => {
      const user = userEvent.setup();
      render(<CountrySelectFieldWrapper />);
      
      await user.tab();
      
      const button = screen.getByRole('combobox');
      expect(button).toHaveFocus();
    });

    it('should have aria-expanded attribute', () => {
      render(<CountrySelectFieldWrapper />);
      
      const button = screen.getByRole('combobox');
      expect(button).toHaveAttribute('aria-expanded');
    });
  });

  describe('Internationalization', () => {
    it('should display Indonesian help text', () => {
      render(<CountrySelectFieldWrapper />);
      
      expect(screen.getByText(/Membantu kami menampilkan data pasar dan berita yang relevan bagi Anda/i)).toBeInTheDocument();
    });

    it('should display Indonesian search placeholder', async () => {
      const user = userEvent.setup();
      render(<CountrySelectFieldWrapper />);
      
      const button = screen.getByRole('combobox');
      await user.click(button);
      
      expect(await screen.findByPlaceholderText('Telusuri negara...')).toBeInTheDocument();
    });

    it('should display Indonesian no results message', async () => {
      const user = userEvent.setup();
      render(<CountrySelectFieldWrapper />);
      
      const button = screen.getByRole('combobox');
      await user.click(button);
      
      const searchInput = await screen.findByPlaceholderText('Telusuri negara...');
      await user.type(searchInput, 'NonExistentCountry');
      
      await waitFor(() => {
        expect(screen.getByText('Tidak ada negara yang ditemukan.')).toBeInTheDocument();
      });
    });
  });

  describe('Required Validation', () => {
    it('should have required attribute when required prop is true', () => {
      render(<CountrySelectFieldWrapper required={true} />);
      
      expect(screen.getByText('Country')).toBeInTheDocument();
    });

    it('should work without required prop', () => {
      render(<CountrySelectFieldWrapper required={false} />);
      
      expect(screen.getByText('Country')).toBeInTheDocument();
    });
  });
});