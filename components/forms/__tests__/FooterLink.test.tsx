import React from 'react';
import { render, screen } from '@testing-library/react';
import FooterLink from '../FooterLink';

describe('FooterLink', () => {
  describe('Rendering', () => {
    it('should render with all props', () => {
      render(
        <FooterLink
          text="Don't have an account?"
          linkText="Sign Up"
          href="/sign-up"
        />
      );
      
      expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
      expect(screen.getByText('Sign Up')).toBeInTheDocument();
    });

    it('should render link with correct href', () => {
      render(
        <FooterLink
          text="Already have account?"
          linkText="Sign In"
          href="/sign-in"
        />
      );
      
      const link = screen.getByText('Sign In');
      expect(link).toHaveAttribute('href', '/sign-in');
    });

    it('should render text and link separately', () => {
      render(
        <FooterLink
          text="Need help?"
          linkText="Contact Support"
          href="/support"
        />
      );
      
      expect(screen.getByText('Need help?')).toBeInTheDocument();
      expect(screen.getByText('Contact Support')).toBeInTheDocument();
    });
  });

  describe('Different Scenarios', () => {
    it('should handle sign-up to sign-in navigation', () => {
      render(
        <FooterLink
          text="Already have an account?"
          linkText="Sign In"
          href="/sign-in"
        />
      );
      
      const link = screen.getByRole('link', { name: 'Sign In' });
      expect(link).toHaveAttribute('href', '/sign-in');
    });

    it('should handle sign-in to sign-up navigation', () => {
      render(
        <FooterLink
          text="Don't have an account?"
          linkText="Sign Up"
          href="/sign-up"
        />
      );
      
      const link = screen.getByRole('link', { name: 'Sign Up' });
      expect(link).toHaveAttribute('href', '/sign-up');
    });

    it('should handle forgot password link', () => {
      render(
        <FooterLink
          text="Having trouble logging in?"
          linkText="Reset Password"
          href="/reset-password"
        />
      );
      
      const link = screen.getByRole('link', { name: 'Reset Password' });
      expect(link).toHaveAttribute('href', '/reset-password');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty text', () => {
      render(
        <FooterLink
          text=""
          linkText="Sign Up"
          href="/sign-up"
        />
      );
      
      expect(screen.getByText('Sign Up')).toBeInTheDocument();
    });

    it('should handle long text content', () => {
      const longText = 'This is a very long text that explains why you might want to sign up for our amazing service';
      render(
        <FooterLink
          text={longText}
          linkText="Get Started"
          href="/sign-up"
        />
      );
      
      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it('should handle special characters in text', () => {
      render(
        <FooterLink
          text="Don't have an account? (It's free!)"
          linkText="Sign Up →"
          href="/sign-up"
        />
      );
      
      expect(screen.getByText("Don't have an account? (It's free!)")).toBeInTheDocument();
      expect(screen.getByText('Sign Up →')).toBeInTheDocument();
    });

    it('should handle different URL formats', () => {
      render(
        <FooterLink
          text="External help"
          linkText="Documentation"
          href="https://docs.example.com"
        />
      );
      
      const link = screen.getByRole('link', { name: 'Documentation' });
      expect(link).toHaveAttribute('href', 'https://docs.example.com');
    });

    it('should handle URLs with query parameters', () => {
      render(
        <FooterLink
          text="Need help?"
          linkText="Contact Us"
          href="/contact?source=footer"
        />
      );
      
      const link = screen.getByRole('link', { name: 'Contact Us' });
      expect(link).toHaveAttribute('href', '/contact?source=footer');
    });
  });

  describe('Styling', () => {
    it('should apply footer-link class to link', () => {
      render(
        <FooterLink
          text="Test text"
          linkText="Test link"
          href="/test"
        />
      );
      
      const link = screen.getByText('Test link');
      expect(link).toHaveClass('footer-link');
    });

    it('should render in centered container', () => {
      const { container } = render(
        <FooterLink
          text="Test text"
          linkText="Test link"
          href="/test"
        />
      );
      
      const wrapper = container.querySelector('.text-center');
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible link', () => {
      render(
        <FooterLink
          text="New user?"
          linkText="Create Account"
          href="/register"
        />
      );
      
      const link = screen.getByRole('link', { name: 'Create Account' });
      expect(link).toBeInTheDocument();
    });

    it('should support keyboard navigation', () => {
      render(
        <FooterLink
          text="Test"
          linkText="Link"
          href="/test"
        />
      );
      
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href');
    });
  });

  describe('Internationalization', () => {
    it('should handle Indonesian text', () => {
      render(
        <FooterLink
          text="Tidak punya akun?"
          linkText="Daftar"
          href="/sign-up"
        />
      );
      
      expect(screen.getByText('Tidak punya akun?')).toBeInTheDocument();
      expect(screen.getByText('Daftar')).toBeInTheDocument();
    });

    it('should handle mixed language content', () => {
      render(
        <FooterLink
          text="Already have account?"
          linkText="Masuk"
          href="/sign-in"
        />
      );
      
      expect(screen.getByText('Already have account?')).toBeInTheDocument();
      expect(screen.getByText('Masuk')).toBeInTheDocument();
    });
  });
});