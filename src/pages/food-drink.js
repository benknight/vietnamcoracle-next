import { graphql } from 'gatsby';
import React from 'react';
import Layout from '../components/Layout';

const FoodDrink = ({ data }) => {
  return <Layout data={data.home} />;
};

export const query = graphql`
  {
    home: wpComponent(slug: { eq: "food-drink" }) {
      ...LayoutComponentData
    }
  }
`;

export default FoodDrink;
