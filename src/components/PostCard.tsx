import cx from 'classnames';
import { gql } from 'graphql-request';
import _get from 'lodash/get';
import Image from 'next/image';
import PostLink from './PostLink';

interface Props {
  inGrid?: boolean;
  data: any;
}

const PostCard = ({ inGrid = false, data }: Props) => {
  if (!data.featuredImage) {
    return null;
  }
  return (
    <PostLink
      className="postcard group relative overflow-hidden flex flex-col shadow w-full rounded-lg bg-gray-900"
      post={data}>
      <div className="relative overflow-hidden block w-full aspect-w-1 aspect-h-1">
        <Image
          alt={data.featuredImage.node.altText}
          className="transition-transform ease-out duration-300 pointer:transform origin-top group-hover:scale-[1.02] group-hover:duration-[3s]"
          layout="fill"
          loading="lazy"
          objectFit="cover"
          src={`https://res.cloudinary.com/vietnam-coracle/image/fetch/${data.featuredImage.node.srcLarge}`}
        />
        <div className="absolute inset-0 top-auto h-1/2 pointer-events-none bg-gradient-to-t from-gray-900 via-black-50 to-transparent" />
      </div>
      <div className="relative flex-auto flex items-end -mt-24 p-1 px-4 md:px-5 md:py-6 pt-4 pb-6 font-medium rounded-b">
        <div className="relative">
          <h3
            className={cx(
              'font-display text-2xl text-gray-100 tracking-tightest lg:tracking-tight',
              {
                'text-lg md:text-2xl leading-snug': !inGrid,
              },
            )}>
            {data.title}
          </h3>
          <div
            className={cx(
              'postcard-excerpt',
              'mt-2 font-serif text-sm text-gray-100 xl:text-gray-300',
              {
                'block line-clamp-3 xl:line-clamp-4': !inGrid,
              },
            )}
            dangerouslySetInnerHTML={{ __html: data.excerpt }}></div>
        </div>
      </div>
    </PostLink>
  );
};

PostCard.fragments = gql`
  fragment PostCardData on ContentNode {
    uri
    slug
    ... on NodeWithExcerpt {
      excerpt
    }
    ... on NodeWithFeaturedImage {
      featuredImage {
        node {
          __typename
          altText
          id
          srcLarge: sourceUrl(size: LARGE)
          slug
        }
      }
    }
    ... on NodeWithTitle {
      title
    }
  }
`;

export default PostCard;
