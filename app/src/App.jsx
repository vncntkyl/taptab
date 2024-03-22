import { useState, useEffect } from "react";
import AdsPlayer from "./components/AdsPlayer";
import StaticsAds from "./components/StaticsAds";
import { useVideos } from "./functions/VideoFunctions";
import useData from "./hooks/useData";
import AccessForm from "./components/AccessForm";
import { useSurvey } from "./functions/EngagementFunctions";
import Widget from "./components/widgets/Widget";
import Popup from "./components/StaticAds/Popup";
import ArticlePopup from "./components/ArticlePopup";
import GeoTaggedAds from "./components/GeoTaggedAds/Index";
import Cookies from "js-cookie";

function App() {
  const { getMedia, getPlannerData } = useVideos();
  const {
    retrieveTabInfo,
    updateCurrentLocation,
    validateUser,
    checkConnection,
  } = useSurvey();
  const [media] = useData(getMedia, true);
  const [schedules] = useData(getPlannerData, true);
  const [coordinates, setCoordinates] = useState([null, null]);
  const [playingSchedule, setPlayingSchedule] = useState();
  const [relatedAds, setRelatedAds] = useState(null);
  const [viewAd, toggleAd] = useState(null);
  const [showArticle, toggleArticle] = useState(null);
  const [newLogin, setNewLogin] = useState(true);

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

  function closeArticle() {
    toggleArticle(null);
  }
  useEffect(() => {
    const preventContextMenu = (event) => {
      event.preventDefault();
    };
    document.addEventListener("contextmenu", preventContextMenu);

    const setup = async () => {
      let driver = Cookies.get("driver");

      if (driver) {
        driver = JSON.parse(driver);

        const response = await validateUser(driver);
        // console.log(response);
        if (typeof response === "object") {
          setNewLogin(false);
          Cookies.set("driver", JSON.stringify(response));
        }
      }
    };
    setup();

    return () => {
      document.removeEventListener("contextmenu", preventContextMenu);
    };
  }, [validateUser]);

  useEffect(() => {
    if (media && schedules) {
      if (media.length > 0 && schedules.length > 0) {
        const planner = schedules.map((schedule) => {
          const mediaItems = schedule.playlist_media;
          const mediaDetails = mediaItems.map((item) => {
            return {
              ...media.find((med) => med._id == item),
            };
          });
          return {
            ...schedule,
            playlist_media: [...mediaDetails],
          };
        });

        const updatePlayingSchedule = () => {
          const currentTime = new Date();
          const currentSchedule = planner.find((schedule) => {
            const startDate = new Date(schedule.start_date);
            const endDate = new Date(schedule.end_date);
            return startDate <= currentTime && currentTime <= endDate;
          });
          if (currentSchedule) {
            setPlayingSchedule(currentSchedule);

            const IDs = [
              ...new Set(
                currentSchedule.playlist_media.map((media) => {
                  return media._id;
                })
              ),
            ];
            setRelatedAds(
              media.filter(
                (item) =>
                  IDs.includes(item._id) &&
                  item.type !== "link" &&
                  item.contentType.startsWith("image")
              )
            );
          } else {
            setPlayingSchedule(null);
          }
        };

        // Initial update
        updatePlayingSchedule();

        // Set an interval to update the playingSchedule periodically (e.g., every minute)
        const interval = setInterval(updatePlayingSchedule, 60000); // 60000 milliseconds = 1 minute

        // Clean up the interval when the component unmounts
        return () => clearInterval(interval);
      }
    }
  }, [media, schedules]);
  useEffect(() => {
    const handleOnline = async () => {
      let driver = localStorage.getItem("driver");

      if (driver) {
        driver = JSON.parse(driver);

        const response = await validateUser(driver);
        if (typeof response === "object") {
          const logConnection = await checkConnection(driver._id);
          console.log(logConnection);
        }
      }
    };
    const realtimeData = setInterval(handleOnline, 600000);

    return () => clearInterval(realtimeData);
  }, []);

  useEffect(() => {
    async function successCallback(position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const driverDetails = await retrieveTabInfo();
      if (!driverDetails) return;
      const newCoordinate = {
        latitude: latitude,
        longitude: longitude,
      };
      const previousCoordinate = {
        latitude: coordinates[0],
        longitude: coordinates[1],
      };

      if (Object.values(previousCoordinate).every((val) => val === null)) {
        setCoordinates([latitude, longitude]);
        return;
      }

      if (calculateDistance(newCoordinate, previousCoordinate) > 10) {
        if (driverDetails === null) return;
        const { _id } = driverDetails;

        const newData = {
          _id: _id,
          long: longitude,
          lat: latitude,
        };
        const response = await updateCurrentLocation(newData);
        console.log(response);
        console.log("Position has changed.");
        setCoordinates([latitude, longitude]);
      }
    }

    function errorCallback(error) {
      console.error("Error getting location:", error.message);
    }

    const options = {
      enableHighAccuracy: true,
    };

    const watchId = navigator.geolocation.watchPosition(
      successCallback,
      errorCallback,
      options
    );
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [coordinates]);

  return (
    <>
      <AccessForm setLogin={setNewLogin} />
      <div className="relative bg-gradient-to-br h-screen from-main to-[#c2c2c2] grid grid-cols-[8fr_3fr] grid-rows-[8fr_2.4fr] box-border gap-2 p-2">
        <GeoTaggedAds coords={coordinates} />
        <AdsPlayer
          relatedAds={relatedAds}
          className="col-[1/2] row-[1/2]"
          playlist={playingSchedule ? playingSchedule.playlist_media : []}
          links={
            playingSchedule
              ? playingSchedule.playlist_media.map((med) =>
                  med._urlID ? med._urlID : med.link
                )
              : []
          }
        />
        <StaticsAds className="col-[1/3] row-[2/3]" toggle={toggleAd} />
        <Widget setArticle={toggleArticle} />
        <Popup viewAd={viewAd} toggleAd={toggleAd} />
        <ArticlePopup article={showArticle} closeArticle={closeArticle} />
        <p className="absolute bottom-0 bg-[#0000006c] text-xs px-2 text-white z-30">
          Version 1.4.3
        </p>
      </div>
    </>
  );
}

export default App;
