import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { MockedProvider } from '@apollo/client/testing';
import * as nextRouter from 'next/router';
import Create, { GET_PROJECT } from '../src/pages/project/[project]';

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
          id: '1',
          title: 'Test Map',
          description: 'Description',
          tags: [{ id: '2' }],
          category: 'Literature',
          imageTitle: 'Test image',
          creator: 'Test creator',
          source: 'Test source',
          url: 'https://rio-narrative-files.s3.amazonaws.com/',
          published: true,
        },
        categories: {
          values: [
            {
              key: 'Literature',
              text: 'Literature',
              value: 'Literature',
            },
          ],
        },
        tags: [
          {
            key: '2',
            text: 'Test',
            value: '2',
          },
        ],
      },
    },
  },
];

nextRouter.useRouter = jest.fn();
nextRouter.useRouter.mockImplementation(() => ({ query: { project: '1' } }));

jest.mock('semantic-ui-react', () => {
  const Button = props => <div {...props} className="button" />;
  const Field = props => <div {...props} className="field" />;
  const Form = { Field };
  const Input = props => <input {...props} className="input" />;
  const Dimmer = props => <div {...props} className="dimmer" />;
  const Loader = props => <div {...props} className="loader" />;
  return { Button, Form, Input, Dimmer, Loader };
});

jest.mock('semantic-ui-react/dist/commonjs/addons/Portal/Portal', () => ({ children }) => children);

describe('project page', () => {
  it('matches snapshot', async () => {
    const component = renderer.create(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Create />
      </MockedProvider>
    );

    await act(() => new Promise(resolve => setTimeout(resolve, 0)));
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
