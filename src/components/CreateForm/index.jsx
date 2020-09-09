import React from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Form, Input, Dropdown } from 'semantic-ui-react';

const GET_CATEGORIES = gql`
  query {
    __type(name: "ProjectCategoryType") {
      enumValues {
        key: name
        text: name
        value: name
      }
    }
    allTags {
      key: id
      text: name
      value: id
    }
  }
`;

const CreateForm = () => {
  const { loading, error, data } = useQuery(GET_CATEGORIES);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <Form>
      <Form.Field required>
        <label>Map Title</label>
        <Input />
      </Form.Field>
      <Form.Field>
        <label>Map Description</label>
        <textarea />
      </Form.Field>
      <Form.Field>
        <label>Tags</label>
        <Dropdown
          options={data.allTags}
          placeholder="Select tags"
          search
          multiple
          selection
          fluid
          allowAdditions
          // value={currentValue}
          // onAddItem={this.handleAddition}
          // onChange={this.handleChange}
        />
      </Form.Field>
      <Form.Field>
        <label>Category</label>
        <Dropdown
          placeholder="Select a category"
          fluid
          selection
          options={data.__type.enumValues}
        />
      </Form.Field>
    </Form>
  );
};

export default CreateForm;
