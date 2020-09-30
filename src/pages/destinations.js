import { graphql } from 'gatsby';
import React from 'react';
import Layout from '../components/Layout';

const Destinations = ({ data }) => {
  return <Layout data={data.component} />;
};

export const query = graphql`
  {
    component: wpComponent(slug: { eq: "destinations" }) {
      ...LayoutComponentData
    }
  }
`;

export default Destinations;
