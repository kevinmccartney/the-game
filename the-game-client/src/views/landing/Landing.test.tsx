import React from 'react';
import { render, screen } from '@testing-library/react';
import { Landing } from './Landing';

test('renders learn react link', () => {
  render(<Landing />);
  const linkElement = screen.getByText(/Hello, world!/i);
  expect(linkElement).toBeInTheDocument();
});
