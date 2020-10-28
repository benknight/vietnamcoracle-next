import { graphql } from 'gatsby';
import React from 'react';
import Page from '../components/Page';

const Index = ({ data }) => {
  return <Page data={data.component} showBrowse />;
};

export const query = graphql`
  {
    component: wpComponent(slug: { eq: "home" }) {
      ...PageComponentData
    }
  }
`;

export default Index;
