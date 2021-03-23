import { gql } from 'graphql-request';
import Carousel, { CarouselSlide } from './Carousel';
import Hero from './Hero';

const Slider = ({ data }) => {
  return (
    <Carousel className="text-gray-900 bg-white dark:bg-gray-950 max-w-screen-2xl mx-auto">
      {data.posts
        .filter(
          post =>
            Boolean(post.thumbnails.thumbnailSlideSquare) &&
            Boolean(post.thumbnails.thumbnailSlideWidescreen),
        )
        .map(post => (
          <CarouselSlide
            className="block relative w-full h-full flex-shrink-0"
            component="a"
            href={post.link}
            key={post.link}>
            <Hero
              imgSm={post.thumbnails.thumbnailSlideSquare}
              imgLg={post.thumbnails.thumbnailSlideWidescreen}
            />
          </CarouselSlide>
        ))}
    </Carousel>
  );
};

Slider.fragments = gql`
  fragment SliderComponentData on CategoryPage_Slider {
    posts {
      ... on Post {
        link
        title
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

export default Slider;
