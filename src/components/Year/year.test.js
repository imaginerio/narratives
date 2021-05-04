import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { MockedProvider } from '@apollo/client/testing';

import Year, { GET_SLIDE_YEAR } from './index';

const mocks = [
  {
    request: {
      query: GET_SLIDE_YEAR,
      variables: {
        slide: '1',
      },
    },
    result: {
      data: {
        Slide: {
          id: '1',
          year: 1900,
        },
      },
    },
  },
];

jest.mock('react-semantic-ui-range', () => {
  const Slider = () => <div className="slider" />;
  return { Slider };
});

jest.mock('semantic-ui-react/dist/commonjs/addons/Portal/Portal', () => ({ children }) => children);

describe('Year', () => {
  it('matches snapshot', async () => {
    const component = renderer.create(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Year slide="1" />
      </MockedProvider>
    );

    await act(() => new Promise(resolve => setTimeout(resolve, 0)));
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
