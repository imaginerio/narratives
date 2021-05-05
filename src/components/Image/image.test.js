import React from 'react';
import renderer, { act } from 'react-test-renderer';

import Image from './index';

jest.mock('semantic-ui-react', () => {
  const Button = props => <div {...props} className="button" />;
  const Segment = props => <div {...props} className="segment" />;
  const Field = props => <div {...props} className="field" />;
  const Form = { Field };
  const Input = props => <input {...props} className="input" />;
  return { Button, Segment, Form, Input };
});

describe('Image', () => {
  it('matches snapshot', async () => {
    const component = renderer.create(
      <Image
        image={{ imageTitle: 'Test image', creator: 'Test creator', source: 'Test source' }}
        updateHandler={() => {}}
      />
    );

    await act(() => new Promise(resolve => setTimeout(resolve, 0)));
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
