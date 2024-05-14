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
const getPlaylistNames = async () => {
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
const uploadMedia = async (files, mediaData) => {
  try {
    const formData = new FormData();
    if (files) {
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }
    }
    formData.append("mediaData", JSON.stringify(mediaData));

    const response = await axios.post(url.uploadMedia, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error(error);
  }
};

const updateMedia = async (files, mediaData) => {
  try {
    const formData = new FormData();
    if (files) {
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }
    }
    formData.append("mediaData", JSON.stringify(mediaData));

    const response = await axios.put(
      url.uploadMedia + `/${mediaData._id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
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

const uploadPlaylist = async (data) => {
  try {
    const response = await axios.post(url.storage + "playlist/upload", data, {
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

const updatePlaylist = async (data) => {
  try {
    const playlistID = data._id;
    delete data._id;
    const response = await axios.patch(
      url.storage + `playlist/${playlistID}`,
      data
    );

    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error(error);
  }
};

const deleteMediaItem = async (data) => {
  try {
    const mediaID = data._id;
    delete data._id;
    const response = await axios.patch(url.storage + mediaID, data);

    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error(error);
  }
};
const getAnalytics = async () => {
  try {
    const response = await axios.get(url.storage + "analytics", {
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

const getMediaInformation = async (id) => {
  try {
    const response = await axios.get(`${url.storage}media/${id}`, {
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
    getPlaylist,
    getAnalytics,
    uploadMedia,
    updateMedia,
    uploadPlaylist,
    updatePlaylist,
    deleteMediaItem,
    getPlaylistNames,
    getMediaInformation,
  };
};
