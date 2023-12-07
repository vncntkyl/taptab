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

const submitSurvey = async (_id, data) => {
  try {
    const response = await axios.post(
      link + "app",
      { _id: _id, data: data },
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

const updateCurrentLocation = async (data) => {
  try {
    const response = await axios.post(`${url.players}log/${data._id}`, data, {
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

const checkConnection = async (id) => {
  try {
    const response = await axios.get(`${url.players}ping/${id}`, {
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
const retrieveTabInfo = async () => {
  let driver = localStorage.getItem("driver");

  if (driver) {
    driver = JSON.parse(driver);
    return driver;
  }
};
const loginTaptab = async (data) => {
  try {
    const response = await axios.post(
      url.players + "login",
      {
        key: data.accessCode,
        ip: data.IP,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200) {
      return response.data;
    }
  } catch (e) {
    console.log(e);
  }
};
const validateUser = async (driver) => {
  try {
    const response = await axios.get(`${url.players}taptab/${driver._id}`, {
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
const getIP = async () => {
  try {
    const response = await axios.get(`${url.players}get-ip`, {
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
    submitSurvey,
    retrieveTabInfo,
    updateCurrentLocation,
    checkConnection,
    validateUser,
    loginTaptab,
    getIP,
  };
};
