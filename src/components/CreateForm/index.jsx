import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Form, Input, Dropdown } from 'semantic-ui-react';

const GET_TAGS = gql`
  query GetTags {
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

const ADD_TAG = gql`
  mutation AddTag($name: String) {
    createTag(data: { name: $name }) {
      key: id
      text: name
      value: id
    }
  }
`;

const CreateForm = () => {
  const { loading, error, data } = useQuery(GET_TAGS);
  const [addTag] = useMutation(ADD_TAG);

  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

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
          value={selectedTags}
          onAddItem={(e, { value }) =>
            addTag({
              variables: { name: value },
              refetchQueries: ['GetTags'],
              awaitRefetchQueries: true,
            }).then(({ data: { createTag } }) => setSelectedTags([...selectedTags, createTag.key]))
          }
          onChange={(e, { value }) => setSelectedTags(value)}
        />
      </Form.Field>
      <Form.Field>
        <label>Category</label>
        <Dropdown
          placeholder="Select a category"
          fluid
          selection
          value={selectedCategory}
          onChange={(e, { value }) => setSelectedCategory(value)}
          // eslint-disable-next-line no-underscore-dangle
          options={data.__type.enumValues}
        />
      </Form.Field>
    </Form>
  );
};

export default CreateForm;
