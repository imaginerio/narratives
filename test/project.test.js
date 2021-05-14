/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/heading-has-content */
import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { MockedProvider } from '@apollo/client/testing';
import * as nextRouter from 'next/router';
import { Create, GET_PROJECT } from '../src/pages/project/[project]';

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
  const Input = props => <input {...props} className="input" />;
  const Dimmer = props => <div {...props} className="dimmer" />;
  const Loader = props => <div {...props} className="loader" />;
  const Container = props => <div {...props} className="container" />;
  const Checkbox = props => <input {...props} className="checkbox" />;
  const Divider = props => <hr {...props} className="divider" />;
  const Dropdown = props => <select {...props} className="dropdown" />;
  const Icon = props => <div {...props} className="icon" />;
  const Image = props => <img {...props} className="img" />;
  const Header = props => <h1 {...props} className="header" />;
  const Field = props => <div {...props} className="field" />;
  const Segment = props => <div {...props} className="segment" />;
  const Form = props => <form {...props} className="form" />;
  Form.Input = Input;
  Form.Field = Field;
  const Modal = props => <div {...props} className="modal" />;
  const Content = props => <div {...props} className="content" />;
  const Actions = props => <div {...props} className="actions" />;
  Modal.Content = Content;
  Modal.Actions = Actions;
  return {
    Button,
    Form,
    Input,
    Dimmer,
    Loader,
    Container,
    Image,
    Header,
    Checkbox,
    Divider,
    Dropdown,
    Icon,
    Modal,
    Segment,
  };
});

jest.mock(
  'semantic-ui-react/dist/commonjs/addons/Portal/Portal',
  () =>
    ({ children }) =>
      children
);

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
