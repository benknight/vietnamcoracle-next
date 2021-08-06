import cx from 'classnames';
import { useCallback, useRef, useState, useEffect } from 'react';
import { RadioGroup } from '@headlessui/react';
import PauseIcon from '@material-ui/icons/PauseRounded';
import PlayArrowIcon from '@material-ui/icons/PlayArrowRounded';
import SkipNextIcon from '@material-ui/icons/SkipNextRounded';
import SkipPrevIcon from '@material-ui/icons/SkipPreviousRounded';
import PauseRounded from '@material-ui/icons/PauseRounded';

let advance = () => {};

const navIconClassName = '!w-6 !h-6';

export default function Carousel({ className, children, ...props }) {
  const rootRef = useRef<HTMLDivElement>();
  const intervalRef = useRef<number>();
  const [play, setPlay] = useState(true);
  const [slideCount, setSlideCount] = useState(null);
  const [cursor, setCursor] = useState(0);

  const goTo = useCallback(
    (destination: number, intent: 'auto' | 'manual' = 'manual') => {
      const slides = rootRef.current?.querySelectorAll(':scope > a');
      if (intent === 'manual') {
        setPlay(false);
      }
      rootRef.current.scrollTo({
        left: (slides[destination] as HTMLElement).offsetLeft,
        behavior: intent === 'auto' ? 'smooth' : 'auto',
      });
    },
    [],
  );

  useEffect(() => {
    // Auto-play
    if (!slideCount) return;
    if (play && !intervalRef.current) {
      // Advance immediately if the carousel was previously paused
      if (intervalRef.current === null) {
        advance();
      }
      intervalRef.current = window.setInterval(() => {
        advance();
      }, 5000);
    }
    if (!play && intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [play, slideCount]);

  useEffect(() => {
    // Update the advance callback
    advance = () => goTo((cursor + 1) % slideCount, 'auto');
  }, [cursor, slideCount]);

  useEffect(() => {
    // Pause when the user pans left/right
    const onWheel = (event: WheelEvent) => {
      // TODO: Improve this logic
      if (Math.abs(event.deltaX) / Math.min(1, Math.abs(event.deltaY)) > 1) {
        setPlay(false);
      }
    };
    rootRef.current?.addEventListener('wheel', onWheel);
    return () => rootRef.current?.removeEventListener('wheel', onWheel);
  }, []);

  useEffect(() => {
    // Update cursor when user scrolls
    const slides = rootRef.current.querySelectorAll(':scope > a');
    setSlideCount(slides.length);
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            let index = 0;
            let child = entry.target;
            while ((child = child.previousSibling as HTMLElement)) index++;
            setCursor(index);
          }
        });
      },
      {
        root: rootRef.current,
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
    <div {...props} className={cx(className, 'group')}>
      <div className="relative overflow-hidden">
        <div
          className="relative snap snap-mandatory snap-x overflow-x-auto flex flex-nowrap w-full h-full"
          dir="ltr"
          ref={rootRef}>
          {children}
        </div>
        {slideCount > 0 && (
          <nav className="hidden pointer:flex h-10 absolute left-1/2 top-full transform -translate-x-1/2 transition duration-300 ease opacity-0 group-hover:-translate-y-16 group-hover:opacity-100 bg-black text-white shadow-xl rounded-full">
            <button
              aria-title="Prev"
              className="flex items-center pl-2 pr-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              onClick={() => {
                setPlay(false);
                goTo((cursor - 1 + slideCount) % slideCount, 'auto');
              }}>
              <SkipPrevIcon className={navIconClassName} />
            </button>
            <button
              aria-title={play ? 'Pause' : 'Play'}
              className="flex items-center px-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              onClick={() => setPlay(play => !play)}>
              {play ? (
                <PauseIcon className={navIconClassName} />
              ) : (
                <PlayArrowIcon className={navIconClassName} />
              )}
            </button>
            <button
              aria-title="Next"
              className="flex items-center pl-1 pr-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              onClick={() => {
                setPlay(false);
                goTo((cursor + 1) % slideCount, 'auto');
              }}>
              <SkipNextIcon className={navIconClassName} />
            </button>
          </nav>
        )}
      </div>
      {(() => {
        if (slideCount === 0) return null;
        const buttons = [];
        for (let i = 0; i < slideCount; i++) {
          buttons.push(
            <RadioGroup.Option
              className="cursor-pointer pointer-only p-1"
              key={i}
              value={i}>
              {({ checked }) => (
                <>
                  <span
                    className={cx(
                      'block bg-primary-700 dark:bg-white rounded-full shadow',
                      {
                        'w-2 h-2': checked,
                        'w-1 h-1 border border-primary-700 dark:border-white opacity-50 box-content':
                          !checked,
                      },
                    )}
                  />
                  <span className="sr-only">{i}</span>
                </>
              )}
            </RadioGroup.Option>,
          );
        }
        return (
          <RadioGroup
            className="py-2 w-full flex justify-center items-center cursor-default"
            value={cursor}
            onChange={i => goTo(i)}>
            <RadioGroup.Label className="sr-only">
              Slider Image Index
            </RadioGroup.Label>
            {buttons}
          </RadioGroup>
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
