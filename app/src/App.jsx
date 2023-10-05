import { useState, useEffect } from "react";
import AdsPlayer from "./components/AdsPlayer";
import RelatedAds from "./components/RelatedAds";
import StaticsAds from "./components/StaticsAds";
import { useVideos } from "./functions/VideoFunctions";
import useData from "./hooks/useData";
import SurveyModal from "./components/SurveyModal";

function App() {
  const [isFullScreen, toggleFullScreen] = useState(false);
  const { getMedia, getPlannerData } = useVideos();
  const [media] = useData(getMedia, true);
  const [schedules] = useData(getPlannerData, true);
  const [playingSchedule, setPlayingSchedule] = useState();
  const [showSurvey, toggleSurvey] = useState({
    toggle: false,
    title: null,
  });

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
        console.log("checking...");
        const currentTime = new Date();
        const currentSchedule = planner.find((schedule) => {
          const startDate = new Date(schedule.start_date);
          const endDate = new Date(schedule.end_date);
          return startDate <= currentTime && currentTime <= endDate;
        });
        setPlayingSchedule(currentSchedule);
      };

      // Set an interval to update the playingSchedule periodically (e.g., every minute)
      const interval = setInterval(updatePlayingSchedule, 60000); // 60000 milliseconds = 1 minute

      // Initial update
      updatePlayingSchedule();

      // Clean up the interval when the component unmounts
      return () => clearInterval(interval);
    }
  }, [media, schedules]);

  return (
    <div className="relative bg-gradient-to-br from-main to-white w-screen max-h-screen flex flex-row gap-2 p-2 overflow-hidden">
      <section className="w-[1550px] flex flex-col gap-2">
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

        <RelatedAds isFullScreen={isFullScreen} />
      </section>
      <section className="bg-default w-[450px] rounded p-2">
        <StaticsAds />
      </section>
      <SurveyModal modal={showSurvey} setModal={toggleSurvey} />
    </div>
  );
}

export default App;
