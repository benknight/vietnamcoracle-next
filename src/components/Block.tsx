import { gql } from 'graphql-request';

export const BlockTitle = props => (
  <h3 className="text-base xs:text-xl lg:text-2xl xl:text-xl mb-3">
    {props.children}
  </h3>
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
      mx-auto mb-8 px-6
      max-w-sm lg:max-w-md xl:max-w-sm
      text-sm xs:text-base lg:text-lg xl:text-base font-serif
      dark:text-gray-400">
    {props.children}
  </div>
);

const Block = props => (
  <aside className="tw-block text-center font-display">{props.children}</aside>
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
