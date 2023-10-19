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

      const transaction = db.transaction(["players"], "readonly");
      const objectStore = transaction.objectStore("players");
      const getRequest = objectStore.get("data");

      getRequest.onsuccess = (event) => {
        const data = event.target.result;
        const result = JSON.parse(data.value);
        resolve(result);
      };

      getRequest.onerror = (event) => {
        reject("Error getting data: " + event.target.error);
      };
    };

    request.onerror = (event) => {
      reject("Database error: " + event.target.error);
    };
  });
};
export const useSurvey = () => {
  return {
    getSurveys,
    retrieveTabInfo,
  };
};
