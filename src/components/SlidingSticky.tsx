import { useEffect, useRef } from 'react';

export default function SlidingSticky({ children }) {
  const sticky = useRef<HTMLDivElement>();
  const stickyContainer = useRef<HTMLDivElement>();
  const spacer = useRef<HTMLDivElement>();
  const scrollPosition = useRef<number>();

  useEffect(() => {
    scrollPosition.current = 0;
    const topOffset = 56;
    const listener = () => {
      if (!sticky.current) return;
      const { top } = document.body.getBoundingClientRect();
      const isDown = top < scrollPosition.current;
      if (
        (isDown && !sticky.current?.style.top) ||
        (!isDown && !sticky.current?.style.bottom)
      ) {
        window.requestAnimationFrame(() => {
          const s = sticky.current.getBoundingClientRect();
          const c = stickyContainer.current.getBoundingClientRect();
          const r = s.height - window.innerHeight;
          spacer.current.style.height = `${Math.max(
            0,
            -1 * c.top + (c.top < 0 ? s.top : 0),
          )}px`;
          if (isDown) {
            sticky.current.style.bottom = '';
            sticky.current.style.top = `${-1 * r}px`;
          } else {
            sticky.current.style.bottom = `${-1 * (r + topOffset)}px`;
            sticky.current.style.top = '';
          }
        });
      }
      scrollPosition.current = top;
    };
    window.addEventListener('scroll', listener);
    return () => window.removeEventListener('scroll', listener);
  }, []);

  return (
    <div className="lg:flex-auto lg:px-6 py-12 lg:py-0" ref={stickyContainer}>
      <div className="hidden xl:block" ref={spacer} />
      <div className="flex-auto xl:sticky xl:py-8" ref={sticky}>
        {children}
      </div>
    </div>
  );
}
