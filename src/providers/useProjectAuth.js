import axios from 'axios';

export default async ({ req, project }) => {
  const {
    data: {
      data: {
        Project: { user },
      },
    },
  } = await axios.post(`${req.protocol}://${req.get('Host')}/admin/api`, {
    query: `query GetProjectUser($project: ID!) {
        Project(where: { id: $project }) {
          user {
            id
          }
        }
      }
    `,
    variables: {
      project,
    },
  });

  let statusCode = null;
  if (user.id !== req.user.id) statusCode = 403;

  return statusCode;
};
