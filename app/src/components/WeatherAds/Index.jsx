import React, { useEffect, useState } from "react";
import { weatherFunctions } from "../../functions/WeatherFunctions";
import { Modal } from "flowbite-react";
import {
  addMinutes,
  differenceInMinutes,
  isBefore,
  parseISO,
  subHours,
} from "date-fns";

function WeatherAds() {
  const { retrieveWeatherForecast, retrieveWeatherAds } = weatherFunctions();
  const [coordinates, setCoordinates] = useState({
    latitude: null,
    longitude: null,
  });
  const [advertisement, setAdvertisement] = useState(null);

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
  function isAnHourAgo(givenTime) {
    // Parse the given time
    const givenDate = parseISO(givenTime);

    // Get the current time
    const currentTime = new Date();

    // Subtract an hour from the current time
    const oneHourAgo = subHours(currentTime, 1);

    // Check if the given time is before one hour ago
    return isBefore(givenDate, oneHourAgo);
  }

  useEffect(() => {
    // Use the Geolocation API to get the user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      });
    }
  }, []);

  useEffect(() => {
    // Call the retrieveWeatherForecast function when latitude and longitude are available
    const setup = async () => {
      if (coordinates.latitude !== null && coordinates.longitude !== null) {
        const response = await retrieveWeatherForecast(
          coordinates.latitude,
          coordinates.longitude
        );
        if (response) {
          const driver = localStorage.getItem("driver");
          if (driver) {
            console.log("tracking...");
            const condition = checkCondition(response.current.condition.text);
            const temperature = response.current.temp_c;
            const adList = await retrieveWeatherAds(condition, temperature);

            if (adList && adList.length !== 0) {
              let shownAds = localStorage.getItem("shownAds");
              shownAds = shownAds ? JSON.parse(shownAds) : [];

              for (const ad of adList) {
                const currentAd = shownAds.find(
                  (shown) => shown._id === ad._id
                );
                if (!currentAd || isAnHourAgo(currentAd.last_shown)) {
                  console.log("new ad found!");
                  setTimeout(() => {
                    setAdvertisement(ad);
                  }, 5000);
                  break;
                } else {
                  let date = new Date(currentAd.last_shown);
                  date = addMinutes(date, 60);

                  console.log("ad is already shown. please wait after an hour");
                  console.log(
                    differenceInMinutes(date, new Date()) +
                      " minutes remaining til next showtime"
                  );
                }
              }
            }
          }
        }
      }
    };
    setup();
    const interval = setInterval(setup, 60000);

    return () => {
      clearInterval(interval);
    };
  }, [
    coordinates.latitude,
    coordinates.longitude,
    retrieveWeatherAds,
    retrieveWeatherForecast,
  ]);

  useEffect(() => {
    const removeAd = () => {
      if (advertisement) {
        let shownAds = localStorage.getItem("shownAds");
        shownAds = shownAds ? JSON.parse(shownAds) : [];
        let newAd = {
          _id: advertisement._id,
          last_shown: new Date().toISOString(),
        };
        if (shownAds.length > 0) {
          const storedAd = shownAds.find((ad) => ad._id === advertisement._id);
          if (storedAd) {
            storedAd.last_shown = new Date().toISOString();
          }
        } else {
          shownAds.push(newAd);
        }
        console.log("advertisement removed");
        localStorage.setItem("shownAds", JSON.stringify(shownAds));
        setAdvertisement(null);
      }
    };

    const timeout = setTimeout(removeAd, 5000);

    return () => {
      clearTimeout(timeout);
    };
  }, [advertisement]);

  return (
    <Modal
      show={advertisement}
      theme={{
        content: {
          base: "relative h-full w-full p-2 outline-none md:h-auto",
          inner:
            "relative rounded-lg bg-transparent shadow dark:bg-gray-700 flex flex-col max-h-[90dvh]",
        },
      }}
    >
      <Modal.Body theme={{ base: "p-2 outline-none max-w-2xl mx-auto" }}>
        <div className="bg-white p-3 rounded-md animate-splash">
          {/* {console.log(advertisement)} */}
          <img className="rounded-md" src={advertisement?.signedUrl} alt="" />
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default WeatherAds;
