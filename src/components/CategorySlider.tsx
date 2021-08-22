import { gql } from 'graphql-request';
import Link from 'next/link';
import internalizeUrl from '../lib/internalizeUrl';
import Slider, { SliderSlide } from './Slider';
import Hero from './Hero';

const CategorySlider = ({ data }) => {
  return (
    <Slider>
      {data.posts
        .filter(
          post =>
            Boolean(post.thumbnails.thumbnailSlideSquare) &&
            Boolean(post.thumbnails.thumbnailSlideWidescreen),
        )
        .map(post => (
          <Link href={post.uri} key={post.uri} passHref>
            <SliderSlide
              as="a"
              className="block relative w-full h-full flex-shrink-0">
              <Hero
                imgSm={post.thumbnails.thumbnailSlideSquare}
                imgLg={post.thumbnails.thumbnailSlideWidescreen}
                preserveAspectRatio
              />
            </SliderSlide>
          </Link>
        ))}
    </Slider>
  );
};

CategorySlider.fragments = gql`
  fragment CategorySliderComponentData on Category_Slider {
    posts {
      ... on Post {
        title
        uri
        thumbnails {
          thumbnailSlideSquare {
            ...HeroImageData
          }
          thumbnailSlideWidescreen {
            ...HeroImageData
          }
        }
      }
    }
  }
  ${Hero.fragments}
`;

export default CategorySlider;
