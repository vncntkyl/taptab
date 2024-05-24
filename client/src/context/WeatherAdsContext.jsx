import axios from "axios";
import { developmentRoutes as url } from "./Routes";
const defaultInformation = {
  name: "",
  trigger_temperature: "",
  trigger_unit: "C",
  weather: "sunny",
  runtime_date: { from: new Date(), to: new Date() },
  image: null,
  file: null,
};
const getWeatherAds = async () => {
  try {
    const response = await axios.get(url.weather, {
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
const getSingleWeatherAd = async (id) => {
  try {
    const response = await axios.get(url.weather + id, {
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
const addWeatherAd = async (data, file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("data", JSON.stringify(data));

    const response = await axios.post(url.weather, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(response);
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error(error);
  }
};
const updateWeatherAd = async (id, data, file = null) => {
  try {
    const formData = new FormData();
    if (file) {
      formData.append("file", file);
    }
    formData.append("data", JSON.stringify(data));

    const response = await axios.put(url.weather + id, formData, {
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
const deleteWeatherAd = async (id) => {
  try {
    const response = await axios.delete(url.weather + id, {
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

// const getStaticAdInformation = async (id) => {
//   try {
//     const response = await axios.get(url.staticAds + id, {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//     if (response.status === 200) {
//       return response.data;
//     }
//   } catch (error) {
//     console.error(error);
//   }
// };
// const getGeoAd = async (id) => {
//   try {
//     const response = await axios.get(geoTaggedAdsUrl + id, {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//     if (response.status === 200) {
//       return response.data;
//     }
//   } catch (error) {
//     console.error(error);
//   }
// };
// const createGeoTaggedAds = async (data) => {
//   try {
//     const formData = new FormData();
//     formData.append("file", data.file);
//     delete data.file;
//     formData.append("data", JSON.stringify(data));

//     const response = await axios.post(geoTaggedAdsUrl, formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });

//     if (response.status === 200) {
//       return response.data;
//     }
//   } catch (error) {
//     console.error(error);
//   }
// };
// const createStaticAds = async (adImage, adData) => {
//   try {
//     const formData = new FormData();
//     formData.append("file", adImage);
//     formData.append("adData", JSON.stringify(adData));

//     const response = await axios.post(url.staticAdsCreation, formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });

//     if (response.status === 200) {
//       return response.data;
//     }
//   } catch (error) {
//     console.error(error);
//   }
// };
// const updateStaticAd = async (adData) => {
//   try {
//     const formData = new FormData();
//     if (adData.imageFile) {
//       formData.append("file", adData.imageFile);
//       delete adData.imageFile;
//     }
//     formData.append("adData", JSON.stringify(adData));

//     const response = await axios.patch(url.staticAds + adData._id, formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });

//     if (response.status === 200) {
//       return response.data;
//     }
//   } catch (error) {
//     console.error(error);
//   }
// };
// const deleteStaticAd = async (_id) => {
//   try {
//     const response = await axios.delete(url.staticAds + _id, {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//     if (response.status === 200) {
//       return response.data;
//     }
//   } catch (error) {
//     console.error(error);
//   }
// };
export const useWeather = () => {
  return {
    getWeatherAds,
    getSingleWeatherAd,
    addWeatherAd,
    updateWeatherAd,
    deleteWeatherAd,
    defaultInformation,
  };
};
