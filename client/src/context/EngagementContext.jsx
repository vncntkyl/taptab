import axios from "axios";
import { developmentRoutes as url } from "./Routes";

const retrieveEngagements = async () => {
  try {
    const response = await axios.get(url.engagements, {
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
const uploadSurvey = async (data) => {
  try {
    const response = await axios.post(url.engagements, data, {
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
const updateSurvey = async (data) => {
  try {
    const response = await axios.patch(url.engagements + data._id, data, {
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
const deleteSurvey = async (_id) => {
  try {
    const response = await axios.delete(url.engagements + _id, {
      headers: {
        "Content-Type": "*",
      },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error(error);
  }
};
export const useEngagements = () => {
  return {
    uploadSurvey,
    updateSurvey,
    deleteSurvey,
    retrieveEngagements,
  };
};
