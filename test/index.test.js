import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { MockedProvider } from '@apollo/client/testing';
import { Home } from '../src/pages/index';

jest.mock('semantic-ui-react', () => {
  const moduleMock = jest.requireActual('semantic-ui-react');
  return {
    ...moduleMock,
    Popup: () => 'Popup',
  };
});

describe('home page', () => {
  it('matches snapshot', async () => {
    const component = renderer.create(
      <MockedProvider addTypename={false}>
        <Home />
      </MockedProvider>
    );

    await act(() => new Promise(resolve => setTimeout(resolve, 0)));
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
