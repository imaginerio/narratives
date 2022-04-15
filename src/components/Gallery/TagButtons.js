import React from 'react';
import PropTypes from 'prop-types';
import { without, some } from 'lodash';
import { Card, Button } from 'semantic-ui-react';

import useLocale from '../../hooks/useLocale';

const TagButtons = ({ data, activeCategories, setActiveCategories }) => {
  const { filterCategory, categories } = useLocale();
  return (
    <Card style={{ margin: 15, border: 'none', boxShadow: 'none', width: 'calc(33% - 30px)' }}>
      <Card.Content style={{ padding: 0 }}>
        <Card.Header>{`${filterCategory}: `}</Card.Header>
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
                  {categories(name)}
                </Button>
              );
            })}
        </Card.Description>
      </Card.Content>
    </Card>
  );
};

TagButtons.propTypes = {
  data: PropTypes.shape().isRequired,
  activeCategories: PropTypes.arrayOf(PropTypes.string).isRequired,
  setActiveCategories: PropTypes.func.isRequired,
};

export default TagButtons;
