import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { groupBy, mapValues, debounce, pick } from 'lodash';
import { Segment, Search as SeachBar, Button } from 'semantic-ui-react';

import styles from './Search.module.css';

const Search = ({ year, layers, handler }) => {
  const layerTitles = groupBy(layers, 'remoteId');

  const [open, setOpen] = useState(false);
  const [string, setString] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let layerResults = {};
      if (string && string.length > 1 && year) {
        const { data } = await axios.get(
          `https://imaginerio-search.herokuapp.com/search?text=${string}&year=${year}`
        );
        if (data.length) {
          layerResults = groupBy(data, 'layerid');
          layerResults = mapValues(layerResults, (layer, key) => {
            return {
              name: layerTitles[key][0].title,
              results: layer.slice(0, 4).map(l => ({
                objectid: l.objectid,
                layerid: l.layerid,
                title: l.name,
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

  return (
    <>
      <Button icon="search" onClick={() => setOpen(!open)} style={{ display: 'inline-block' }} />
      {open && (
        <Segment className={styles.searchMenu}>
          <SeachBar
            category
            loading={loading}
            value={string}
            results={results}
            onSearchChange={debounce((e, { value }) => setString(value), 500, { leading: true })}
            onResultSelect={(e, { result }) => handler(pick(result, ['objectid', 'layerid']))}
          />
        </Segment>
      )}
    </>
  );
};

Search.propTypes = {
  year: PropTypes.number.isRequired,
  layers: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  handler: PropTypes.func.isRequired,
};

export default Search;
