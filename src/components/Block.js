import { gql } from 'graphql-request';

export const BlockTitle = props => (
  <h3 className="text-xl lg:text-2xl mb-3">{props.children}</h3>
);

export const BlockContent = props => (
  <div className="mx-auto mb-8 px-6 text-sm max-w-sm font-serif">
    {props.children}
  </div>
);

const Block = props => (
  <div className="text-center font-display">{props.children}</div>
);

Block.fragments = gql`
  fragment BlockComponentData on Component_Block {
    description
    title
    image {
      srcSet
    }
    link {
      title
      url
    }
  }
`;

export default Block;
