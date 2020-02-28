import React from 'react';
import { render } from '@testing-library/react';
import EasierViewer from './EasierViewer';

test('renders learn react link', () => {
  const { getByText } = render(<EasierViewer />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
