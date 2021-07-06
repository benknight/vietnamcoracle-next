import cx from 'classnames';
import { useRef, useState, useEffect } from 'react';

export default function Carousel({ className, children, ...props }) {
  const ref = useRef<HTMLDivElement>();
  const [slideCount, setSlideCount] = useState(null);
  const [cursor, setCursor] = useState(0);

  useEffect(() => {
    const slides = ref.current.querySelectorAll(':scope > a');
    setSlideCount(slides.length);
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            let index = 0;
            let child = entry.target;
            while ((child = child.previousSibling as HTMLElement)) index++;
            setCursor(index);
            // console.log('setCursor', index);
          }
        });
      },
      {
        root: ref.current,
        threshold: 0.5,
      },
    );
    const observeSlides = () => {
      slides.forEach(node => {
        observer.observe(node);
      });
    };
    if (window.document.readyState === 'complete') {
      observeSlides();
    } else {
      window.addEventListener('load', observeSlides);
    }
  }, []);

  return (
    <div {...props} className={cx(className, 'relative overflow-hidden')}>
      <div
        className="snap snap-mandatory snap-x overflow-x-auto flex flex-nowrap w-full h-full -mb-4 pb-14"
        dir="ltr"
        ref={ref}>
        {children}
      </div>
      {(() => {
        if (slideCount === 0) return null;
        const buttons = [];
        for (let i = 0; i < slideCount; i++) {
          buttons.push(
            <button
              className="pointer-only p-1"
              key={i}
              onClick={() => {
                const slides = ref.current.querySelectorAll(':scope > a');
                slides[i].scrollIntoView({ behavior: 'smooth' });
                setCursor(i);
              }}>
              <span
                className={cx(
                  'block bg-purple-700 dark:bg-white rounded-full shadow',
                  {
                    'w-2 h-2': cursor === i,
                    'w-1 h-1 border border-purple-700 dark:border-white opacity-50 box-content':
                      cursor !== i,
                  },
                )}
              />
              <span className="sr-only">{i}</span>
            </button>,
          );
        }
        return (
          <div
            className="
              py-2 w-full flex justify-center items-center
              absolute bottom-0 left-0 cursor-default">
            {buttons}
          </div>
        );
      })()}
    </div>
  );
}

export function CarouselSlide({ className, component, ...props }) {
  const Component = component;
  return (
    <Component
      {...props}
      className={cx(className, 'snap-center always-stop')}
    />
  );
}
