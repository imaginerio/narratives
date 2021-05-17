import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { MockedProvider } from '@apollo/client/testing';
import { GET_BASEMAPS, GET_SLIDE } from './graphql';

import Basemaps from './index';

const basemap = {
  id: '2',
  ssid: '3',
  title: 'Test',
  thumbnail: 'http://images.imaginerio.org/test.jpg',
};
const mocks = [
  {
    request: {
      query: GET_SLIDE,
      variables: {
        slide: '2',
      },
    },
    result: {
      data: {
        Slide: {
          id: '1',
          year: 1900,
          opacity: 1,
          basemap,
        },
      },
    },
  },
  {
    request: {
      query: GET_BASEMAPS,
    },
    result: {
      data: {
        basemaps: [
          {
            ...basemap,
            firstYear: 1800,
            lastYear: 2000,
          },
        ],
      },
    },
  },
];

jest.mock('react-semantic-ui-range', () => {
  const Slider = () => <div className="slider" />;
  return { Slider };
});

jest.mock('semantic-ui-react', () => {
  const Button = props => <div {...props} className="button" />;
  const Segment = props => <div {...props} className="segment" />;
  return { Button, Segment };
});

jest.mock(
  'semantic-ui-react/dist/commonjs/addons/Portal/Portal',
  () =>
    ({ children }) =>
      children
);

describe('Basemaps', () => {
  it('matches snapshot', async () => {
    const component = renderer.create(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Basemaps slide="2" />
      </MockedProvider>
    );

    await act(() => new Promise(resolve => setTimeout(resolve, 0)));
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
