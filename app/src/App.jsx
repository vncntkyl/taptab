import { useState, useEffect } from "react";
import AdsPlayer from "./components/AdsPlayer";
import StaticsAds from "./components/StaticsAds";
import { useVideos } from "./functions/VideoFunctions";
import useData from "./hooks/useData";
import SurveyModal from "./components/SurveyModal";
import AccessForm from "./components/AccessForm";
import { useSurvey } from "./functions/EngagementFunctions";
import Widget from "./components/widgets/Widget";
import Popup from "./components/StaticAds/Popup";

function App() {
  // const [isFullScreen, toggleFullScreen] = useState(false);
  const { getMedia, getPlannerData } = useVideos();
  const { retrieveTabInfo, updateCurrentLocation } = useSurvey();
  const [media] = useData(getMedia, true);
  const [schedules] = useData(getPlannerData, true);
  const [coordinates, setCoordinates] = useState([null, null]);
  const [playingSchedule, setPlayingSchedule] = useState();
  const [relatedAds, setRelatedAds] = useState(null);
  const [viewAd, toggleAd] = useState(null);
  const [showSurvey, toggleSurvey] = useState({
    toggle: false,
    title: null,
  });

  function sendIncidentReportToDatabase(report) {
    console.log(alert);
  }

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

  useEffect(() => {
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
          // if (currentSchedule) console.log(currentSchedule);
          // const categories = [
          //   ...new Set(
          //     currentSchedule.playlist_media.map((media) =>
          //       media.category.toLowerCase()
          //     )
          //   ),
          // ];
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
                IDs.includes(item._id) && item.contentType.startsWith("image")
            )
          );
          // setRelatedAds(
          //   media.filter(
          //     (item) =>
          //       categories.includes(item.category.toLowerCase()) &&
          //       item.contentType.startsWith("image")
          //   )
          // );
        }
      };

      // Set an interval to update the playingSchedule periodically (e.g., every minute)
      const interval = setInterval(updatePlayingSchedule, 60000); // 60000 milliseconds = 1 minute

      // Initial update
      updatePlayingSchedule();

      // Clean up the interval when the component unmounts
      return () => clearInterval(interval);
    }
  }, [media, schedules]);
  useEffect(() => {
    const handleOnline = () => {
      const pendingIncidentReports =
        JSON.parse(localStorage.getItem("pendingIncidentReports")) || [];

      pendingIncidentReports.forEach((report) => {
        sendIncidentReportToDatabase(report);
      });

      localStorage.removeItem("pendingIncidentReports");
    };
    const handleOffline = () => {
      const incidentReport = {
        timestamp: new Date(),
        message: "Network connection lost",
        details: "Additional incident details",
      };

      // Store the incident report in local storage or an array
      const pendingIncidentReports =
        JSON.parse(localStorage.getItem("pendingIncidentReports")) || [];
      pendingIncidentReports.push(incidentReport);
      localStorage.setItem(
        "pendingIncidentReports",
        JSON.stringify(pendingIncidentReports)
      );
    };
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    async function successCallback(position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const driverDetails = await retrieveTabInfo();

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

      if (calculateDistance(newCoordinate, previousCoordinate) < 10) {
        console.log("The position has not changed.");
      } else {
        if (driverDetails === null) return;
        const { _id } = driverDetails;

        const newData = {
          _id: _id,
          long: longitude,
          lat: latitude,
        };
        // update the current location

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

  useEffect(() => {
    const preventContextMenu = (event) => {
      event.preventDefault();
    };

    document.addEventListener("contextmenu", preventContextMenu);

    return () => {
      document.removeEventListener("contextmenu", preventContextMenu);
    };
  }, []);
  // useEffect(() => {
  //   const ping = async () => {
  //     await checkConnection();
  //   };
  //   ping();
  // }, []);

  return (
    <div className="relative bg-gradient-to-br h-screen from-main to-[#c2c2c2] grid grid-cols-[8fr_2.3fr] grid-rows-[8fr_2.3fr] box-border gap-2 p-2">
      <AdsPlayer
        // isFullScreen={isFullScreen}
        // toggleFullScreen={toggleFullScreen}
        relatedAds={relatedAds}
        className="col-[1/2] row-[1/2]"
        showSurvey={toggleSurvey}
        playlist={playingSchedule ? playingSchedule.playlist_media : []}
        links={
          playingSchedule
            ? playingSchedule.playlist_media.map((med) => med._urlID)
            : []
        }
      />
      <StaticsAds className="col-[1/3] row-[2/3]" toggle={toggleAd} />
      <Widget />
      {/* <SurveyModal modal={showSurvey} setModal={toggleSurvey} /> */}
      <Popup viewAd={viewAd} toggleAd={toggleAd} />
      <AccessForm />
    </div>
  );
}

export default App;
