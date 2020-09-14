/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Container, Header, Form, Input, Dropdown, Button } from 'semantic-ui-react';
import { getDataFromTree } from '@apollo/react-ssr';
import withApollo from '../lib/withApollo';

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

const CREATE_PROJECT = gql`
  mutation AddProject(
    $title: String
    $description: String
    $tags: TagRelateToManyInput
    $category: ProjectCategoryType
  ) {
    createProject(
      data: { title: $title, description: $description, tags: $tags, category: $category }
    ) {
      id
    }
  }
`;

const Create = () => {
  const { loading, error, data } = useQuery(GET_TAGS);
  const [addTag] = useMutation(ADD_TAG);
  const [createProject] = useMutation(CREATE_PROJECT);

  const [tags, setTags] = useState([]);
  const [category, setCategory] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Container>
      <Header as="h1">Add Map</Header>
      <Form
        onSubmit={() =>
          createProject({
            variables: {
              title,
              description,
              tags: {
                connect: tags.map(t => ({ id: t })),
              },
              category,
            },
          })
        }
      >
        <Form.Field required>
          <label>Map Title</label>
          <Input onChange={(e, { value }) => setTitle(value)} />
        </Form.Field>
        <Form.Field>
          <label>Map Description</label>
          <Form.TextArea onChange={(e, { value }) => setDescription(value)} />
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
            value={tags}
            onAddItem={(e, { value }) =>
              addTag({
                variables: { name: value },
                refetchQueries: ['GetTags'],
                awaitRefetchQueries: true,
              }).then(({ data: { createTag } }) => setTags([...tags, createTag.key]))
            }
            onChange={(e, { value }) => setTags(value)}
          />
        </Form.Field>
        <Form.Field>
          <label>Category</label>
          <Dropdown
            placeholder="Select a category"
            fluid
            selection
            value={category}
            onChange={(e, { value }) => setCategory(value)}
            // eslint-disable-next-line no-underscore-dangle
            options={data.__type.enumValues}
          />
        </Form.Field>
        <Button type="submit">Submit</Button>
      </Form>
    </Container>
  );
};

export default withApollo(Create, { getDataFromTree });
