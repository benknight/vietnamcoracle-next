// https://gist.github.com/benknight/3bbf8dbcbb0dfef9adc611be74538f67
import { useRef, useState, useCallback, useEffect } from 'react';

export default function useCarousel() {
  const scrollArea = useRef();
  const [isTouchDevice, setIsTouchDevice] = useState(null);
  const [scrollBy, setScrollBy] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(null);
  const [showNav, setShowNav] = useState(null);

  const navigate = useCallback(
    delta => {
      const { scrollLeft } = scrollArea.current;
      scrollArea.current.scroll({
        behavior: 'smooth',
        left: scrollLeft + scrollBy * delta,
      });
    },
    [scrollBy],
  );

  useEffect(() => {
    const scrollAreaNode = scrollArea.current;

    const calculateScrollPosition = () => {
      if (!scrollAreaNode) return;
      const { width } = scrollAreaNode.getBoundingClientRect();
      if (scrollAreaNode.scrollLeft === 0) {
        setScrollPosition('start');
      } else if (
        scrollAreaNode.scrollLeft + width ===
        scrollAreaNode.scrollWidth
      ) {
        setScrollPosition('end');
      } else {
        setScrollPosition('between');
      }
    };

    // Calculate scrollBy offset
    const calculateScrollBy = () => {
      if (!scrollAreaNode) return;
      const { width: containerWidth } = scrollAreaNode.getBoundingClientRect();
      setShowNav(scrollAreaNode.scrollWidth > containerWidth);
      const childNode = scrollAreaNode.querySelector(':scope > *');
      if (!childNode) return;
      const { width: childWidth } = childNode.getBoundingClientRect();
      setScrollBy(childWidth * Math.floor(containerWidth / childWidth));
    };

    const observer = new MutationObserver(calculateScrollBy);

    const attachListeners = () => {
      if (scrollAreaNode) observer.observe(scrollAreaNode, { childList: true });
      scrollAreaNode.addEventListener('scroll', calculateScrollPosition);
      window.addEventListener('resize', calculateScrollBy);
    };

    const detachListeners = () => {
      observer.disconnect();
      scrollAreaNode.removeEventListener('scroll', calculateScrollPosition);
      window.removeEventListener('resize', calculateScrollBy);
    };

    if (isTouchDevice === true) {
      detachListeners();
    }

    if (isTouchDevice === false) {
      attachListeners();
      calculateScrollBy();
      calculateScrollPosition();
    }

    return detachListeners;
  }, [isTouchDevice, navigate]);

  useEffect(() => {
    const mql = window.matchMedia('(pointer: fine)');
    const handleMql = ({ matches }) => {
      setIsTouchDevice(!matches);
    };
    handleMql(mql);
    mql.addEventListener('change', handleMql);
    return () => {
      mql.removeEventListener('change', handleMql);
    };
  }, []);

  return {
    getLeftNavProps: () => ({
      onClick: () => navigate(-1),
    }),
    getRightNavProps: () => ({
      onClick: () => navigate(1),
    }),
    isTouchDevice,
    navigate,
    scrollAreaRef: scrollArea,
    scrollPosition,
    showNav,
  };
}
