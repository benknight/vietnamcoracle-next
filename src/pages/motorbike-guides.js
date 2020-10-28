import { graphql } from 'gatsby';
import React from 'react';
import Page from '../components/Page';

const MotorbikeGuides = ({ data }) => {
  return <Page data={data.component} />;
};

export const query = graphql`
  {
    component: wpComponent(slug: { eq: "motorbike-guides" }) {
      ...PageComponentData
    }
  }
`;

export default MotorbikeGuides;
