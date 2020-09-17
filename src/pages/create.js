/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { omit } from 'lodash';
import { Container, Header, Form, Input, Dropdown, Button } from 'semantic-ui-react';
import { getDataFromTree } from '@apollo/react-ssr';
import withApollo from '../lib/withApollo';

import Image from '../components/Image';

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
    $imageTitle: String
    $creator: String
    $source: String
    $date: String
    $url: String
    $tags: TagRelateToManyInput
    $category: ProjectCategoryType
  ) {
    createProject(
      data: {
        title: $title
        description: $description
        tags: $tags
        category: $category
        imageTitle: $imageTitle
        creator: $creator
        source: $source
        date: $date
        url: $url
      }
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
  const [imageMeta, setImageMeta] = useState(null);

  const submitForm = () => {
    let imageData = {};
    if (imageMeta) {
      imageData = omit(imageMeta, 'title');
      imageData.imageTitle = imageMeta.title;
    }
    createProject({
      variables: {
        title,
        description,
        ...imageData,
        tags: {
          connect: tags.map(t => ({ id: t })),
        },
        category,
      },
    }).then(() => window.location.replace('/projects'));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>ERROR</p>;

  return (
    <Container style={{ marginTop: 30 }} text>
      <Button content="Back to maps" icon="angle left" as="a" href="/projects" />
      <Header as="h1">Add Map</Header>
      <Form>
        <Form.Field required>
          <label>Map Title</label>
          <Input onChange={(e, { value }) => setTitle(value)} />
        </Form.Field>
        <Form.Field>
          <label>Map Description</label>
          <Form.TextArea onChange={(e, { value }) => setDescription(value)} />
        </Form.Field>
        <Image
          image={imageMeta}
          addHandler={() =>
            setImageMeta({
              title: '',
              creator: '',
              source: '',
              date: '',
              url: null,
            })
          }
          updateHandler={(id, value) => setImageMeta({ ...imageMeta, ...value })}
          // updateHandler={(id, value) => console.log(value)}
        />
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
        <Button type="submit" onClick={submitForm}>
          Submit
        </Button>
      </Form>
    </Container>
  );
};

export default withApollo(Create, { getDataFromTree });
