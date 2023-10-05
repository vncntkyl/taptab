import { useEffect, useState } from "react";

function useData(func, isRealtime = false) {
  const [data, setData] = useState([]);
  useEffect(() => {
    const setup = async () => {
      const response = await func();
      setData(response);
    };
    setup();

    if (isRealtime) {
      const realtimeData = setInterval(setup, 60000);

      return () => {
        clearInterval(realtimeData);
      };
    }
  }, []);

  return [data];
}

export default useData;
