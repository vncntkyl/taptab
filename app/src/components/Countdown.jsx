import React, { useEffect, useState } from "react";
import Counter from "./Counter";

function Countdown({ max }) {
  const [percentage, setPercentage] = useState(100);

  useEffect(() => {
    let count = max;
    const interval = setInterval(() => {
      if (count > 0) {
        const percentage = (count / max) * 100;
        setPercentage(Math.ceil(percentage));
        console.log(percentage);
        count--;
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [max]);

  return (
    <div className="absolute bottom-0 w-full  flex items-center">
      <div
        className="transition-all duration-500 text-xs bg-secondary-light text-center whitespace-nowrap h-[2.5ch]"
        style={{ width: `${percentage}%` }}
      ></div>
      <span className="absolute w-full text-center">
        The next ad will show in <Counter max={max} /> seconds
      </span>
    </div>
  );
}

export default Countdown;
