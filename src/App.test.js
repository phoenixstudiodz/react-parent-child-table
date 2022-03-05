import { render, screen } from '@testing-library/react';
import App from './App';

test('App should renders the app title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Financial Institution Single Page Application/i);
  expect(titleElement).toBeInTheDocument();
});
