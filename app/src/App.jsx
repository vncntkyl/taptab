import { useState, useEffect } from "react";
import AdsPlayer from "./components/AdsPlayer";
import StaticAds from "./components/StaticAds";
import { useVideos } from "./functions/VideoFunctions";
import useData from "./hooks/useData";
import AccessForm from "./components/AccessForm";
import { useSurvey } from "./functions/EngagementFunctions";
import Widget from "./components/widgets/Widget";
import { AppProvider } from "./contexts/AppContext";
function App() {
  const {
    getMedia,
    getPlannerData,
    recordLastStreamLogs,
    calculateDistance,
    getAllLocalStorageItems,
  } = useVideos();
  const {
    retrieveTabInfo,
    updateCurrentLocation,
    validateUser,
    checkConnection,
  } = useSurvey();

  const [media] = useData(getMedia, true);
  const [schedules] = useData(getPlannerData, true);
  const [coordinates, setCoordinates] = useState([null, null]);
  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const [relatedAds, setRelatedAds] = useState([]);

  const isSameSchedule = (first, second) => {
    if (!first || !second) return;

    return first.start === second.start && first.end === second.end;
  };
  useEffect(() => {
    const preventContextMenu = (event) => {
      event.preventDefault();
    };
    document.addEventListener("contextmenu", preventContextMenu);

    const setup = async () => {
      let driver = localStorage.getItem("driver");

      if (driver) {
        driver = JSON.parse(driver);

        const response = await validateUser(driver);
        // console.log(response);
        if (typeof response === "object") {
          localStorage.setItem("driver", JSON.stringify(response));
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
            const startDate = new Date(schedule.start);
            const endDate = new Date(schedule.end);
            return startDate <= currentTime && currentTime <= endDate;
          });
          if (currentSchedule) {
            if (currentPlaylist) {
              if (!isSameSchedule(currentPlaylist, currentSchedule)) {
                setCurrentPlaylist(currentSchedule);

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
              }
            } else {
              setCurrentPlaylist(currentSchedule);

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
            }
          } else {
            setCurrentPlaylist(null);
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
    const upload = async (IDs) => {
      await recordLastStreamLogs(IDs);
    };

    const setup = async () => {
      if (!currentPlaylist) return;

      const currentPlayingAds = currentPlaylist.playlist_media.map(
        ({ _id }) => _id
      );
      const storedMediaIDs = getAllLocalStorageItems()
        .filter(({ key }) => !currentPlayingAds.includes(key))
        .map(({ key }) => key);

      if (storedMediaIDs.length > 0) {
        await upload(storedMediaIDs);
      }
    };

    setup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPlaylist]);

  useEffect(() => {
    const handleOnline = async () => {
      let driver = localStorage.getItem("driver");

      if (driver) {
        driver = JSON.parse(driver);

        const response = await validateUser(driver);
        if (typeof response === "object") {
          await checkConnection(driver._id);
        }
      }
    };
    handleOnline();

    const realtimeData = setInterval(handleOnline, 600000); //every 10 mins

    return () => clearInterval(realtimeData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      const currentDistance = calculateDistance(
        newCoordinate,
        previousCoordinate
      );
      if (currentDistance > 10) {
        if (driverDetails === null) return;
        const { _id } = driverDetails;

        const newData = {
          _id: _id,
          long: longitude,
          lat: latitude,
        };
        await updateCurrentLocation(newData);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coordinates]);

  return (
    <>
      <AccessForm />
      <AppProvider>
        <div className="relative bg-gradient-to-br h-screen from-main to-[#c2c2c2] grid grid-cols-[8fr_3fr] grid-rows-[8fr_3fr] box-border gap-2 p-2">
          <AdsPlayer
            relatedAds={relatedAds}
            className="col-[1/2] row-[1/2]"
            playlist={(currentPlaylist && currentPlaylist.playlist_media) || []}
            links={
              currentPlaylist
                ? currentPlaylist.playlist_media.map((med) =>
                    med.signedUrl ? med.signedUrl : med.link
                  )
                : []
            }
          />
          <StaticAds className="col-[1/3] row-[2/3]" />
          <Widget />
          <p className="absolute bottom-0 bg-[#0000006c] text-xs px-2 text-white z-30">
            Version 1.5
          </p>
        </div>
      </AppProvider>
    </>
  );
}

export default App;
