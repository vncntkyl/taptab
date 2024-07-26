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
  if (!link) return;

  const parts = link.split("/");
  const file = parts[parts.length - 1].split("?")[0];
  const imageFormats = ["jpeg", "jpg", "jfif", "png", "webp",'gif'];
  const videoFormats = ["mp4", "mov", "avi", "webm"];

  const format = file.split(".")[file.split(".").length - 1];
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
const recordLastStreamLogs = async (IDs) => {
  try {
    if (IDs.length > 0) {
      for (const _id of IDs) {
        let adData = [];
        if (localStorage.getItem(_id)) {
          adData = JSON.parse(localStorage.getItem(_id));
        }

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
      }
    }
  } catch (error) {
    console.error(error);
  }
};

function calculateDistance(coord1, coord2) {
  const toRadians = (degrees) => (degrees * Math.PI) / 180;

  const { latitude: lat1, longitude: lon1 } = coord1;
  const { latitude: lat2, longitude: lon2 } = coord2;

  const earthRadius = 6371000; // Earth's radius in meters

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = earthRadius * c;

  return distance;
}

function getAllLocalStorageItems() {
  let items = [];
  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    if (key === "shownAds" || key === "driver" || key.includes("geo-"))
      continue;
    let value = localStorage.getItem(key);
    try {
      value = JSON.parse(value);
      items.push({ key: key, value: value });
    } catch (e) {
      // console.log(`JSON'T: ${key}`);
    }
  }
  return items;
}

function getGeoStorageItems() {
  let items = {};
  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    if (!key.includes("geo-")) continue;
    let value = localStorage.getItem(key);
    try {
      value = JSON.parse(value);
      items[key] = value;
    } catch (e) {
      console.log(e);
    }
  }
  return items;
}

export const useVideos = () => {
  return {
    getFileURL,
    getPlaylist,
    getMedia,
    getPlannerData,
    getType,
    recordAdViews,
    recordLastStreamLogs,
    calculateDistance,
    getAllLocalStorageItems,
    getGeoStorageItems,
  };
};
