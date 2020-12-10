import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery, gql } from '@apollo/client';
import { getDataFromTree } from '@apollo/react-ssr';
import { pick } from 'lodash';
import { Scrollama, Step } from 'react-scrollama';
import { FlyToInterpolator } from 'react-map-gl';
import { Card, Image } from 'semantic-ui-react';
import parse from 'html-react-parser';
import withApollo from '../../lib/withApollo';

import Atlas from '../../components/Atlas';

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
      slides {
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
          id
          ssid
        }
      }
    }
  }
`;

const View = () => {
  const router = useRouter();
  const { project } = router.query;

  const [viewport, setViewport] = useState({});
  const [year, setYear] = useState(1900);
  const [activeBasemap, setActiveBasemap] = useState(null);
  const [opacity, setOpacity] = useState(1);
  const [selectedFeature, setSelectedFeature] = useState(null);

  const { loading, error, data } = useQuery(GET_PROJECT, { variables: { project } });

  if (loading || !project) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <>
      <div style={{ height: '100vh', width: '100vw', position: 'fixed', top: 0 }}>
        <Atlas
          handler={() => null}
          year={year}
          viewport={viewport}
          scrollZoom={false}
          activeBasemap={activeBasemap}
          opacity={opacity}
          selectedFeature={selectedFeature}
        />
      </div>
      <div>
        <Scrollama
          debug
          onStepEnter={step => {
            const newViewport = pick(step.data, [
              'longitude',
              'latitude',
              'zoom',
              'bearing',
              'pitch',
            ]);
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
          {data.Project.slides.map((slide, i) => (
            <Step key={slide.id} data={{ ...slide, index: i }}>
              <div style={{ padding: '25vh 80px 25vh 80px' }}>
                <Card fluid className={`slide${slide.size}`}>
                  {slide.image && slide.image.url && (
                    <Image src={slide.image.url} wrapped ui={false} />
                  )}
                  {slide.image &&
                    (slide.image.title ||
                      slide.image.creatort ||
                      slide.image.date ||
                      slide.image.source) && (
                      <div
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.8)',
                          lineHeight: '25px',
                          marginTop: -25,
                          paddingLeft: 15,
                          position: 'relative',
                        }}
                      >
                        <i>{slide.image.title}</i>
                        <span>: </span>
                        <span>{` ${slide.image.creator || ''}`}</span>
                        <span>{` ${slide.image.date || ''}`}</span>
                        <span>&nbsp;</span>
                        <span>{` ${slide.image.source || ''}`}</span>
                      </div>
                    )}
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

export default withApollo(View, { getDataFromTree });
