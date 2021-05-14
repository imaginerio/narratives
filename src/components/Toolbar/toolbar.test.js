import React from 'react';
import renderer from 'react-test-renderer';
import { MockedProvider } from '@apollo/client/testing';
import { DrawProvider } from '../../providers/DrawProvider';

import Toolbar from './index';

describe('Draw Toolbar', () => {
  it('matches snapshot', () => {
    const component = renderer.create(
      <MockedProvider>
        <DrawProvider>
          <Toolbar />
        </DrawProvider>
      </MockedProvider>
    );

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot('default');
  });

  it('expands on click', () => {
    const component = renderer.create(
      <MockedProvider>
        <DrawProvider>
          <Toolbar />
        </DrawProvider>
      </MockedProvider>
    );

    const button = component.root.findByType('button');
    button.props.onClick();
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot('editing');
  });
});
