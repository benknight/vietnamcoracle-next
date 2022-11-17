import Link from 'next/link';
import { Slider, SliderSlide } from './Slider';
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
        .map((post, index) => (
          <Link href={post.uri} key={post.uri} passHref>
            <SliderSlide
              as="a"
              className="block relative w-full h-full shrink-0">
              <Hero
                imgSm={post.thumbnails.thumbnailSlideSquare}
                imgLg={post.thumbnails.thumbnailSlideWidescreen}
                preserveAspectRatio
                priority={index === 0}
              />
            </SliderSlide>
          </Link>
        ))}
    </Slider>
  );
};

export default CategorySlider;
