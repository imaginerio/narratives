import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import parse from 'html-react-parser';
import { Container, Header as Heading, Image, Icon } from 'semantic-ui-react';
import withApollo from '../providers/withApollo';

import Header from '../components/Header';
import Head from '../components/Head';
import Gallery from '../components/Gallery';
import useLocale from '../hooks/useLocale';

const ParsedContent = ({ content }) => parse(content);

export const Home = ({ user, data, content }) => {
  const { gallery, signUp, manage, login } = useLocale();
  return (
    <div style={{ minHeight: '100vh' }}>
      <Header user={user} />
      <Head title="imagineRio Narratives" />
      <section style={{ backgroundColor: 'rgb(247, 249, 252)', padding: '50px 0px' }}>
        <Container>
          <ParsedContent content={content} />
        </Container>
      </section>
      <Container style={{ marginTop: 30, marginBottom: 30 }}>
        {!user && (
          <a href="/signup" style={{ display: 'block', float: 'right', margin: '0 20px' }}>
            <span>
              <Icon name="signup" />
              {signUp}
            </span>
          </a>
        )}
        <a href="/projects" style={{ display: 'block', float: 'right' }}>
          <span>
            <Icon name={user && user.verified ? 'map outline' : 'user circle'} />
            {user && user.verified ? manage : login}
          </span>
        </a>
        <Heading as="h1" style={{ margin: '50px 0' }}>
          {gallery}
        </Heading>
        <Gallery data={data} />
        <Image src="img/hrc-logo.png" style={{ margin: '50px 0' }} />
      </Container>
    </div>
  );
};

Home.propTypes = {
  user: PropTypes.string,
  data: PropTypes.shape({
    allProjects: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  }).isRequired,
  content: PropTypes.string.isRequired,
};

Home.defaultProps = {
  user: null,
};

export default withApollo(Home);

export async function getServerSideProps({ req, locale }) {
  const {
    data: { data },
  } = await axios.post(`${req.protocol}://${req.get('Host')}/admin/api`, {
    query: `query GetPublished {
        allProjects(where: { gallery: true }) {
          id
          title
          description
          category
          url
          tags {
            name
          }
          user {
            name
          }
        }
        categories: __type(name: "ProjectCategoryType") {
          values: enumValues {
            name
          }
        }
      }
    `,
  });

  let user = null;
  if (req.user) user = req.user;

  const {
    data: {
      post_stream: { posts },
    },
  } = await axios.get(`${process.env.NEXT_PUBLIC_PAGE_URL}${locale}-narratives-about/96.json`, {
    headers: {
      'Api-Key': process.env.NEXT_PUBLIC_PAGE_API,
      'Api-Username': 'system',
    },
  });

  return {
    props: {
      data,
      user,
      content: posts[0].cooked,
    },
  };
}
