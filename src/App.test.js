import { render, screen } from '@testing-library/react';
import App from './App';
import { AuthProvider } from './context/AuthContext';

test('renders login page at root', () => {
  render(<AuthProvider><App /></AuthProvider>);
  expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
});
