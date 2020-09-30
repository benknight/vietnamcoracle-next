import { graphql } from 'gatsby';
import React from 'react';
import Layout from '../components/Layout';

const MotorbikeGuides = ({ data }) => {
  return <Layout data={data.component} />;
};

export const query = graphql`
  {
    component: wpComponent(slug: { eq: "motorbike-guides" }) {
      ...LayoutComponentData
    }
  }
`;

export default MotorbikeGuides;
