import { graphql } from 'gatsby';
import React from 'react';
import Page from '../components/Page';

const HotelReviews = ({ data }) => {
  return <Page data={data.component} />;
};

export const query = graphql`
  {
    component: wpComponent(slug: { eq: "hotel-reviews" }) {
      ...PageComponentData
    }
  }
`;

export default HotelReviews;
