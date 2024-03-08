import axios from "axios";
import { developmentRoutes as url } from "./Routes";

const retrieveQuickLinksValues = async () => {
  try {
    const response = await axios.get(url.widget, {
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

export const useWidget = () => {
  return {
    retrieveQuickLinksValues,
  };
};
