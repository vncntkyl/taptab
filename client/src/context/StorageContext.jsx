import axios from "axios";
import { developmentRoutes as url } from "./Routes";

const getMedia = async () => {
  try {
    const response = await axios.get(url.storage, {
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

export const useStorage = () => {
  return {
    getMedia,
  };
};
