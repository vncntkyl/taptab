import { useState, useEffect } from "react";
import AdsPlayer from "./components/AdsPlayer";
import RelatedAds from "./components/RelatedAds";
import StaticsAds from "./components/StaticsAds";
import { useVideos } from "./functions/VideoFunctions";
import useData from "./hooks/useData";
import SurveyModal from "./components/SurveyModal";
import AccessForm from "./components/AccessForm";

function App() {
  const [isFullScreen, toggleFullScreen] = useState(false);
  const { getMedia, getPlannerData } = useVideos();
  const [media] = useData(getMedia, true);
  const [schedules] = useData(getPlannerData, true);
  const [coordinates, setCoordinates] = useState([0, 0]);
  const [playingSchedule, setPlayingSchedule] = useState();
  const [relatedAds, setRelatedAds] = useState(null);
  const [showSurvey, toggleSurvey] = useState({
    toggle: false,
    title: null,
  });

  function sendIncidentReportToDatabase(report) {
    console.log(alert);
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
          const categories = [
            ...new Set(
              currentSchedule.playlist_media.map((media) =>
                media.category.toLowerCase()
              )
            ),
          ];
          setRelatedAds(
            media.filter(
              (item) =>
                categories.includes(item.category.toLowerCase()) &&
                item.contentType.startsWith("image")
            )
          );
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
    const updateLocation = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          setCoordinates([position.coords.latitude, position.coords.longitude]);
        });
      } else {
        setCoordinates([1, 2]);
      }
    };
    updateLocation();

    const realtimeData = setInterval(updateLocation, 1000);

    return () => {
      clearInterval(realtimeData);
    };
  }, []);

  return (
    <div className="relative bg-gradient-to-br from-main to-white w-screen max-h-screen flex flex-row gap-2 p-2 overflow-hidden">
      <section className="w-[75%] flex flex-col gap-2">
        <AdsPlayer
          isFullScreen={isFullScreen}
          toggleFullScreen={toggleFullScreen}
          showSurvey={toggleSurvey}
          links={
            playingSchedule
              ? playingSchedule.playlist_media.map((med) => med._urlID)
              : []
          }
        />
        <div>{coordinates[0] + ", " + coordinates[1]}</div>
        <RelatedAds isFullScreen={isFullScreen} ads={relatedAds} />
      </section>
      <section className="bg-default w-[25%] rounded p-2 overflow-hidden">
        <StaticsAds />
      </section>
      <SurveyModal modal={showSurvey} setModal={toggleSurvey} />
      <AccessForm />
    </div>
  );
}

export default App;
