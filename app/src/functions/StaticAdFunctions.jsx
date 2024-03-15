import axios from "axios";
import { developmentRoutes as url } from "./Routes";

const geoURL = url.storage + "geolocation/";

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

const getGeoTaggedAd = async (coordinates) => {
  try {
    const response = await axios.post(
      geoURL + "check-coordinates",
      coordinates,
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

const updateStaticAdsAnalytics = async (data) => {
  const log = {
    action: "viewed",
    date: new Date(new Date().toISOString()).toISOString(),
  };
  const link = url.staticAds + "analytics/" + data._id;
  try {
    const response = await axios.put(link, log, {
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
    getGeoTaggedAd,
    updateStaticAdsAnalytics,
  };
};
