import { graphql } from 'gatsby';
import React from 'react';
import Page from '../components/Page';

const Destinations = ({ data }) => {
  return <Page data={data.component} />;
};

export const query = graphql`
  {
    component: wpComponent(slug: { eq: "destinations" }) {
      ...PageComponentData
    }
  }
`;

export default Destinations;
