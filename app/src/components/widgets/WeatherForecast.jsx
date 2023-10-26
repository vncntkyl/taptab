import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { format } from "date-fns";
import { weatherFunctions } from "../../functions/WeatherFunctions";
import {
  fullMoonFewClouds,
  patchyRain,
  sunnyWithModClouds,
} from "../../assets";
import classNames from "classnames";
import { TbWind, TbDroplets } from "react-icons/tb";
import { BsCloudRain } from "react-icons/bs";

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
  }, [coordinates.latitude, coordinates.longitude, retrieveWeatherForecast]);

  return (
    forecast.length !== 0 && (
      <div
        className={classNames(
          "bg-gradient-to-br  rounded-md p-4 flex flex-col gap-3 transition-all",
          forecast.current.is_day
            ? "from-main-light to-[#cacaca]"
            : "from-secondary-dark to-main"
        )}
      >
        <p className="text-white flex justify-between">
          <span>
            {format(new Date(forecast.location.localtime), "MMM dd, yyyy")}
          </span>
          <span>{`${forecast.location.name}, ${forecast.location.country}`}</span>
        </p>
        <div className="flex gap-2">
          <WeatherIcon current={forecast.current} className="w-[40%]" />
          <div className="flex flex-col text-white">
            <div className="flex gap-2 items-start">
              <p className="text-white text-6xl font-bold">
                {tempUnit === "C"
                  ? forecast.current.temp_c
                  : forecast.current.temp_f}
              </p>
              <div className="flex gap-2 items-start justify-center text-white">
                <button
                  type="button"
                  onClick={() => setTempUnit("C")}
                  className={tempUnit === "C" && "font-bold"}
                >
                  &deg;C
                </button>
                <span>|</span>
                <button
                  type="button"
                  onClick={() => setTempUnit("F")}
                  className={tempUnit === "F" && "font-bold"}
                >
                  &deg;F
                </button>
              </div>
            </div>
            <span>{forecast.current.condition.text}</span>
            <div className="flex items-center gap-1">
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
        {/* <hr className="bg-white border"/>
        <div>
            weekly forecast here
        </div> */}
        {/* <pre>{JSON.stringify(forecast, null, 2)}</pre> */}
      </div>
    )
  );
}

const WeatherIcon = ({ current, className }) => {
  if (current.is_day === 1) {
    switch (current.condition.text.toLowerCase()) {
      case "patchy rain possible":
        return <img src={patchyRain} className={className} />;
      case "partly cloudy":
        return <img src={sunnyWithModClouds} className={className} />;
    }
  } else {
    switch (current.condition.text.toLowerCase()) {
      case "patchy rain possible":
        return <img src={patchyRain} className={className} />;
      case "partly cloudy":
        return <img src={fullMoonFewClouds} className={className} />;
    }
  }
};
WeatherIcon.propTypes = {
  current: PropTypes.object,
  className: PropTypes.string,
};
const WeatherDetails = ({ icon, text }) => {
  return (
    <div className="flex items-center gap-0.5">
      {icon}
      <span>{text}</span>
    </div>
  );
};
WeatherDetails.propTypes = {
  icon: PropTypes.node,
  text: PropTypes.string,
};
export default WeatherForecast;
