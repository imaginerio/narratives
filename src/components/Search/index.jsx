import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation, gql } from '@apollo/client';
import axios from 'axios';
import { debounce } from 'lodash';
import { Segment, Search as SeachBar, Button, Header, Label, Icon } from 'semantic-ui-react';

import useLocale from '../../hooks/useLocale';

import styles from './Search.module.css';

const GET_SLIDE = gql`
  query GetSlide($slide: ID!) {
    Slide(where: { id: $slide }) {
      id
      year
      selectedFeature
    }
  }
`;

const UPDATE_SLIDE_FEATURE = gql`
  mutation UpdateSlideFeature($slide: ID!, $value: String) {
    updateSlide(id: $slide, data: { selectedFeature: $value }) {
      id
      selectedFeature
    }
  }
`;

const Search = ({ slide }) => {
  const { data } = useQuery(GET_SLIDE, {
    variables: { slide },
  });
  const [updateFeature] = useMutation(UPDATE_SLIDE_FEATURE);
  const onFeatureChange = newFeature => {
    updateFeature({
      variables: {
        slide,
        value: newFeature,
      },
      optimisticResponse: {
        __typename: 'Mutation',
        updateSlide: {
          __typename: 'Slide',
          id: slide,
          selectedFeature: newFeature,
        },
      },
    });
  };

  const [year, setYear] = useState(1900);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [open, setOpen] = useState(false);
  const [string, setString] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [featureName, setFeatureName] = useState(null);

  const { searchName, currentlySelected } = useLocale();

  useEffect(() => {
    if (data) {
      setYear(data.Slide.year);
      setSelectedFeature(data.Slide.selectedFeature);
    }
  }, [data]);

  useEffect(() => {
    onFeatureChange(selectedFeature);
  }, [selectedFeature]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const layerResults = {};
      if (string && string.length > 1 && year) {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_SEARCH_API}/search?text=${string}&year=${year}`
        );
        if (res.data.length) {
          res.data.forEach(d => {
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
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SEARCH_API}/feature/${selectedFeature}?year=${year}`
      );
      setFeatureName(res.data.properties.name);
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
            {searchName}
          </Header>
          <SeachBar
            fluid
            category
            loading={loading}
            value={string}
            results={results}
            onSearchChange={debounce((e, { value }) => setString(value), 500, { leading: true })}
            onResultSelect={(e, { result }) => setSelectedFeature(result.id)}
          />
          {selectedFeature && featureName && (
            <>
              <Header as="h5" style={{ margin: '20px 0 5px 5px' }}>
                {`${currentlySelected}:`}
              </Header>
              <Label style={{ width: '100%' }}>
                {featureName}
                <Icon
                  name="delete"
                  style={{ float: 'right' }}
                  onClick={() => {
                    setSelectedFeature(null);
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
  slide: PropTypes.string.isRequired,
};

export default Search;
