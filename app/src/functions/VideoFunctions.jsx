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
const getType = (link) => {
  if (link.includes("http")) {
    return "video";
  }
  const imageFormats = ["jpeg", "jpg", "jfif", "png", "webp"];
  const videoFormats = ["mp4", "mov", "avi", "webm"];

  const format = link.split(".")[link.split(".").length - 1];
  return imageFormats.includes(format)
    ? "image"
    : videoFormats
    ? "video"
    : null;
};

const recordAdViews = async (_id, data) => {
  try {
    let adData = [];
    if (localStorage.getItem(_id)) {
      adData = JSON.parse(localStorage.getItem(_id));
    }

    if (adData.length >= 10) {
      console.log("ID ready for insertion: ", _id);
      const response = await axios.patch(
        `${url.storage}analytics/${_id}`,
        { data: adData },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        console.log(response.data);
        localStorage.removeItem(_id);
      }
    } else {
      adData.push(data);
      localStorage.setItem(_id, JSON.stringify(adData));
    }
  } catch (error) {
    console.error(error);
  }
};
export const useVideos = () => {
  return {
    getFileURL,
    getPlaylist,
    getMedia,
    getPlannerData,
    getType,
    recordAdViews,
  };
};
