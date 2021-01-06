import cx from 'classnames';
import { gql } from 'graphql-request';
import Carousel, { CarouselSlide } from './Carousel';

function getClassNameFromSlidePosition(position: string): string {
  const [align, justify] = position.split('-');
  return cx({
    'items-start': align === 'top',
    'items-center': align === 'center',
    'items-end': align === 'bottom',
    'justify-start': justify === 'left',
    'justify-center': justify === 'center',
    'justify-end': justify === 'right',
  });
}

const Slider = ({ data }) => {
  return (
    <Carousel className="slider text-gray-900">
      {data.posts.map(post => (
        <CarouselSlide
          className="block relative w-full h-full flex-shrink-0"
          component="a"
          href={post.link}
          key={post.link}>
          <img
            alt={post.slide.title}
            className="w-full h-full object-cover"
            srcSet={post.slide.image.srcSet}
          />
          <div
            className={cx(
              'w-full h-full pb-8 md:py-16 absolute top-0 left-0 flex',
              getClassNameFromSlidePosition(post.slide.position),
            )}>
            <div
              className="
                slider-text lg:px-8 p-4
                font-serif text-2xl sm:text-4xl md:text-5xl"
              dangerouslySetInnerHTML={{ __html: post.slide.words }}
              style={{ lineHeight: '1.1' }}
            />
          </div>
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
        slide {
          position
          words
          image {
            id
            srcSet
          }
        }
      }
    }
  }
`;

export default Slider;
