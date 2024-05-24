import axios from "axios";
import { developmentRoutes as url } from "./Routes";

const retrieveWeatherForecast = async (lat, long) => {
  const weatherAPIKey = "bf92f5dd8b44463abb225737232610";
  const APILink = "https://api.weatherapi.com/v1/forecast.json";

  try {
    const response = await axios.get(
      `${APILink}?key=${weatherAPIKey}&q=${lat},${long}&days=8&hour=0`,
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

const retrieveWeatherAds = async (weather, temp) => {
  try {
    const response = await axios.get(url.weather, {
      params: {
        weather: weather,
        temperature: temp,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (e) {
    console.log(e);
  }
};
export const weatherFunctions = () => {
  return { retrieveWeatherForecast, retrieveWeatherAds };
};
