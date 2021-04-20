import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { MockedProvider } from '@apollo/client/testing';
import { Home, GET_PROJECTS } from '../src/pages/index';

const mocks = [
  {
    request: {
      query: GET_PROJECTS,
    },
    result: {
      data: {
        allProjects: [
          {
            id: '1',
            title: 'Test Map',
            description: 'Description',
            category: 'Literature',
            url: 'https://rio-narrative-files.s3.amazonaws.com/',
            tags: [
              {
                name: 'Test',
              },
            ],
            user: {
              name: 'David Heyman',
            },
          },
        ],
      },
    },
  },
];

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
      <MockedProvider mocks={mocks} addTypename={false}>
        <Home />
      </MockedProvider>
    );

    await act(() => new Promise(resolve => setTimeout(resolve, 0)));
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
