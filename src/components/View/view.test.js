import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { MockedProvider } from '@apollo/client/testing';

import View, { GET_PROJECT } from './index';

const mocks = [
  {
    request: {
      query: GET_PROJECT,
      variables: {
        project: '1',
      },
    },
    result: {
      data: {
        Project: {
          title: 'Test Project',
          description: 'Test Project',
          imageTitle: null,
          creator: null,
          source: null,
          date: null,
          url: null,
          user: {
            name: 'Test User',
          },
          slides: [
            {
              id: '1',
              title: 'Test Slide',
              description: 'Test description',
              year: 1900,
              longitude: -43.17425,
              latitude: -22.90415,
              zoom: 12,
              bearing: 0,
              pitch: 0,
              opacity: 1,
              size: 'Medium',
              selectedFeature: null,
              image: null,
              disabledLayers: [],
              basemap: null,
            },
          ],
        },
      },
    },
  },
];

jest.mock('react-scrollama', () => {
  const Scrollama = ({ children }) => children;
  const Step = ({ children }) => children;
  return { Scrollama, Step };
});

describe('View', () => {
  it('matches snapshot', async () => {
    const component = renderer.create(
      <MockedProvider mocks={mocks} addTypename={false}>
        <View project="1" />
      </MockedProvider>
    );

    await act(() => new Promise(resolve => setTimeout(resolve, 0)));
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
