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

const retrieveTabInfo = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("accounts");

    request.onsuccess = (event) => {
      const db = event.target.result;

      if (db.objectStoreNames.contains("players")) {
        const transaction = db.transaction(["players"], "readonly");
        const objectStore = transaction.objectStore("players");
        const getRequest = objectStore.get("data");

        getRequest.onsuccess = (event) => {
          const data = event.target.result;
          if (data) {
            const result = JSON.parse(data.value);
            resolve(result);
          } else {
            reject("Data not found");
          }
        };

        getRequest.onerror = (event) => {
          reject("Error getting data: " + event.target.error);
        };
      }
    };

    request.onerror = (event) => {
      reject("Database error: " + event.target.error);
    };
  });
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

const checkConnection = async () => {
  try {
    const response = await axios.get(`${url.players}ping`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      const ID = response.data;
      const tabInfo = await retrieveTabInfo();

      if (tabInfo) {
        const validate = await axios.post(
          `${url.players}ping/${ID._id}`,
          tabInfo,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        ); // Assuming you want to log the data from the response
      }
    }
  } catch (error) {
    console.error(error);
  }
};

export const useSurvey = () => {
  return {
    getSurveys,
    retrieveTabInfo,
    updateCurrentLocation,
    checkConnection,
  };
};
