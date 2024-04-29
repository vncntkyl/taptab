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

const retrieveSettings = async () => {
  try {
    const response = await axios.get(url.config, {
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
const updateSettings = async (data, user_id) => {
  try {
    const response = await axios.patch(
      url.config,
      { ...data, updated_by: user_id, last_update: new Date().toISOString() },
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
export const useWidget = () => {
  return {
    retrieveQuickLinksValues,
    retrieveSettings,
    updateSettings,
  };
};
