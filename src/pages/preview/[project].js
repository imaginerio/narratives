import React from 'react';
import { useRouter } from 'next/router';
import { useQuery, gql } from '@apollo/client';
import { getDataFromTree } from '@apollo/react-ssr';
import withApollo from '../../providers/withApollo';

import View from '../../components/View';
import Head from '../../components/Head';

export const GET_PROJECT = gql`
  query GetFullProject($project: ID!) {
    Project(where: { id: $project }) {
      title
      description
      imageTitle
      source
      url
      user {
        name
      }
      slides(sortBy: order_ASC) {
        id
        title
        description
        year
        longitude
        latitude
        zoom
        bearing
        pitch
        opacity
        size
        media
        selectedFeature
        imageTitle
        url
        source
        annotations {
          id
          feature
        }
        disabledLayers: layers {
          id
          layerId
        }
        basemap {
          ssid
          title
          creator
        }
      }
    }
  }
`;

const Preview = () => {
  const router = useRouter();
  const { project } = router.query;

  const { loading, error, data } = useQuery(GET_PROJECT, {
    variables: { project },
    pollInterval: 5000,
  });

  if (loading || !project) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <>
      <Head title={data.Project.title} />
      <View data={data} />
    </>
  );
};

export default withApollo(Preview, { getDataFromTree });
