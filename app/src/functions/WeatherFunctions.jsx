import axios from "axios";

const retrieveWeatherForecast = async (lat, long) => {
  const weatherAPIKey = "bf92f5dd8b44463abb225737232610";
  const APILink = "https://api.weatherapi.com/v1/forecast.json";

  try {
    const response = await axios.get(
      `${APILink}?key=${weatherAPIKey}&q=${lat},${long}&days=7&hour=0`,
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

export const weatherFunctions = () => {
  return { retrieveWeatherForecast };
};
