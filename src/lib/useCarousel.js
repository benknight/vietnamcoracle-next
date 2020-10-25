// https://gist.github.com/benknight/3bbf8dbcbb0dfef9adc611be74538f67
import _debounce from 'lodash/debounce';
import React from 'react';

export default function useCarousel() {
  const scrollArea = React.useRef();
  const [isTouchDevice, setIsTouchDevice] = React.useState(null);
  const [scrollBy, setScrollBy] = React.useState(null);
  const [swipeDirection, setSwipeDirection] = React.useState(null);
  const [scrollPosition, setScrollPosition] = React.useState(null);

  const navigate = React.useCallback(
    delta => {
      const { scrollLeft } = scrollArea.current;
      scrollArea.current.scroll({
        left: scrollLeft + scrollBy * delta,
        behavior: 'smooth',
      });
    },
    [scrollBy],
  );

  React.useEffect(() => {
    const calculateScrollPosition = () => {
      if (!scrollArea.current) {
        return;
      }
      const { width } = scrollArea.current.getBoundingClientRect();
      if (scrollArea.current.scrollLeft === 0) {
        setScrollPosition('start');
      } else if (
        scrollArea.current.scrollLeft + width ===
        scrollArea.current.scrollWidth
      ) {
        setScrollPosition('end');
      } else {
        setScrollPosition('between');
      }
    };

    // Calculate scrollBy offset
    const scrollAreaNode = scrollArea.current;
    const calculateScrollBy = () => {
      const { width: containerWidth } = scrollAreaNode.getBoundingClientRect();
      const { width: itemWidth } = scrollAreaNode
        .querySelector(':scope > *')
        .getBoundingClientRect();
      setScrollBy(itemWidth * Math.floor(containerWidth / itemWidth));
    };

    // Swipe behavior for non-touch devices
    const resetSwipeDirection = _debounce(() => setSwipeDirection(null), 50, {
      leading: true,
      trailing: false,
    });
    const onWheel = event => {
      if (event.deltaX > 20) {
        setSwipeDirection('right');
      } else if (event.deltaX < -20) {
        setSwipeDirection('left');
      }
      resetSwipeDirection();
    };

    const attachListeners = () => {
      scrollAreaNode.addEventListener('scroll', calculateScrollPosition);
      scrollAreaNode.addEventListener('wheel', onWheel);
      window.addEventListener('resize', calculateScrollBy);
    };

    const detachListeners = () => {
      scrollAreaNode.removeEventListener('scroll', calculateScrollPosition);
      scrollAreaNode.removeEventListener('wheel', onWheel);
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

  React.useEffect(() => {
    const mql = window.matchMedia('(pointer: fine)');
    const handleMql = ({ matches }) => {
      setIsTouchDevice(!matches);
      scrollArea.current.style.overflow = matches ? 'hidden' : 'auto';
    };
    handleMql(mql);
    mql.addEventListener('change', handleMql);
    return () => {
      mql.removeEventListener('change', handleMql);
    };
  }, []);

  React.useEffect(() => {
    if (swipeDirection === 'right') {
      navigate(1);
    } else if (swipeDirection === 'left') {
      navigate(-1);
    }
  }, [swipeDirection]);

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
  };
}
