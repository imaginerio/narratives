import { gql } from '@apollo/client';

export const GET_SLIDES = gql`
  query GetSlide($slide: ID!) {
    Slide(where: { id: $slide }) {
      id
      title
      description
      size
      media
      imageTitle
      source
      url
    }
  }
`;

export const UPDATE_SLIDE_TITLE = gql`
  mutation UpdateSlideTitle($slide: ID!, $title: String) {
    updateSlide(id: $slide, data: { title: $title }) {
      id
      title
    }
  }
`;

export const UPDATE_SLIDE_DESCRIPTION = gql`
  mutation UpdateSlideDescription($slide: ID!, $description: String) {
    updateSlide(id: $slide, data: { description: $description }) {
      id
      description
    }
  }
`;

export const UPDATE_SLIDE_MEDIA = gql`
  mutation UpdateSlideMedia($slide: ID!, $media: String) {
    updateSlide(id: $slide, data: { media: $media }) {
      id
      media
    }
  }
`;

export const UPDATE_SLIDE_SIZE = gql`
  mutation UpdateSlideSize($slide: ID!, $size: SlideSizeType) {
    updateSlide(id: $slide, data: { size: $size }) {
      id
      size
    }
  }
`;

export const ADD_IMAGE = gql`
  mutation AddImage($slide: SlideRelateToOneInput) {
    createImage(data: { slide: $slide }) {
      id
      title
      creator
      source
      date
      url
    }
  }
`;

export const UPDATE_IMAGE = gql`
  mutation UpdateImage($slide: ID!, $imageTitle: String, $source: String, $url: String) {
    updateSlide(id: $slide, data: { imageTitle: $imageTitle, source: $source, url: $url }) {
      id
      imageTitle
      source
      url
    }
  }
`;
