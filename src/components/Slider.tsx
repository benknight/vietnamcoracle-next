import cx from 'classnames';
import _debounce from 'lodash/debounce';
import _throttle from 'lodash/throttle';
import { forwardRef, useCallback, useRef, useState, useEffect } from 'react';
import { RadioGroup } from '@headlessui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';

export function Slider({ className = '', children }) {
  const advanceRef = useRef<() => void>();
  const cursorRef = useRef<number>();
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
  const [domLoaded, setDomLoaded] = useState(false);

  const goTo = useCallback(
    (destination: number, intent: 'auto' | 'manual' = 'auto') => {
      const slides = parentRef.current?.querySelectorAll(':scope > a');

      if (intent === 'manual') {
        setPlay(false);
      }

      parentRef.current?.scrollTo({
        left: (slides[destination] as HTMLElement).offsetLeft,
        behavior: 'instant',
      });
    },
    [],
  );

  // Auto-play behavior
  useEffect(() => {
    if (!slideCount || !domLoaded) return;

    if (play && !intervalRef.current) {
      intervalRef.current = window.setInterval(() => {
        busyRef.current = true;
        advanceRef.current();
        window.setTimeout(() => (busyRef.current = false), 500);
      }, 8000);
    }

    if (!play && intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [domLoaded, play, slideCount]);

  // Update the advance callback
  useEffect(() => {
    advanceRef.current = () => goTo((cursor + 1) % slideCount);
  }, [cursor, slideCount]);

  // Track DOM loaded state in local state
  useEffect(() => {
    const onLoad = () => {
      setDomLoaded(true);
    };
    if (window.document.readyState === 'complete') {
      onLoad();
    } else {
      window.addEventListener('load', onLoad);
    }
    return () => window.removeEventListener('load', onLoad);
  }, []);

  // Update cursor when user scrolls
  useEffect(() => {
    if (!domLoaded) return;
    const slides = parentRef.current.querySelectorAll(':scope > a');
    setSlideCount(slides.length);
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            let index = 0;
            let child = entry.target;
            while ((child = child.previousSibling as HTMLElement)) index++;
            if (cursorRef.current !== index && !busyRef.current) {
              setPlay(false);
            }
            setCursor(index);
          }
        });
      },
      {
        root: parentRef.current,
        threshold: 0.5,
      },
    );
    slides.forEach(node => observer.observe(node));
  }, [domLoaded]);

  // Nav auto-hide behavior
  useEffect(() => {
    const timeout = _throttle(
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

  // Prevent slider from getting 'stuck' in an in-between position
  // (happens only in Chromium as of Nov 2022)
  useEffect(() => {
    const listener = _debounce(() => goTo(cursorRef.current), 1500);
    parentRef.current?.addEventListener('wheel', listener);
    parentRef.current?.addEventListener('touchend', listener);
    return () => {
      parentRef.current?.removeEventListener('wheel', listener);
      parentRef.current?.removeEventListener('touchend', listener);
    };
  }, []);

  // Sync cursor ref with cursor state
  useEffect(() => {
    cursorRef.current = cursor;
  }, [cursor]);

  return (
    <div
      className={cx(
        className,
        'relative text-gray-900 bg-gradient-to-t from-gray-500 to-gray-400',
      )}
      ref={rootRef}>
      <div className="relative overflow-hidden">
        <div
          className="relative snap-mandatory snap-x overflow-x-auto flex flex-nowrap w-full h-full no-scrollbar"
          dir="ltr"
          ref={parentRef}>
          {children}
        </div>
        <nav
          className={cx(
            'hidden pointer:flex transition-opacity duration-500 ease text-gray-100 pointer-events-none',
            showNav ? 'opacity-100' : 'opacity-0',
          )}
          ref={navRef}>
          {(() => {
            const btnClassName =
              'absolute h-full text-white opacity-80 hover:opacity-100 from-black-50 to-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 pointer-events-auto transition ease duration-100 hover:scale-110 active:scale-105';
            return (
              <>
                <button
                  aria-label="Prev"
                  className={cx(
                    btnClassName,
                    'top-0 left-0 pl-2 pr-8 bg-gradient-to-r',
                  )}
                  onClick={() => {
                    goTo((cursor - 1 + slideCount) % slideCount, 'manual');
                  }}
                  type="button">
                  <ChevronLeftIcon className="!w-20 !h-20" />
                </button>
                <button
                  aria-label="Next"
                  className={cx(
                    btnClassName,
                    'top-0 right-0 pr-2 pl-8 bg-gradient-to-l',
                  )}
                  onClick={() => {
                    goTo((cursor + 1) % slideCount, 'manual');
                  }}
                  type="button">
                  <ChevronRightIcon className="!w-20 !h-20" />
                </button>
              </>
            );
          })()}
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
                      'box-content h-[5px] lg:h-2 block border border-gray-700 dark:border-white rounded-full transition-all ease duration-300',
                      checked ? 'w-4' : 'w-[5px] lg:w-2',
                      {
                        'bg-gray-700 dark:bg-white': checked,
                        'bg-transparent border-opacity-50 dark:border-opacity-50':
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
            className="absolute py-2 w-full flex justify-center items-center cursor-default"
            value={cursor}
            onChange={i => goTo(i, 'manual')}>
            <RadioGroup.Label className="sr-only">
              Slider Image Index
            </RadioGroup.Label>
            <div className="inline-flex scale-90">{buttons}</div>
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
      className={cx(className, 'snap-center snap-always')}
      ref={ref}
    />
  );
});
