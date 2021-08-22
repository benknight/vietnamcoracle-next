import cx from 'classnames';
import { throttle } from 'lodash';
import { forwardRef, useCallback, useRef, useState, useEffect } from 'react';
import { RadioGroup } from '@headlessui/react';
import PauseIcon from '@material-ui/icons/Pause';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import SkipPrevIcon from '@material-ui/icons/SkipPrevious';

export default function Slider({ className, children, ...props }) {
  const advanceRef = useRef<() => void>();
  const busyRef = useRef<boolean>();
  const intervalRef = useRef<number>();
  const parentRef = useRef<HTMLDivElement>();
  const navRef = useRef<HTMLDivElement>();
  const rootRef = useRef<HTMLDivElement>();
  const timeoutRef = useRef<boolean>();
  const [play, setPlay] = useState(true);
  const [showNav, setShowNav] = useState(false);
  const [slideCount, setSlideCount] = useState(null);
  const [cursor, setCursor] = useState(0);

  const goTo = useCallback(
    (
      destination: number,
      intent: 'auto' | 'manual' = 'auto',
      behavior: 'auto' | 'smooth' = 'auto',
    ) => {
      const slides = parentRef.current?.querySelectorAll(':scope > a');
      if (intent === 'manual') {
        setPlay(false);
      }
      if (intent === 'auto' && behavior === 'auto') {
        behavior = 'smooth';
      }
      parentRef.current?.scrollTo({
        left: (slides[destination] as HTMLElement).offsetLeft,
        behavior,
      });
    },
    [],
  );

  // Auto-play behavior
  useEffect(() => {
    if (!slideCount) return;
    if (play && !intervalRef.current) {
      intervalRef.current = window.setInterval(() => {
        busyRef.current = true;
        advanceRef.current();
        window.setTimeout(() => (busyRef.current = false), 500);
      }, 5000);
    }
    if (!play && intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [play, slideCount]);

  // Update the advance callback
  useEffect(() => {
    advanceRef.current = () => goTo((cursor + 1) % slideCount);
  }, [cursor, slideCount]);

  // Update cursor when user scrolls
  useEffect(() => {
    const slides = parentRef.current.querySelectorAll(':scope > a');
    setSlideCount(slides.length);
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            let index = 0;
            let child = entry.target;
            while ((child = child.previousSibling as HTMLElement)) index++;
            setCursor(index);
            if (cursor !== index && !busyRef.current) {
              setPlay(false);
            }
          }
        });
      },
      {
        root: parentRef.current,
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
    return () => window.removeEventListener('load', observeSlides);
  }, []);

  // Nav auto-hide behavior
  useEffect(() => {
    const timeout = throttle(
      () =>
        window.setTimeout(() => {
          if (timeoutRef.current !== false) {
            setShowNav(false);
            timeoutRef.current = true;
          }
        }, 2000),
      2000,
    );
    const mouseMoveListener = () => {
      setShowNav(true);
      timeout();
    };
    const mouseEnterListener = () => {
      timeoutRef.current = false;
      setShowNav(true);
    };
    const mouseLeaveListener = () => {
      timeoutRef.current = true;
      setShowNav(false);
    };
    navRef.current?.querySelectorAll('button').forEach(node => {
      node.addEventListener('mousemove', event => {
        event.stopPropagation();
        event.stopImmediatePropagation();
      });
      node.addEventListener('mouseenter', mouseEnterListener);
      node.addEventListener('mouseleave', mouseLeaveListener);
    });
    parentRef.current?.addEventListener('mousemove', mouseMoveListener);
    return () => {
      navRef.current?.querySelectorAll('button').forEach(node => {
        node.removeEventListener('mouseenter', mouseEnterListener);
        node.removeEventListener('mouseleave', mouseLeaveListener);
      });
      parentRef.current?.removeEventListener('mousemove', mouseMoveListener);
    };
  }, []);

  return (
    <div
      {...props}
      className={cx(className, 'text-gray-900 bg-black')}
      ref={rootRef}>
      <div className="relative overflow-hidden">
        <div
          className="relative snap snap-mandatory snap-x overflow-x-auto flex flex-nowrap w-full h-full no-scrollbar max-w-screen-2xl mx-auto"
          dir="ltr"
          ref={parentRef}>
          {children}
        </div>
        <nav
          className={cx(
            'box-content hidden pointer:flex justify-center w-full h-11 pt-8 absolute left-0 bottom-0 transform transition-opacity duration-100 ease text-gray-100 shadow-xl bg-gradient-to-t from-black-50 to-transparent pointer-events-none',
            showNav ? 'opacity-100' : 'opacity-0',
          )}
          ref={navRef}>
          <button
            aria-label="Prev"
            className="flex items-center hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 pointer-events-auto"
            onClick={() => {
              goTo((cursor - 1 + slideCount) % slideCount, 'manual', 'smooth');
            }}>
            <SkipPrevIcon className="!w-7 !h-7" />
          </button>
          <button
            aria-label={play ? 'Pause' : 'Play'}
            className="flex items-center px-1 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 pointer-events-auto"
            onClick={() => setPlay(play => !play)}>
            {play ? (
              <PauseIcon className="!w-8 !h-8" />
            ) : (
              <PlayArrowIcon className="!w-8 !h-8" />
            )}
          </button>
          <button
            aria-label="Next"
            className="flex items-center hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 pointer-events-auto"
            onClick={() => {
              goTo((cursor + 1) % slideCount, 'manual', 'smooth');
            }}>
            <SkipNextIcon className="!w-7 !h-7" />
          </button>
        </nav>
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
                      'box-content w-1 h-1 block bg-primary-700 dark:bg-white border border-primary-700 dark:border-white rounded-full shadow',
                      {
                        'opacity-50': !checked,
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
            className="py-2 w-full flex justify-center items-center cursor-default bg-white dark:bg-gray-950"
            value={cursor}
            onChange={i => goTo(i, 'manual')}>
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

export const SliderSlide = forwardRef<
  HTMLElement,
  { as: any; children: React.ReactNode; className?: string }
>(({ as, className = '', ...props }, ref) => {
  const Component = as;
  return (
    <Component
      {...props}
      className={cx(className, 'snap-center always-stop')}
      ref={ref}
    />
  );
});
