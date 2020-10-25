import { graphql } from 'gatsby';
import React from 'react';
import Layout from '../components/Layout';

const FoodDrink = ({ data }) => {
  return <Layout data={data.component} />;
};

export const query = graphql`
  {
    component: wpComponent(slug: { eq: "food-drink" }) {
      ...LayoutComponentData
    }
  }
`;

export default FoodDrink;
