import axios from "axios";
import { developmentRoutes as url } from "./Routes";

const geoTaggedAdsUrl = url.storage + "/geolocation";
const getStaticAds = async () => {
  try {
    const response = await axios.get(url.staticAds, {
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
const getGeoAds = async () => {
  try {
    const response = await axios.get(geoTaggedAdsUrl, {
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
const getStaticAdInformation = async (id) => {
  try {
    const response = await axios.get(url.staticAds + id, {
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
const getGeoAd = async (id) => {
  try {
    const response = await axios.get(geoTaggedAdsUrl + id, {
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
const createStaticAds = async (adImage, adData) => {
  try {
    const formData = new FormData();
    formData.append("file", adImage);
    formData.append("adData", JSON.stringify(adData));

    const response = await axios.post(url.staticAdsCreation, formData, {
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
const updateStaticAd = async (adData) => {
  try {
    const formData = new FormData();
    if (adData.imageFile) {
      formData.append("file", adData.imageFile);
      delete adData.imageFile;
    }
    formData.append("adData", JSON.stringify(adData));

    const response = await axios.patch(url.staticAds + adData._id, formData, {
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
const deleteStaticAd = async (_id) => {
  try {
    const response = await axios.delete(url.staticAds + _id, {
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
export const useStaticAds = () => {
  return {
    getStaticAds,
    getStaticAdInformation,
    createStaticAds,
    updateStaticAd,
    deleteStaticAd,
    getGeoAd,
    getGeoAds,
  };
};
