import React from 'react';
import PropTypes from 'prop-types';
import { without, some } from 'lodash';
import { Card, Button } from 'semantic-ui-react';

const TagButtons = ({ data, activeCategories, setActiveCategories }) => (
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
);

TagButtons.propTypes = {
  data: PropTypes.shape().isRequired,
  activeCategories: PropTypes.arrayOf(PropTypes.string).isRequired,
  setActiveCategories: PropTypes.func.isRequired,
};

export default TagButtons;
