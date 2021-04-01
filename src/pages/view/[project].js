import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { getDataFromTree } from '@apollo/react-ssr';
import withApollo from '../../lib/withApollo';

import View from '../../components/View';

const Preview = () => {
  const router = useRouter();
  const { project } = router.query;

  return (
    <>
      <Head>
        <title>imagineRio Narrative</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <View project={project} />
    </>
  );
};

export default withApollo(Preview, { getDataFromTree });
