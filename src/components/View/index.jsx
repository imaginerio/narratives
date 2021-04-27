import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery, gql } from '@apollo/client';
import { pick } from 'lodash';
import { Scrollama, Step } from 'react-scrollama';
import { FlyToInterpolator, WebMercatorViewport } from 'react-map-gl';
import { Card, Header, Image } from 'semantic-ui-react';
import parse from 'html-react-parser';

import Atlas from '../Atlas';

import styles from './View.module.css';

const GET_PROJECT = gql`
  query GetFullProject($project: ID!) {
    Project(where: { id: $project }) {
      title
      description
      imageTitle
      creator
      source
      date
      url
      user {
        name
      }
      slides(sortBy: order_ASC) {
        id
        title
        description
        year
        longitude
        latitude
        zoom
        bearing
        pitch
        opacity
        size
        selectedFeature
        image {
          title
          creator
          source
          date
          url
        }
        disabledLayers: layers {
          id
          layerId
        }
        basemap {
          ssid
          title
          creator
        }
      }
    }
  }
`;

const View = ({ project, preview }) => {
  const [viewport, setViewport] = useState({});
  const [year, setYear] = useState(1900);
  const [activeBasemap, setActiveBasemap] = useState(null);
  const [opacity, setOpacity] = useState(1);
  const [selectedFeature, setSelectedFeature] = useState(null);

  const config = { variables: { project } };
  if (preview) config.pollInterval = 5000;

  const { loading, error, data } = useQuery(GET_PROJECT, config);

  if (loading || !project) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const getCaption = image => {
    if (image.title || image.creator || image.date || image.source) {
      return (
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            lineHeight: '25px',
            marginTop: -25,
            paddingLeft: 15,
            position: 'relative',
          }}
        >
          <i>{image.title}</i>
          <span>: </span>
          <span>{` ${image.creator || ''}`}</span>
          <span>{` ${image.date || ''}`}</span>
          <span>&nbsp;</span>
          <span>{` ${image.source || ''}`}</span>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <div style={{ height: '100vh', width: '100vw', position: 'fixed', top: 0 }}>
        <Atlas
          handler={() => null}
          year={year}
          viewport={viewport}
          viewer
          activeBasemap={activeBasemap}
          opacity={opacity}
          selectedFeature={selectedFeature}
        />
      </div>
      <div>
        <Scrollama
          onStepEnter={step => {
            const newViewport = pick(step.data, [
              'longitude',
              'latitude',
              'zoom',
              'bearing',
              'pitch',
            ]);

            let xOffset = 0.5;
            if (step.data.size === 'Medium') xOffset = window.innerWidth * 0.25;
            if (step.data.size === 'Small') xOffset = 240;

            const wmViewport = new WebMercatorViewport(newViewport);
            [newViewport.longitude] = wmViewport.getMapCenterByLngLatPosition({
              lngLat: [step.data.longitude, step.data.latitude],
              pos: [xOffset, 0],
            });

            if (step.data.index > 0) {
              newViewport.transitionInterpolator = new FlyToInterpolator({ speed: 1.2 });
              newViewport.transitionDuration = 'auto';
            }
            setViewport(newViewport);
            setYear(step.data.year);
            setActiveBasemap(step.data.basemap);
            setOpacity(step.data.opacity);
            setSelectedFeature(step.data.selectedFeature);
          }}
        >
          <Step data={{ ...data.Project.slides[0], index: 0 }}>
            <div className={styles.scrollContainer}>
              <Card fluid className={styles.Medium}>
                <Card.Content>
                  <Card.Header style={{ fontSize: '1.5em', textAlign: 'center' }}>
                    {data.Project.title}
                  </Card.Header>
                  <Header as="h3" style={{ textAlign: 'center' }}>
                    {`Author: ${data.Project.user.name}`}
                  </Header>
                  {data.Project.url && (
                    <>
                      <Image src={data.Project.url} style={{ marginTop: 20 }} />
                      {getCaption({ ...data.Project, title: data.Project.imageTitle })}
                    </>
                  )}
                  {data.Project.description && (
                    <Card.Description style={{ marginTop: 20 }}>
                      {parse(data.Project.description)}
                    </Card.Description>
                  )}
                </Card.Content>
              </Card>
            </div>
          </Step>
          {data.Project.slides.map((slide, i) => (
            <Step key={slide.id} data={{ ...slide, index: i + 1 }}>
              <div
                className={styles.scrollContainer}
                style={{
                  paddingBottom: i + 1 === data.Project.slides.length ? '75vh' : '25vh',
                }}
              >
                <Card fluid className={styles[slide.size]}>
                  {slide.image && slide.image.url && (
                    <Image src={slide.image.url} wrapped ui={false} />
                  )}
                  {slide.image && getCaption(slide.image)}
                  {(slide.title || slide.description) && (
                    <Card.Content>
                      {slide.title && <Card.Header>{slide.title}</Card.Header>}
                      {slide.description && (
                        <Card.Description>{parse(slide.description)}</Card.Description>
                      )}
                    </Card.Content>
                  )}
                </Card>
              </div>
            </Step>
          ))}
        </Scrollama>
      </div>
    </>
  );
};

View.propTypes = {
  project: PropTypes.string.isRequired,
  preview: PropTypes.bool,
};

View.defaultProps = {
  preview: false,
};

export default View;
