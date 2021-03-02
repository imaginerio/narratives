import React from 'react';
import { useRouter } from 'next/router';
import { getDataFromTree } from '@apollo/react-ssr';
import withApollo from '../../lib/withApollo';

import View from '../../components/View';

const Preview = () => {
  const router = useRouter();
  const { project } = router.query;

  return <View project={project} preview />;
};

export default withApollo(Preview, { getDataFromTree });
