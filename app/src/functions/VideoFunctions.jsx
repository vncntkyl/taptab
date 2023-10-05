import axios from "axios";
import { developmentRoutes as url } from "./Routes";

const getPlaylist = async () => {
  try {
    const response = await axios.get(url.storage + "playlist", {
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

const getFileURL = (objectName) => {
  return `https://storage.googleapis.com/tamc_advertisements/${objectName}`;
};
export const useVideos = () => {
  return {
    getFileURL,
    getPlaylist,
    getMedia,
    getPlannerData,
  };
};
