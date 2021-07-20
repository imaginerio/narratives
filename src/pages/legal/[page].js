import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useMutation, gql } from '@apollo/client';
import parse from 'html-react-parser';
import { Header as Heading, Container, Segment, Image, Button, Checkbox } from 'semantic-ui-react';
import withApollo from '../../providers/withApollo';

import Header from '../../components/Header';

const pages = {
  terms: {
    url: 'en-imaginerio-terms/4',
    title: 'Terms and Conditions',
  },
  privacy: {
    url: 'pt-imaginerio-privacy/6',
    title: 'Privacy Policy',
  },
};

const UPDATE_TERMS_ACCEPTED = gql`
  mutation UpdateAccepted($user: ID!) {
    updateUser(id: $user, data: { termsAccepted: true }) {
      id
    }
  }
`;

const UPDATE_PRIVACY_ACCEPTED = gql`
  mutation UpdateAccepted($user: ID!) {
    updateUser(id: $user, data: { privacyAccepted: true }) {
      id
    }
  }
`;

const ParsedContent = ({ content }) => parse(content);

const Terms = ({ content, user, title, page }) => {
  const [accepted, setAccepted] = useState(false);
  const [updateTermsAccepted] = useMutation(UPDATE_TERMS_ACCEPTED);
  const [updatePrivacyAccepted] = useMutation(UPDATE_PRIVACY_ACCEPTED);

  const mutations = { terms: updateTermsAccepted, privacy: updatePrivacyAccepted };

  const submitForm = () => {
    mutations[page]({
      variables: { user },
    }).then(() => window.location.replace('/projects'));
  };

  return (
    <div style={{ backgroundColor: '#FAFAFA', minHeight: '100vh' }}>
      <Header />
      <Container>
        <Heading as="h1" style={{ margin: '50px 0' }}>
          {`imagineRio ${title}`}
        </Heading>
        <Segment style={{ padding: '20px 80px 40px' }}>
          <Heading as="h3" style={{ margin: '10px 0 30px' }}>
            {`You must accept the ${title.toLowerCase()} to use this service:`}
          </Heading>
          <div style={{ marginBottom: 20 }}>
            <ParsedContent content={content} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <Checkbox
              label={`I accept the imagineRio ${title.toLowerCase()}`}
              checked={accepted}
              onChange={() => setAccepted(!accepted)}
              style={{ marginRight: 20 }}
            />
            <Button as="a" href="/">
              Cancel
            </Button>
            <Button primary disabled={!accepted} onClick={submitForm}>
              Confirm
            </Button>
          </div>
        </Segment>
        <Image src="/img/hrc-logo.png" />
      </Container>
    </div>
  );
};

Terms.propTypes = {
  content: PropTypes.string.isRequired,
  user: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  page: PropTypes.string.isRequired,
};

export default withApollo(Terms);

export async function getServerSideProps({ res, req, params: { page } }) {
  const { user } = req;
  if (!user || user.accepted || !pages[page]) {
    res.setHeader('location', '/projects');
    res.statusCode = 302;
    res.end();
  }

  const { url, title } = pages[page];

  const {
    data: {
      post_stream: { posts },
    },
  } = await axios.get(`${process.env.NEXT_PUBLIC_PAGE_URL}${url}.json`, {
    headers: {
      'Api-Key': process.env.NEXT_PUBLIC_PAGE_API,
      'Api-Username': 'system',
    },
  });

  return { props: { content: posts[0].cooked, user: user.id, title, page } };
}
