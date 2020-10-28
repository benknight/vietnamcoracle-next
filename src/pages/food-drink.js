import { graphql } from 'gatsby';
import React from 'react';
import Page from '../components/Page';

const FoodDrink = ({ data }) => {
  return <Page data={data.component} />;
};

export const query = graphql`
  {
    component: wpComponent(slug: { eq: "food-drink" }) {
      ...PageComponentData
    }
  }
`;

export default FoodDrink;
