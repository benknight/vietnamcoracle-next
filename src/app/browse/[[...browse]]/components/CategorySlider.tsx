import Link from 'next/link';
import Hero from '../../../../components/Hero';
import { Slider, SliderSlide } from './Slider';

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
          <Link href={post.uri} key={post.uri} passHref legacyBehavior>
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
