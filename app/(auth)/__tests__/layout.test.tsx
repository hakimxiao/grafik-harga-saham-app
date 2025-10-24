import React from 'react';
import { render, screen } from '@testing-library/react';
import Layout from '../layout';

describe('Auth Layout', () => {
  describe('Rendering', () => {
    it('should render children content', () => {
      render(
        <Layout>
          <div>Test Content</div>
        </Layout>
      );
      
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should render logo', () => {
      render(<Layout><div>Content</div></Layout>);
      
      const logo = screen.getByAltText('signalist logo');
      expect(logo).toBeInTheDocument();
    });

    it('should render logo with correct dimensions', () => {
      render(<Layout><div>Content</div></Layout>);
      
      const logo = screen.getByAltText('signalist logo');
      expect(logo).toHaveAttribute('width', '140');
      expect(logo).toHaveAttribute('height', '32');
    });

    it('should have logo link to home page', () => {
      render(<Layout><div>Content</div></Layout>);
      
      const logoLink = screen.getByRole('link');
      expect(logoLink).toHaveAttribute('href', '/');
    });

    it('should render testimonial quote', () => {
      render(<Layout><div>Content</div></Layout>);
      
      expect(screen.getByText(/Signalist mengubah daftar pantauan saya/i)).toBeInTheDocument();
    });

    it('should render testimonial author', () => {
      render(<Layout><div>Content</div></Layout>);
      
      expect(screen.getByText('- M. Havis Wijaya')).toBeInTheDocument();
    });

    it('should render testimonial author title', () => {
      render(<Layout><div>Content</div></Layout>);
      
      expect(screen.getByText('Retail Investor')).toBeInTheDocument();
    });

    it('should render 5 star rating', () => {
      render(<Layout><div>Content</div></Layout>);
      
      const stars = screen.getAllByAltText('star');
      expect(stars).toHaveLength(5);
    });

    it('should render dashboard preview image', () => {
      render(<Layout><div>Content</div></Layout>);
      
      const dashboardImage = screen.getByAltText('dashboard preview');
      expect(dashboardImage).toBeInTheDocument();
    });
  });

  describe('Layout Structure', () => {
    it('should have main element with auth-layout class', () => {
      const { container } = render(<Layout><div>Content</div></Layout>);
      
      const main = container.querySelector('main.auth-layout');
      expect(main).toBeInTheDocument();
    });

    it('should have left section', () => {
      const { container } = render(<Layout><div>Content</div></Layout>);
      
      const leftSection = container.querySelector('.auth-left-section');
      expect(leftSection).toBeInTheDocument();
    });

    it('should have right section', () => {
      const { container } = render(<Layout><div>Content</div></Layout>);
      
      const rightSection = container.querySelector('.auth-right-section');
      expect(rightSection).toBeInTheDocument();
    });

    it('should render children in left section', () => {
      const { container } = render(
        <Layout>
          <div data-testid="test-child">Test Child</div>
        </Layout>
      );
      
      const leftSection = container.querySelector('.auth-left-section');
      expect(leftSection).toContainElement(screen.getByTestId('test-child'));
    });
  });

  describe('Different Children', () => {
    it('should render form children', () => {
      render(
        <Layout>
          <form>
            <input type="text" placeholder="Test input" />
          </form>
        </Layout>
      );
      
      expect(screen.getByPlaceholderText('Test input')).toBeInTheDocument();
    });

    it('should render multiple child elements', () => {
      render(
        <Layout>
          <h1>Title</h1>
          <p>Paragraph</p>
          <button>Button</button>
        </Layout>
      );
      
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Paragraph')).toBeInTheDocument();
      expect(screen.getByText('Button')).toBeInTheDocument();
    });

    it('should render complex nested children', () => {
      render(
        <Layout>
          <div>
            <div>
              <span>Nested Content</span>
            </div>
          </div>
        </Layout>
      );
      
      expect(screen.getByText('Nested Content')).toBeInTheDocument();
    });
  });

  describe('Testimonial Section', () => {
    it('should render complete testimonial', () => {
      render(<Layout><div>Content</div></Layout>);
      
      const testimonial = screen.getByText(/Signalist mengubah daftar pantauan saya menjadi daftar pemenang/i);
      expect(testimonial).toBeInTheDocument();
    });

    it('should render testimonial in blockquote', () => {
      const { container } = render(<Layout><div>Content</div></Layout>);
      
      const blockquote = container.querySelector('blockquote.auth-blockquote');
      expect(blockquote).toBeInTheDocument();
      expect(blockquote).toHaveTextContent(/Signalist mengubah/i);
    });

    it('should render author as cite element', () => {
      const { container } = render(<Layout><div>Content</div></Layout>);
      
      const cite = container.querySelector('cite.auth-testimonial-author');
      expect(cite).toBeInTheDocument();
      expect(cite).toHaveTextContent('- M. Havis Wijaya');
    });
  });

  describe('Star Rating', () => {
    it('should render all stars with correct attributes', () => {
      render(<Layout><div>Content</div></Layout>);
      
      const stars = screen.getAllByAltText('star');
      stars.forEach(star => {
        expect(star).toHaveAttribute('width', '20');
        expect(star).toHaveAttribute('height', '20');
        expect(star).toHaveAttribute('src', '/assets/icons/star.svg');
      });
    });

    it('should have unique keys for each star', () => {
      const { container } = render(<Layout><div>Content</div></Layout>);
      
      const stars = container.querySelectorAll('img[alt="star"]');
      expect(stars).toHaveLength(5);
    });
  });

  describe('Images', () => {
    it('should have correct logo source', () => {
      render(<Layout><div>Content</div></Layout>);
      
      const logo = screen.getByAltText('signalist logo');
      expect(logo).toHaveAttribute('src', '/assets/icons/logo.svg');
    });

    it('should have correct dashboard preview source', () => {
      render(<Layout><div>Content</div></Layout>);
      
      const dashboard = screen.getByAltText('dashboard preview');
      expect(dashboard).toHaveAttribute('src', '/assets/images/dashboard.png');
    });

    it('should have correct dashboard preview dimensions', () => {
      render(<Layout><div>Content</div></Layout>);
      
      const dashboard = screen.getByAltText('dashboard preview');
      expect(dashboard).toHaveAttribute('width', '1440');
      expect(dashboard).toHaveAttribute('height', '1150');
    });
  });

  describe('Accessibility', () => {
    it('should have accessible image alt texts', () => {
      render(<Layout><div>Content</div></Layout>);
      
      expect(screen.getByAltText('signalist logo')).toBeInTheDocument();
      expect(screen.getByAltText('dashboard preview')).toBeInTheDocument();
      expect(screen.getAllByAltText('star')).toHaveLength(5);
    });

    it('should have semantic HTML structure', () => {
      const { container } = render(<Layout><div>Content</div></Layout>);
      
      expect(container.querySelector('main')).toBeInTheDocument();
      expect(container.querySelectorAll('section')).toHaveLength(2);
      expect(container.querySelector('blockquote')).toBeInTheDocument();
      expect(container.querySelector('cite')).toBeInTheDocument();
    });

    it('should have accessible link', () => {
      render(<Layout><div>Content</div></Layout>);
      
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/');
    });
  });

  describe('Edge Cases', () => {
    it('should handle null children', () => {
      render(<Layout>{null}</Layout>);
      
      expect(screen.getByAltText('signalist logo')).toBeInTheDocument();
    });

    it('should handle empty children', () => {
      render(<Layout><></></Layout>);
      
      expect(screen.getByAltText('signalist logo')).toBeInTheDocument();
    });

    it('should handle string children', () => {
      render(<Layout>Plain text child</Layout>);
      
      expect(screen.getByText('Plain text child')).toBeInTheDocument();
    });
  });

  describe('Internationalization', () => {
    it('should display Indonesian testimonial text', () => {
      render(<Layout><div>Content</div></Layout>);
      
      expect(screen.getByText(/mengubah daftar pantauan saya menjadi daftar pemenang/i)).toBeInTheDocument();
    });

    it('should display Indonesian author title', () => {
      render(<Layout><div>Content</div></Layout>);
      
      expect(screen.getByText('Retail Investor')).toBeInTheDocument();
    });
  });
});