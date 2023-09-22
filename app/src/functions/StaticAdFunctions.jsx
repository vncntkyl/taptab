import axios from "axios";
import { developmentRoutes as url } from "./Routes";

const getStaticAds = async () => {
  try {
    const response = await axios.get(url.staticAds, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error(error);
  }
};
export const useStaticAds = () => {
  return {
    getStaticAds,
  };
};
