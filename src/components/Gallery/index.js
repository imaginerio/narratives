import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { without, some } from 'lodash';
import Masonry from 'react-masonry-component';
import { Image, Card, Button, Label } from 'semantic-ui-react';

export const GET_PROJECTS = gql`
  query GetPublished {
    allProjects(where: { published: true }) {
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
`;

const Gallery = () => {
  const { loading, error, data } = useQuery(GET_PROJECTS);
  const [activeCategories, setActiveCategories] = useState([]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <Masonry
      options={{
        transitionDuration: 0,
      }}
      disableImagesLoaded={false}
      updateOnEachImageLoad={false}
      style={{ margin: -15 }}
    >
      <Card style={{ margin: 15, border: 'none', boxShadow: 'none' }}>
        <Card.Content style={{ padding: 0 }}>
          <Card.Header>Filter by category: </Card.Header>
          <Card.Description style={{ margin: '5px -5px' }}>
            {data.categories.values
              .filter(({ name }) => some(data.allProjects, p => p.category === name))
              .map(({ name }) => {
                const active = activeCategories.includes(name);
                return (
                  <Button
                    key={name}
                    inline
                    basic={!active}
                    primary={active}
                    style={{ margin: 5 }}
                    onClick={() =>
                      setActiveCategories(
                        active ? without(activeCategories, name) : [...activeCategories, name]
                      )
                    }
                  >
                    {name}
                  </Button>
                );
              })}
          </Card.Description>
        </Card.Content>
      </Card>
      {data.allProjects
        .filter(p => activeCategories.length === 0 || activeCategories.includes(p.category))
        .map(proj => (
          <Card key={proj.id} href={`/view/${proj.id}`} style={{ margin: 15 }}>
            {proj.url && <Image src={proj.url} />}
            <Card.Content>
              {proj.category && (
                <Label ribbon style={{ margin: '-10px 0 10px' }}>
                  {proj.category}
                </Label>
              )}
              <Card.Header>{proj.title}</Card.Header>
              <Card.Meta>{proj.user.name}</Card.Meta>
              <Card.Description>
                {proj.tags.map(({ name }) => (
                  <Label key={name} size="small" style={{ margin: 2 }}>
                    {name}
                  </Label>
                ))}
              </Card.Description>
            </Card.Content>
          </Card>
        ))}
    </Masonry>
  );
};

export default Gallery;
