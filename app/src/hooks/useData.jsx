import { useEffect, useState } from "react";

function useData(func, isRealtime = false) {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  let driver = localStorage.getItem("driver");

  useEffect(() => {
    let isMounted = true; // Flag to check if the component is still mounted

    const fetchData = async () => {
      try {
        const response = await func();
        if (isMounted) {
          setData(response);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
        }
      }
    };

    if (driver) {
      fetchData();

      if (isRealtime) {
        const realtimeData = setInterval(fetchData, 30000);

        return () => {
          clearInterval(realtimeData);
          isMounted = false; // Component is unmounting, so set isMounted to false
        };
      }
    }
  }, [driver, func, isRealtime]);

  return [data, error];
}

export default useData;
