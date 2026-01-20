import { render, screen } from '@testing-library/react';
import Home from '../app/page';

describe('Home Page', () => {
  it('renders the page', () => {
    render(<Home />);
    expect(screen.getByText(/produtos/i)).toBeInTheDocument();
  });
});
