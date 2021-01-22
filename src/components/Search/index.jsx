import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { debounce } from 'lodash';
import { Segment, Search as SeachBar, Button, Header, Label, Icon } from 'semantic-ui-react';

import styles from './Search.module.css';

const Search = ({ year, handler, selectedFeature }) => {
  const [open, setOpen] = useState(false);
  const [string, setString] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [featureName, setFeatureName] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const layerResults = {};
      if (string && string.length > 1 && year) {
        const { data } = await axios.get(
          `https://search.imaginerio.org/search?text=${string}&year=${year}`
        );
        if (data.length) {
          data.forEach(d => {
            layerResults[d.id] = {
              name: d.title,
              results: d.Features.map(f => ({
                id: f.id,
                title: f.name,
              })),
            };
          });
        }
      }
      setResults(layerResults);
      setLoading(false);
    };
    fetchData();
  }, [string]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(
        `https://search.imaginerio.org/feature/${selectedFeature}?year=${year}`
      );
      setFeatureName(data.properties.name);
    };
    if (selectedFeature) fetchData();
  }, [selectedFeature]);

  return (
    <>
      <Button icon="search" onClick={() => setOpen(!open)} style={{ display: 'inline-block' }} />
      {open && (
        <Segment className={styles.searchMenu} style={{ paddingTop: 20, paddingBottom: 20 }}>
          <Icon
            style={{ position: 'absolute', right: 10, cursor: 'pointer' }}
            name="close"
            onClick={() => setOpen(false)}
          />
          <Header as="h3" style={{ marginLeft: 5, marginTop: 0 }}>
            Search by name
          </Header>
          <SeachBar
            fluid
            category
            loading={loading}
            value={string}
            results={results}
            onSearchChange={debounce((e, { value }) => setString(value), 500, { leading: true })}
            onResultSelect={(e, { result }) => handler(result.id)}
          />
          {selectedFeature && featureName && (
            <>
              <Header as="h5" style={{ margin: '20px 0 5px 5px' }}>
                Currently Selected Feature:
              </Header>
              <Label style={{ width: '100%' }}>
                {featureName}
                <Icon
                  name="delete"
                  style={{ float: 'right' }}
                  onClick={() => {
                    handler(null);
                  }}
                />
              </Label>
            </>
          )}
        </Segment>
      )}
    </>
  );
};

Search.propTypes = {
  year: PropTypes.number.isRequired,
  handler: PropTypes.func.isRequired,
  selectedFeature: PropTypes.string,
};

Search.defaultProps = {
  selectedFeature: null,
};

export default Search;
