import { useState, useEffect } from "react";
import PropTypes from "prop-types";

function Counter({ max }) {
  const [count, setCount] = useState(max);

  useEffect(() => {
    const interval = setInterval(() => {
      if (count > 0) {
        setCount((prevCount) => prevCount - 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [max, count]);

  return <>{count}</>;
}

Counter.propTypes = {
  max: PropTypes.number.isRequired,
};

export default Counter;
