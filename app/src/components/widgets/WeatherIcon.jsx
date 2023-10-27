import {
  clearSunny,
  fullMoonFewClouds,
  fullMoonRaining,
  patchyRain,
  raining,
  sunny,
  sunnyWithModClouds,
} from "../../assets";
import PropTypes from "prop-types";

function WeatherIcon({ current, className }) {
  let imageSrc = sunny;
  const condition = current.condition.text.toLowerCase();
  if (current.is_day) {
    if (current.is_day === 1) {
      switch (condition) {
        case "patchy rain possible":
          imageSrc = patchyRain;
          break;
        case "partly cloudy":
          imageSrc = sunnyWithModClouds;
          break;
        case "moderate rain":
          imageSrc = raining;
          break;
        case "clear":
          imageSrc = clearSunny;
          break;
      }
    } else {
      switch (condition) {
        case "patchy rain possible":
          imageSrc = fullMoonRaining;
          break;
        case "partly cloudy":
          imageSrc = fullMoonFewClouds;
          break;
      }
    }
  } else {
    switch (condition) {
      case "patchy rain possible":
        imageSrc = patchyRain;
        break;
      case "partly cloudy":
        imageSrc = sunnyWithModClouds;
        break;
      case "moderate rain":
        imageSrc = raining;
        break;
    }
  }
  return <img src={imageSrc} className={className} />;
}
WeatherIcon.propTypes = {
  current: PropTypes.object,
  className: PropTypes.string,
};

export default WeatherIcon;
