import axios from "axios";
import { developmentRoutes as url } from "./Routes";

const link = url.engagements;
const getSurveys = async () => {
  try {
    const response = await axios.get(link, {
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
export const useSurvey = () => {
  return {
    getSurveys,
  };
};