import { gql } from '@apollo/client';

export const GET_SLIDE = gql`
  query GetBasemap($slide: ID!) {
    Slide(where: { id: $slide }) {
      id
      year
      opacity
      basemap {
        id
        ssid
        title
      }
    }
  }
`;

export const GET_BASEMAPS = gql`
  query {
    basemaps: allBasemaps {
      id
      ssid
      title
      firstYear
      lastYear
      thumbnail
      creator
    }
  }
`;

export const UPDATE_BASEMAP = gql`
  mutation UpdateBasemap($slide: ID!, $basemap: BasemapRelateToOneInput) {
    updateSlide(id: $slide, data: { basemap: $basemap }) {
      id
      basemap {
        id
      }
    }
  }
`;

export const UPDATE_SLIDE_OPACITY = gql`
  mutation UpdateSlideTitle($slide: ID!, $opacity: Float) {
    updateSlide(id: $slide, data: { opacity: $opacity }) {
      id
      opacity
    }
  }
`;
