import { graphql } from 'gatsby';
import React from 'react';
import Layout from '../components/Layout';

const HotelReviews = ({ data }) => {
  return <Layout data={data.component} />;
};

export const query = graphql`
  {
    component: wpComponent(slug: { eq: "hotel-reviews" }) {
      ...LayoutComponentData
    }
  }
`;

export default HotelReviews;
