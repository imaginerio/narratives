import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

const GET_PROJECTS = gql`
  query {
    allProjects {
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

const Projects = () => {
  const { loading, error, data } = useQuery(GET_PROJECTS);

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

export default Projects;
