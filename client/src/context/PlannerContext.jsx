import axios from "axios";
import { developmentRoutes as url } from "./Routes";

const getPlannerData = async () => {
  try {
    const response = await axios.get(url.planner, {
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
const getOnePlannerData = async (id) => {
  try {
    const response = await axios.get(url.planner + id, {
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

const addSchedule = async (data) => {
  try {
    const response = await axios.post(url.planner + "add", data, {
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

export const usePlanner = () => {
  return {
    getOnePlannerData,
    getPlannerData,
    addSchedule,
  };
};
