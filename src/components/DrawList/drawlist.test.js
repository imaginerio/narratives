import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { MockedProvider } from '@apollo/client/testing';
import { DrawProvider } from '../../providers/DrawProvider';

import DrawList, { GET_ANNOTATIONS } from './index';

const mocks = [
  {
    request: {
      query: GET_ANNOTATIONS,
      variables: {
        slide: '1',
      },
    },
    result: {
      data: {
        Slide: {
          id: '1',
          annotations: [
            {
              id: '2',
              feature: `{"type":"Feature","properties":{"title":"Title"},"geometry":{"type":"Point","coordinates":[-43.19,-22.92]},"id":"2"}`,
            },
          ],
        },
      },
    },
  },
];

jest.mock('semantic-ui-react', () => {
  const Button = props => <div {...props} className="button" />;
  const Segment = props => <div {...props} className="segment" />;
  const Field = props => <div {...props} className="field" />;
  const Input = props => <input {...props} />;
  const List = props => <div {...props} className="list" />;
  const Item = props => <div {...props} className="list-item" />;
  const Content = props => <div {...props} className="list-content" />;
  List.Item = Item;
  List.Content = Content;
  return { Button, Segment, Form: { Field }, List, Input };
});

describe('Draw List', () => {
  it('matches snapshot', async () => {
    const component = renderer.create(
      <MockedProvider mocks={mocks} addTypename={false}>
        <DrawProvider>
          <DrawList slide="1" />
        </DrawProvider>
      </MockedProvider>
    );

    await act(() => new Promise(resolve => setTimeout(resolve, 0)));
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
