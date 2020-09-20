import cx from 'classnames';
import { graphql } from 'gatsby';
import React from 'react';
import Carousel, { CarouselSlide } from '../components/Carousel';

export default function Slider({ data }) {
  return (
    <Carousel className="mb-8">
      {data.posts.map(post => (
        <CarouselSlide
          className="block relative w-full flex-shrink-0"
          component="a"
          href={post.link}
          key={post.link}>
          <img alt={post.slide.title} srcSet={post.slide.image.srcSet} />
          <div
            className={cx(
              'w-full h-full pb-8 absolute top-0 left-0 flex',
              getClassNameFromSlidePosition(post.slide.position),
            )}>
            <div
              className="slider-text flex-auto font-serif p-4 text-2xl sm:text-4xl md:text-5xl"
              dangerouslySetInnerHTML={{ __html: post.slide.words }}
              style={{ lineHeight: '1.1' }}
            />
          </div>
        </CarouselSlide>
      ))}
    </Carousel>
  );
}

export const query = graphql`
  fragment SliderComponentData on WpComponent_Slider {
    posts {
      ... on WpPost {
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

function getClassNameFromSlidePosition(position) {
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
