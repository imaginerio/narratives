import React from 'react';
import PropTypes from 'prop-types';
import { useQuery, gql } from '@apollo/client';
import withApollo from '../lib/withApollo';

const GET_PROJECTS = gql`
  query GetProjects($user: ID!) {
    allProjects(where: { user: { id: $user } }) {
      id
      title
      description
      category
      tags {
        name
      }
    }
  }
`;

const Projects = ({ user }) => {
  const { loading, error, data } = useQuery(GET_PROJECTS, { variables: { user } });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div>
      {data.allProjects.map(proj => (
        <p key={proj.id}>{`${proj.title} - ${proj.category}`}</p>
      ))}
    </div>
  );
};

Projects.propTypes = {
  user: PropTypes.string.isRequired,
};

export default withApollo(Projects);

export async function getServerSideProps({ req }) {
  return {
    props: {
      user: req.user.id,
    },
  };
}
