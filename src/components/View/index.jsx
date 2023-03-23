import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { pick } from 'lodash';
import { Scrollama, Step } from 'react-scrollama';
import { FlyToInterpolator, WebMercatorViewport } from 'react-map-gl';
import ReactPlayer from 'react-player';
import { Card, Image } from 'semantic-ui-react';
import parse from 'html-react-parser';

import Atlas from '../Atlas';
import useLocale from '../../hooks/useLocale';

import styles from './View.module.css';

const View = ({ data }) => {
  const [viewport, setViewport] = useState({});
  const [year, setYear] = useState(data.Project.slides[0].year);
  const [activeBasemap, setActiveBasemap] = useState(null);
  const [opacity, setOpacity] = useState(1);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [annotations, setAnnotations] = useState(null);
  const [disabledLayers, setDisabledLayers] = useState(null);

  const { author } = useLocale();

  const getCaption = ({ imageTitle, source }) => {
    if (imageTitle || source) {
      return (
        <div
          style={{
            lineHeight: '1.4em',
            margin: '1em 0',
            fontSize: '0.8em',
            position: 'relative',
            color: 'rgba(0, 0, 0, 0.5)',
          }}
        >
          {source ? (
            <a href={source} target="_blank" rel="noreferrer">
              {imageTitle || source}
            </a>
          ) : (
            imageTitle
          )}
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
          annotations={annotations}
          disabledLayers={disabledLayers}
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
              newViewport.transitionInterpolator = new FlyToInterpolator({ speed: 0.75 });
              newViewport.transitionDuration = 'auto';
            }
            setViewport(newViewport);
            setYear(step.data.year);
            setActiveBasemap(step.data.basemap);
            setOpacity(step.data.opacity);
            setSelectedFeature(step.data.selectedFeature);
            if (step.data.annotations) {
              setAnnotations({
                type: 'FeatureCollection',
                features: step.data.annotations.map(({ feature }) => JSON.parse(feature)),
              });
            }
            setDisabledLayers(step.data.disabledLayers);
          }}
        >
          <Step data={{ ...data.Project.slides[0], index: 0 }}>
            <div className={styles.scrollContainer}>
              <Card fluid className={styles.Medium}>
                <Card.Content className={styles.Content}>
                  <Card.Header style={{ fontSize: '1.5em', textAlign: 'center' }}>
                    {data.Project.title}
                  </Card.Header>
                  <h3 style={{ textAlign: 'center', fontWeight: 300 }}>
                    {`${author}: ${data.Project.user.name}`}
                  </h3>
                  {data.Project.url && (
                    <>
                      <Image src={data.Project.url} style={{ marginTop: 20 }} />
                      {getCaption({ ...data.Project, title: data.Project.imageTitle })}
                    </>
                  )}
                  {data.Project.description && (
                    <Card.Description className={styles.Description} style={{ marginTop: 20 }}>
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
                {(slide.url || slide.title || slide.description || slide.media) && (
                  <Card fluid className={styles[slide.size] || styles.Medium}>
                    {slide.url && <Image src={slide.url} wrapped ui={false} />}
                    {slide.url && getCaption(slide)}
                    {(slide.title || slide.description || slide.media) && (
                      <Card.Content className={styles.Content}>
                        {slide.title && <Card.Header>{slide.title}</Card.Header>}
                        {slide.media && <ReactPlayer url={slide.media} width="100%" />}
                        {slide.description && (
                          <Card.Description className={styles.Description}>
                            {parse(slide.description)}
                          </Card.Description>
                        )}
                      </Card.Content>
                    )}
                  </Card>
                )}
              </div>
            </Step>
          ))}
        </Scrollama>
      </div>
    </>
  );
};

View.propTypes = {
  data: PropTypes.shape().isRequired,
};

export default View;
