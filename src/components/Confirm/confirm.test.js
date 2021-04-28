import React from 'react';
import { render, screen } from '@testing-library/react';

import Confirm from './index';

jest.mock('semantic-ui-react/dist/commonjs/addons/Portal/Portal', () => ({ children }) => children);

describe('Confirm', () => {
  const confirmProps = {
    buttonIcon: 'trash',
    buttonTitle: 'Test Button',
    confirmHandler: () => {},
    confirmTitle: 'Test Title',
  };
  it('renders without crashing', async () => {
    render(
      <Confirm {...confirmProps}>
        <span>Test</span>
      </Confirm>
    );
    expect(screen.getByText(confirmProps.confirmTitle)).toBeInTheDocument();
  });
});
