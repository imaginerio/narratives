import React from 'react';
import { useRouter } from 'next/router';
import { Container } from 'semantic-ui-react';

import Editor from '../../components/Editor';

const EditPage = () => {
  const router = useRouter();
  const { project } = router.query;

  return (
    <Container>
      <h1>NextJS GraphQL Apollo App</h1>
      {project && <Editor project={project} />}
    </Container>
  );
};

export default EditPage;
