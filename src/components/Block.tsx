import { gql } from 'graphql-request';

export const BlockTitle = props => (
  <h3 className="text-xl mb-3">{props.children}</h3>
);

export type BlockType = {
  description: string;
  title: string;
  image: {
    sourceUrl: string;
  };
  link: {
    title: string;
    url: string;
  };
  messages: [
    {
      key: string;
      value: string;
    },
  ];
};

export const BlockContent = props => (
  <div
    className="
      mx-auto mb-8 px-3 max-w-sm lg:text-sm xl:text-base font-serif dark:text-gray-400">
    {props.children}
  </div>
);

const Block = props => (
  <div className="text-center font-display">{props.children}</div>
);

Block.fragments = gql`
  fragment BlockComponentData on Block_Block {
    description
    title
    image {
      sourceUrl
    }
    link {
      title
      url
    }
    messages {
      key
      value
    }
  }
`;

export default Block;
