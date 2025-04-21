import { useEffect, useRef, RefObject } from 'react';

/**
 * Custom hook that detects clicks outside of the specified element
 */
const useOutsideClick = <T extends HTMLElement = HTMLElement>(
  callback: () => void
): RefObject<T> => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    // Attach the event listener to detect outside clicks
    document.addEventListener('mousedown', handleClickOutside);

    // Clean up the event listener on unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [callback]);

  return ref;
};

export default useOutsideClick;
