import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { format } from "date-fns";
import { weatherFunctions } from "../../functions/WeatherFunctions";

import classNames from "classnames";
import { TbWind, TbDroplets } from "react-icons/tb";
import { BsCloudRain } from "react-icons/bs";
import WeatherIcon from "./WeatherIcon";

function WeatherForecast() {
  const { retrieveWeatherForecast } = weatherFunctions();
  const [coordinates, setCoordinates] = useState({
    latitude: null,
    longitude: null,
  });
  const [forecast, setForecast] = useState([]);
  const [tempUnit, setTempUnit] = useState("C");

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
        setForecast(response);
      }
    };
    setup();

    const realtimeData = setInterval(setup, 360000);

    return () => {
      clearInterval(realtimeData);
    };
  }, [coordinates.latitude, coordinates.longitude, retrieveWeatherForecast]);

  return (
    forecast &&
    (forecast.length !== 0 ? (
      <div
        className={classNames(
          "bg-gradient-to-br  rounded-md p-4 flex flex-col gap-3 transition-all h-full",
          forecast.current.is_day
            ? "from-[#87ceeb] to-[#ffe2bc]"
            : "from-secondary-dark to-[#330091]"
        )}
      >
        <p className="text-white flex justify-between">
          <span>
            {format(new Date(forecast.location.localtime), "MMM dd, yyyy")}
          </span>
          <span>{`${forecast.location.name}, ${forecast.location.country}`}</span>
        </p>
        <div className="flex items-center justify-start gap-2 pb-2">
          <WeatherIcon
            current={forecast.current}
            className="w-[40%] object-fit"
          />
          <div className="flex flex-col text-white">
            <div className="flex gap-2 items-start">
              <p className="text-white text-5xl font-bold">
                {tempUnit === "C"
                  ? forecast.current.temp_c
                  : forecast.current.temp_f}
              </p>
              <div className="flex gap-2 items-start justify-center text-white">
                <button
                  type="button"
                  onClick={() => setTempUnit("C")}
                  className={classNames(
                    "text-lg",
                    tempUnit === "C" && "font-bold"
                  )}
                >
                  &deg;C
                </button>
                <span>|</span>
                <button
                  type="button"
                  onClick={() => setTempUnit("F")}
                  className={classNames(
                    "text-lg",
                    tempUnit === "F" && "font-bold"
                  )}
                >
                  &deg;F
                </button>
              </div>
            </div>
            <span>{forecast.current.condition.text}</span>
            <div className="flex items-center gap-2">
              <WeatherDetails
                icon={<TbWind />}
                text={`${forecast.current.wind_mph}m/h`}
              />
              <WeatherDetails
                icon={<BsCloudRain />}
                text={`${forecast.current.precip_in}"`}
              />
              <WeatherDetails
                icon={<TbDroplets />}
                text={`${forecast.current.humidity}%`}
              />
            </div>
          </div>
        </div>
        {/* <hr className="bg-white border" />
      <WeeklyForecast weatherForecast={forecast} tempUnit={tempUnit} /> */}
        {/* <pre>{JSON.stringify(forecast, null, 2)}</pre> */}
      </div>
    ) : (
      <div className="bg-gradient-to-br from-[#87ceeb] to-[#ffe2bc] w-full h-full rounded-md p-4 flex flex-col gap-3 transition-all">
        Loading...
      </div>
    ))
  );
}

function WeatherDetails({ icon, text }) {
  return (
    <div className="flex items-center gap-0.5">
      {icon}
      <span>{text}</span>
    </div>
  );
}
WeatherDetails.propTypes = {
  icon: PropTypes.node,
  text: PropTypes.string,
};

function WeeklyForecast({ weatherForecast, tempUnit }) {
  const forecastData = weatherForecast.forecast.forecastday;
  return (
    forecastData && (
      <div className="grid grid-cols-7 gap-4">
        {forecastData.map((forecastDay, index) => {
          return (
            index !== 0 && (
              <div
                key={index}
                className={classNames(
                  "grid grid-rows-[1fr_0.25fr_0.25fr] gap-0.5 items-center text-xs text-center",
                  weatherForecast.current.is_day ? "text-black" : "text-white"
                )}
              >
                <WeatherIcon current={forecastDay.day} className="" />
                <span>
                  {tempUnit === "C"
                    ? forecastDay.day.avgtemp_c
                    : forecastDay.day.avgtemp_f}
                  &deg;
                </span>
                <span>{format(new Date(forecastDay.date), "E")}</span>
              </div>
            )
          );
        })}
      </div>
    )
  );
}
WeeklyForecast.propTypes = {
  weatherForecast: PropTypes.object,
  tempUnit: PropTypes.string,
};
export default WeatherForecast;
