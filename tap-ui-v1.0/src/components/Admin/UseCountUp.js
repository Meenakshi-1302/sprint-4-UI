import { useEffect, useState } from 'react';

const useCountUp = (targetNumber, duration) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = targetNumber;
    const incrementTime = Math.abs(Math.floor(duration / (end - start)));
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) {
        clearInterval(timer);
      }
    }, incrementTime);

    return () => clearInterval(timer); // Cleanup on unmount
  }, [targetNumber, duration]);

  return count;
};

export default useCountUp;