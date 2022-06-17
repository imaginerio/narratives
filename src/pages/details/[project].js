import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import parse from 'html-react-parser';
import Masonry from 'react-masonry-component';
import { Container, Header as Heading, Button } from 'semantic-ui-react';
import withApollo from '../../providers/withApollo';

import Header from '../../components/Header';
import Head from '../../components/Head';
import useLocale from '../../hooks/useLocale';

const Details = ({ project, user }) => {
  const {
    author,
    pages,
    category,
    description,
    properties,
    iconography,
    viewNarrative,
    backNarratives,
  } = useLocale();
  const metadata = [
    { name: author, value: project.user.name },
    { name: pages, value: project.slides.length },
    { name: category, value: project.category },
  ];
  return (
    <>
      <Head title={project.title} />
      <Header user={user} />
      {project.url && (
        <div
          style={{
            width: '100%',
            height: 400,
            backgroundImage: `url("${project.url}")`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
          }}
        />
      )}
      <Container style={{ padding: '50px 0', maxWidth: 900 }}>
        <a href="/">{backNarratives}</a>
        <Heading as="h1">{project.title}</Heading>
        <Button primary href={`/view/${project.id}`} style={{ margin: '20px 0' }}>
          {viewNarrative}
        </Button>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 50 }}>
          <div>
            <Heading as="h4">{description}</Heading>
            {parse(project.description)}
          </div>
          <div>
            <Heading as="h4">{properties}</Heading>
            {metadata.map(({ name, value }) => (
              <div
                key={name}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid #ccc',
                  lineHeight: '40px',
                }}
              >
                <span style={{ fontWeight: 500 }}>{name}</span>
                <span>{value}</span>
              </div>
            ))}
          </div>
        </div>
        <Heading as="h3">{iconography}</Heading>
        <Masonry style={{ margin: '0 -30px' }}>
          {project.slides
            .filter(slide => slide.url)
            .map(({ url }) => (
              <img
                key={url}
                src={url}
                style={{ margin: 30, width: 'calc(50% - 60px)' }}
                alt="Slide"
              />
            ))}
        </Masonry>
      </Container>
    </>
  );
};

Details.propTypes = {
  project: PropTypes.shape().isRequired,
  user: PropTypes.shape(),
};

Details.defaultProps = {
  user: null,
};

export default withApollo(Details);

export async function getServerSideProps({ params, req }) {
  const {
    data: { data },
  } = await axios.post(`${req.protocol}://${req.get('Host')}/admin/api`, {
    query: `query GetProjectDetails($project: ID!) {
        project: Project(where: { id: $project }) {
          id
          title
          description
          category
          url
          user {
            name
          }
          tags {
            name
          }
          slides(sortBy: order_ASC) {
            id
            url
          }
        }
      }`,
    variables: {
      project: params.project,
    },
  });

  let user = null;
  if (req.user) user = req.user;

  return { props: { ...data, user } };
}
