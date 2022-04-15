import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Masonry from 'react-masonry-component';
import { Image, Card, Label } from 'semantic-ui-react';

import TagButtons from './TagButtons';
import useLocale from '../../hooks/useLocale';

const Gallery = ({ data }) => {
  const [activeCategories, setActiveCategories] = useState([]);
  const { categories } = useLocale();

  return (
    <Masonry
      options={{
        transitionDuration: 0,
      }}
      disableImagesLoaded={false}
      updateOnEachImageLoad={false}
      style={{ margin: -15 }}
    >
      <TagButtons
        data={data}
        activeCategories={activeCategories}
        setActiveCategories={setActiveCategories}
      />
      {data.allProjects
        .filter(p => activeCategories.length === 0 || activeCategories.includes(p.category))
        .map(proj => (
          <Card
            key={proj.id}
            href={`/details/${proj.id}`}
            style={{ margin: 15, width: 'calc(33% - 30px)' }}
          >
            {proj.url && <Image src={proj.url} />}
            <Card.Content>
              {proj.category && (
                <Label ribbon style={{ margin: '-10px 0 10px' }}>
                  {categories(proj.category)}
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

Gallery.propTypes = {
  data: PropTypes.shape({
    allProjects: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  }).isRequired,
};

export default Gallery;
