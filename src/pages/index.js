import { graphql } from 'gatsby';
import React from 'react';
import Layout from '../components/Layout';

const Index = ({ data }) => {
  return <Layout data={data.component} showBrowse />;
};

export const query = graphql`
  {
    component: wpComponent(slug: { eq: "home" }) {
      ...LayoutComponentData
    }
  }
`;

export default Index;
