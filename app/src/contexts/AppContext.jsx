/* eslint-disable react/prop-types */
import axios from "axios";
import { developmentRoutes as url } from "../functions/Routes";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useStaticAds } from "../functions/staticAdFunctions";
import useData from "../hooks/useData";
import { isBefore, parseISO, subHours } from "date-fns";
import { weatherFunctions } from "../functions/WeatherFunctions";
import { useVideos } from "../functions/VideoFunctions";
const AppContext = React.createContext();

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  return useContext(AppContext);
}

export function AppProvider({ children }) {
  const { getStaticAds, getGeoTaggedAd } = useStaticAds();
  const { retrieveWeatherForecast, retrieveWeatherAds } = weatherFunctions();
  const { getGeoStorageItems, calculateDistance } = useVideos();
  const [staticAds] = useData(getStaticAds, true);
  const [activeAd, setActiveAd] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  const hour = 60 * 60 * 1000;

  const checkCondition = (condition) => {
    condition = condition.toLowerCase();
    if (/cloudy/.test(condition)) {
      return "cloudy";
    } else if (/sunny/.test(condition)) {
      return "sunny";
    } else if (/clear/.test(condition)) {
      return "clear";
    } else if (/rain|snow|sleet|drizzle|snow|showers/.test(condition)) {
      return "rainy";
    } else if (/mist|overcast|fog/.test(condition)) {
      return "foggy";
    }
  };

  const fetchWeatherData = useCallback(async () => {
    if (coordinates === null) return;
    const [lat, lng] = coordinates;
    try {
      const response = await retrieveWeatherForecast(lat, lng);
      if (response) {
        const driver = localStorage.getItem("driver");
        if (!driver) return;

        const condition = checkCondition(response.current.condition.text);
        const temperature = response.current.temp_c;
        const adList = await retrieveWeatherAds(condition, temperature);

        if (adList && adList.length !== 0) {
          let shownAds = localStorage.getItem("shownAds");
          shownAds = shownAds ? JSON.parse(shownAds) : [];

          for (const ad of adList) {
            const currentAd = shownAds.find((shown) => {
              const match = shown._id === ad._id;

              const lastShown = new Date(shown.last_shown);
              const difference = new Date() - lastShown;

              const passedHour = difference < hour;

              return match && passedHour;
            });

            if (!currentAd) {
              setTimeout(() => {
                setActiveAd({ ...ad, ad_type: "weather" });
              }, 5000);
              break;
            }
          }
        }
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  }, [coordinates, retrieveWeatherAds, retrieveWeatherForecast]);

  const fetchAd = useCallback(
    async (position) => {
      try {
        const response = await getGeoTaggedAd(position);

        if (typeof response !== "string") {
          const lastShown = localStorage.getItem(`geo-${response._id}`);
          let difference = 0;
          if (lastShown) {
            const date = JSON.parse(lastShown).last_shown;
            difference = new Date() - new Date(date);
          }
          // const distance = calculateDistance(resCoords, devCoords);

          const shouldShowAd = !lastShown || difference >= hour;

          if (shouldShowAd) {
            setActiveAd({ ...response, ad_type: "geo" });
            response.last_shown = new Date().toISOString();
            localStorage.setItem(
              `geo-${response._id}`,
              JSON.stringify(response)
            );
          }
        }
      } catch (error) {
        console.error("Error fetching geo-tagged ad:", error);
      }
    },
    [getGeoTaggedAd]
  );

  const sendAnalytics = async (id, log) => {
    try {
      const response = await axios.post(
        `${url.storage}geolocation/analytics/${id}`,
        log,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchWeatherData();
    const interval = setInterval(fetchWeatherData, 60000);
    return () => clearInterval(interval);
  }, [fetchWeatherData]);

  useEffect(() => {
    if (coordinates) {
      const position = { lat: coordinates[0], lng: coordinates[1] };
      const currentlyShownGeoAds = getGeoStorageItems();

      if (currentlyShownGeoAds) {
        Object.keys(currentlyShownGeoAds).forEach((key) => {
          const item = currentlyShownGeoAds[key];

          const itemCoords = {
            latitude: item.coords.lat,
            longitude: item.coords.lng,
          };
          const curCoords = {
            latitude: coordinates[0],
            longitude: coordinates[1],
          };

          const distance = calculateDistance(itemCoords, curCoords);

          if (distance >= 200) {
            localStorage.removeItem(key);
          }
        });
      }
      fetchAd(position);
    }
  }, [coordinates, fetchAd]);

  useEffect(() => {
    const handlePositionUpdate = (position) => {
      const { latitude, longitude } = position.coords;
      // console.log(latitude,longitude)
      setCoordinates([latitude, longitude]);
    };

    const handleError = (error) => {
      console.error("Geolocation error:", error);
    };

    const watchId = navigator.geolocation.watchPosition(
      handlePositionUpdate,
      handleError,
      {
        enableHighAccuracy: true,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const value = {
    staticAds,
    activeAd,
    coordinates,
    setActiveAd,
    sendAnalytics,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
