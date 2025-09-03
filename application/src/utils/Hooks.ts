import { useState, useCallback } from "react";

interface SwipeConfigs {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  minSwipeDistance?: number;
}
export const useSwipe = ({
  onSwipeDown,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  minSwipeDistance = 30,
}: SwipeConfigs) => {
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [touchStartY, setTouchStartY] = useState(0);
  const [touchEndY, setTouchEndY] = useState(0);

  const handleTouchStart = useCallback((e) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchStartY(e.targetTouches[0].clientY);
  }, []);

  const handleTouchMove = useCallback((e) => {
    setTouchEnd(e.targetTouches[0].clientX);
    setTouchEndY(e.targetTouches[0].clientY);
  }, []);

  const handleTouchEnd = useCallback(() => {
    const horizontalDistance = touchEnd - touchStart;
    const verticalDistance = touchEndY - touchStartY;

    if (Math.abs(horizontalDistance) > Math.abs(verticalDistance)) {
      // Horizontal swipe
      if (horizontalDistance > minSwipeDistance && onSwipeRight) {
        onSwipeRight();
      } else if (horizontalDistance < -minSwipeDistance && onSwipeLeft) {
        onSwipeLeft();
      }
    } else {
      // Vertical swipe
      if (verticalDistance > minSwipeDistance && onSwipeDown) {
        onSwipeDown();
      } else if (verticalDistance < -minSwipeDistance && onSwipeUp) {
        onSwipeUp();
      }
    }

    setTouchStart(0);
    setTouchEnd(0);
    setTouchStartY(0);
    setTouchEndY(0);
  }, [
    touchStart,
    touchEnd,
    touchStartY,
    touchEndY,
    minSwipeDistance,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
  ]);

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };
};

export const useStorage = <T>(
  name: string,
  defaultValue: T,
  parseValue: (s: string) => T,
  stringify: (t: T) => string
) => {
  const startingStringedValue = localStorage.getItem(name);
  const startingValue = startingStringedValue
    ? parseValue(startingStringedValue)
    : null;
  const [statedValue, setStatedValue] = useState<T>(
    startingValue || defaultValue
  );

  console.log(statedValue);
  return [
    statedValue,
    (newValue: T) => {
      localStorage.setItem(name, stringify(newValue));
      setStatedValue(newValue);
    },
  ] as const;
};
