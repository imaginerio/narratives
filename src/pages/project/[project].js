/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation, gql } from '@apollo/client';
import { map } from 'lodash';
import ErrorPage from 'next/error';
import { useRouter } from 'next/router';
import {
  Container,
  Header as Heading,
  Form,
  Input,
  Dropdown,
  Checkbox,
  Button,
  Divider,
  Image as Img,
  Dimmer,
  Loader,
} from 'semantic-ui-react';
import withApollo from '../../providers/withApollo';

import Image from '../../components/Image';
import Header from '../../components/Header';
import Head from '../../components/Head';
import Confirm from '../../components/Confirm';
import Wysiwyg from '../../components/Wysiwyg';
import useProjectAuth from '../../providers/useProjectAuth';
import useLocale from '../../hooks/useLocale';

export const GET_PROJECT = gql`
  query GetProject($project: ID!) {
    Project(where: { id: $project }) {
      id
      title
      description
      tags {
        id
      }
      category
      imageTitle
      source
      url
      published
    }
    categories: __type(name: "ProjectCategoryType") {
      values: enumValues {
        key: name
        text: name
        value: name
      }
    }
    tags: allTags {
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

const UPDATE_PROJECT = gql`
  mutation UpdateProject(
    $project: ID!
    $title: String
    $description: String
    $imageTitle: String
    $source: String
    $url: String
    $published: Boolean
    $tags: TagRelateToManyInput
    $category: ProjectCategoryType
  ) {
    updateProject(
      id: $project
      data: {
        title: $title
        description: $description
        tags: $tags
        category: $category
        imageTitle: $imageTitle
        source: $source
        url: $url
        published: $published
      }
    ) {
      id
      title
      description
      tags {
        id
      }
      category
      imageTitle
      source
      url
      published
    }
  }
`;

const DELETE_PROJECT = gql`
  mutation DeleteProject($id: ID!) {
    deleteProject(id: $id) {
      id
    }
  }
`;

export const Create = ({ user, project, statusCode }) => {
  if (statusCode) return <ErrorPage statusCode={statusCode} />;

  const { loading, error, data } = useQuery(GET_PROJECT, { variables: { project } });
  const [addTag] = useMutation(ADD_TAG);
  const [updateProject] = useMutation(UPDATE_PROJECT);
  const [deleteProject] = useMutation(DELETE_PROJECT);

  const [tags, setTags] = useState([]);
  const [category, setCategory] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageMeta, setImageMeta] = useState(null);
  const [published, setPublished] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const { locale } = useRouter();
  const {
    editNarrative,
    submit,
    myNarratives,
    title: titleText,
    description: descriptionText,
    image,
    tags: tagsText,
    category: categoryText,
    cancel,
    save,
    deleteProject: deleteProjectText,
    deleteQuestion,
    deleteConfirm,
    categorySelect,
    tagSelect,
    categories,
  } = useLocale();

  useEffect(() => {
    setTags(loading ? [] : map(data.Project.tags, 'id'));
    setCategory(loading ? null : data.Project.category);
    setTitle(loading ? '' : data.Project.title);
    setDescription(loading ? '' : data.Project.description);
    setPublished(loading ? false : data.Project.published || false);
    setImageMeta(
      loading
        ? null
        : {
            imageTitle: data.Project.imageTitle,
            source: data.Project.source,
            url: data.Project.url,
          }
    );
  }, [loading, data]);

  const submitForm = () => {
    setLoading(true);
    updateProject({
      variables: {
        project,
        title,
        description,
        ...imageMeta,
        tags: {
          connect: tags.map(t => ({ id: t })),
        },
        category,
        published,
      },
    }).then(() => window.location.replace(`/${locale}/projects`));
  };

  const removeProject = id => {
    setLoading(true);
    deleteProject({
      variables: {
        id,
      },
    }).then(() => window.location.replace(`/${locale}/projects`));
  };

  if (loading)
    return (
      <Dimmer active>
        <Loader size="huge">Loading</Loader>
      </Dimmer>
    );
  if (error) return <p>ERROR</p>;

  return (
    <div style={{ backgroundColor: '#FAFAFA', minHeight: '100vh' }}>
      <Head title={data.Project.title} />
      <Header user={user} />
      <Container style={{ marginTop: 30 }} text>
        <Button content={myNarratives} icon="angle left" as="a" href={`/${locale}/projects`} />
        <Heading as="h1">{editNarrative}</Heading>
        <Form loading={isLoading}>
          <Form.Input
            readOnly
            label="URL"
            icon="linkify"
            value={window.location.href.replace(/project/, 'view')}
          />
          <Form.Field>
            <Checkbox
              label={submit}
              checked={published}
              onChange={(e, { checked }) => setPublished(checked)}
            />
          </Form.Field>
          <Divider style={{ margin: '40px 0' }} />
          <Form.Field required>
            <label>{titleText}</label>
            <Input value={title} onChange={(e, { value }) => setTitle(value)} />
          </Form.Field>
          <Wysiwyg
            label={descriptionText}
            value={description || ''}
            onEditorChange={setDescription}
          />
          {imageMeta && (
            <Form.Field>
              <label>{image}</label>
              <Image
                image={imageMeta}
                addHandler={() => {}}
                updateHandler={(id, value) => setImageMeta({ ...imageMeta, ...value })}
              />
            </Form.Field>
          )}
          <Form.Field>
            <label>{tagsText}</label>
            <Dropdown
              options={data.tags}
              placeholder={tagSelect}
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
            <label>{categoryText}</label>
            <Dropdown
              placeholder={categorySelect}
              fluid
              selection
              value={category}
              onChange={(e, { value }) => setCategory(value)}
              options={[
                { key: 'null', text: '', value: null },
                ...data.categories.values.map(v => ({
                  ...v,
                  text: categories(v.text),
                })),
              ]}
            />
          </Form.Field>
          <Button
            size="big"
            floated="right"
            primary
            type="submit"
            onClick={submitForm}
            style={{ paddingLeft: 60, paddingRight: 60 }}
            disabled={isLoading}
          >
            {save}
          </Button>
          <Button
            size="big"
            floated="right"
            href={`/${locale}/projects`}
            style={{ marginRight: 20 }}
            disabled={isLoading}
          >
            {cancel}
          </Button>
          <div style={{ clear: 'left', margin: 100 }} />
        </Form>
        <Confirm
          disabled={isLoading}
          buttonIcon="trash"
          buttonTitle={deleteProjectText}
          confirmHandler={() => removeProject(project)}
          confirmTitle={deleteQuestion}
        >
          <p>{deleteConfirm}</p>
        </Confirm>
        <Img src="/img/hrc-logo.png" style={{ marginTop: 60 }} />
      </Container>
    </div>
  );
};

Create.propTypes = {
  user: PropTypes.shape(),
  project: PropTypes.string.isRequired,
  statusCode: PropTypes.number,
};

Create.defaultProps = {
  user: null,
  statusCode: null,
};

export default withApollo(Create);

export async function getServerSideProps({ req, params: { project } }) {
  let user = null;
  if (req.user) {
    user = req.user;
  }
  const statusCode = await useProjectAuth({ req, project });

  return {
    props: {
      user,
      project,
      statusCode,
    },
  };
}
