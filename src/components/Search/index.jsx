import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { debounce } from 'lodash';
import { Segment, Search as SeachBar, Button } from 'semantic-ui-react';

import styles from './Search.module.css';

const Search = ({ year, handler }) => {
  const [open, setOpen] = useState(false);
  const [string, setString] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

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
            onResultSelect={(e, { result }) => handler(result.id)}
          />
        </Segment>
      )}
    </>
  );
};

Search.propTypes = {
  year: PropTypes.number.isRequired,
  handler: PropTypes.func.isRequired,
};

export default Search;
