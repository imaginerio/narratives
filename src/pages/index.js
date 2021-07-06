import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Container, Header as Heading, Image, Icon } from 'semantic-ui-react';
import withApollo from '../providers/withApollo';

import Header from '../components/Header';
import Gallery from '../components/Gallery';

export const Home = ({ user, data }) => (
  <div style={{ minHeight: '100vh' }}>
    <Header user={user} />
    <section style={{ backgroundColor: 'rgb(247, 249, 252)', padding: '50px 0px' }}>
      <Container>
        <Heading as="h1">Narratives</Heading>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis gravida, magna ac luctus
          fringilla, neque purus vulputate nunc, accumsan iaculis quam orci sed ante. Aenean rhoncus
          metus at dolor finibus lacinia. Cras iaculis orci ligula, in tempor mi malesuada eget.
          Vivamus quis sollicitudin justo. In auctor purus mauris, ut volutpat mauris dictum at. Nam
          ultrices turpis a dolor accumsan, at tempus ipsum vulputate. Morbi tempor in ex id mollis.
          Etiam sem turpis, interdum sit amet ultrices ut, consectetur vitae urna.
        </p>
        <p>
          Aenean quis ex vitae purus vestibulum malesuada vitae et diam. Nunc eget mattis metus.
          Aliquam ut mauris pretium, venenatis mi sed, molestie ex. Fusce viverra auctor dui sit
          amet convallis. Aliquam molestie fringilla orci, ut gravida libero hendrerit mattis.
          Pellentesque faucibus libero nulla, vel scelerisque mi malesuada at. Etiam ac mattis
          purus. Fusce augue metus, suscipit id orci et, luctus consequat neque. Aliquam condimentum
          enim aliquam euismod porta.
        </p>
      </Container>
    </section>
    <Container style={{ marginTop: 30, marginBottom: 30 }}>
      {user && (
        <a href="/projects" style={{ display: 'block', float: 'right' }}>
          <span>
            <Icon name="map outline" />
            Manage My Maps
          </span>
        </a>
      )}
      <Heading as="h1" style={{ margin: '50px 0' }}>
        Map Gallery
      </Heading>
      <Gallery data={data} />
      <Image src="img/hrc-logo.png" style={{ margin: '50px 0' }} />
    </Container>
  </div>
);

Home.propTypes = {
  user: PropTypes.string,
  data: PropTypes.shape({
    allProjects: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  }).isRequired,
};

Home.defaultProps = {
  user: null,
};

export default withApollo(Home);

export async function getServerSideProps({ req }) {
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
  if (req.user) user = req.user.id;
  return {
    props: {
      data,
      user,
    },
  };
}
