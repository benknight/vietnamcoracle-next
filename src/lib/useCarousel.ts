// https://gist.github.com/benknight/3bbf8dbcbb0dfef9adc611be74538f67
import { useRef, useState, useCallback, useEffect } from 'react';

export default function useCarousel() {
  const scrollArea = useRef<HTMLElement>();
  const [isTouchDevice, setIsTouchDevice] = useState(null);
  const [scrollBy, setScrollBy] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(null);
  const [showNav, setShowNav] = useState(null);

  const getSlideWidth = useCallback(() => {
    const childNode = scrollArea.current.querySelector(':scope > *');
    return childNode?.getBoundingClientRect()?.width ?? null;
  }, []);

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
      const slideWidth = getSlideWidth();
      if (scrollAreaNode.scrollLeft < slideWidth / 2) {
        setScrollPosition('start');
      } else if (
        scrollAreaNode.scrollLeft + width >
        scrollAreaNode.scrollWidth - slideWidth / 2
      ) {
        setScrollPosition('end');
      } else {
        setScrollPosition('between');
      }
    };

    // Calculate scrollBy offset
    const calculateScrollBy = () => {
      if (!scrollAreaNode) return;
      const computedStyle = getComputedStyle(scrollAreaNode);
      const containerWidth =
        scrollAreaNode.clientWidth -
        parseFloat(computedStyle['padding-right']) -
        parseFloat(computedStyle['padding-left']);
      setShowNav(scrollAreaNode.scrollWidth > containerWidth);
      const slideWidth = getSlideWidth();
      if (slideWidth) {
        setScrollBy(slideWidth * Math.floor(containerWidth / slideWidth));
      }
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
    if (mql.addEventListener) {
      mql.addEventListener('change', handleMql);
    } else if (mql.addListener) {
      mql.addListener(handleMql);
    }
    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener('change', handleMql);
      } else if (mql.removeListener) {
        mql.removeListener(handleMql);
      }
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
