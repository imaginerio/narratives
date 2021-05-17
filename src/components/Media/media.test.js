import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { MockedProvider } from '@apollo/client/testing';

import Media, { GET_SLIDE_MEDIA } from './index';

const mocks = [
  {
    request: {
      query: GET_SLIDE_MEDIA,
      variables: {
        slide: '1',
      },
    },
    result: {
      data: {
        Slide: {
          id: '1',
          youtube: 'http://youtube.com',
          soundcloud: 'http://soundcloud.com',
        },
      },
    },
  },
];

jest.mock('semantic-ui-react', () => {
  const Segment = props => <div {...props} className="segment" />;
  const Field = props => <div {...props} className="field" />;
  const Input = props => <input {...props} />;
  return { Segment, Form: { Field }, Input };
});

describe('Edit Media', () => {
  it('matches snapshot', async () => {
    const component = renderer.create(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Media slide="1" />
      </MockedProvider>
    );

    await act(() => new Promise(resolve => setTimeout(resolve, 0)));
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
