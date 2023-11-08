import PropTypes from "prop-types";
import { Button, Progress } from "flowbite-react";
import {
  // MdFullscreen,
  // MdFullscreenExit,
  MdPause,
  MdPlayArrow,
  MdAnnouncement,
} from "react-icons/md";
import { iconButton } from "../functions/CustomThemes";
import classNames from "classnames";
// import useData from "../hooks/useData";
import { useVideos } from "../functions/VideoFunctions";
import { useEffect, useRef, useState } from "react";
import RelatedAds from "./RelatedAds/RelatedAds";
import SurveyForm from "./SurveyForm";
import { useSurvey } from "../functions/EngagementFunctions";
import useData from "../hooks/useData";

function AdsPlayer({
  /*isFullScreen, toggleFullScreen,*/ links,
  className,
  relatedAds,
  playlist,
}) {
  const { getFileURL, getType, recordAdViews } = useVideos();
  const { getSurveys } = useSurvey();
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [surveys] = useData(getSurveys);

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [duration, setDuration] = useState(0);
  const [isLastVideo, setIsLastVideo] = useState(false);
  const [xDown, setXDown] = useState(null);
  const [showRelatedAds, toggleRelatedAds] = useState(false);
  const [showSurvey, toggleSurvey] = useState(null);

  const togglePlayPause = () => {
    if (videoRef.current) {
      setIsPlaying((current) => !current);
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const setPlayingVideo = async (_id) => {
    if (!_id) return;

    const item = playlist.find((item) => item._id === _id);
    const previousItem = playlist[currentVideoIndex];
    const index = playlist.indexOf(item);

    if (getType(previousItem._urlID) === "image") {
      //increment usage by 1
      await recordAdViews(previousItem._id, 1);
    } else {
      const durationBeforeSwitching = currentTime;
      await recordAdViews(previousItem._id, durationBeforeSwitching);
    }
    setCurrentVideoIndex(index);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener("timeupdate", handleTimeUpdate);
      setDuration(videoRef.current.duration);
    }
    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener("timeupdate", handleTimeUpdate);
      }
    };
  }, [currentVideoIndex]);

  useEffect(() => {
    const videoElement = document.getElementById("video-player");
    const imagePlayer = document.getElementById("image-player");

    const handleVideoEnd = async () => {
      const item = playlist.find(
        (item) => item._urlID === links[currentVideoIndex]
      );
      //ichecheck yung survey array if yung play after ID dun is same sa ID ng nag end na video so if true, show survey else tuloy
      const survey = surveys.find((survey) => survey.play_after == item._id);

      if (survey) {
        toggleSurvey([
          {
            _id: survey._id,
            title: survey.title,
            description: survey.description,
          },
          ...survey.questions,
        ]);
      }

      if (item.type === "video") {
        await recordAdViews(item._id, item.videoDuration);
      } else {
        await recordAdViews(item._id, 1);
      }
      if (currentVideoIndex < links.length - 1) {
        setCurrentVideoIndex((prevIndex) => prevIndex + 1);
        setIsLoading(true);
        console.log("running");
      } else {
        setCurrentVideoIndex(0);
        setIsLoading(true);
        setIsLastVideo(true);
      }
    };
    if (videoElement) {
      const loadData = () => {
        setIsLoading(false);
      };

      videoElement.addEventListener("loadeddata", loadData);
      videoElement.addEventListener("ended", handleVideoEnd);

      return () => {
        videoElement.removeEventListener("loadeddata", loadData);
        videoElement.removeEventListener("ended", handleVideoEnd);
      };
    } else if (imagePlayer) {
      const timeout = setTimeout(handleVideoEnd, 10000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [currentVideoIndex, links]);

  const closeSurvey = () => {
    toggleSurvey(null);
  };
  useEffect(() => {
    const target = playerRef.current;
    if (!target) return;
    function handleTouchStart(evt) {
      const touchPosition = evt.touches[0].clientY;
      const touchScreen = evt.touches[0].screenY;
      const touchRatio = (touchPosition / touchScreen) * 100;
      if (touchRatio > 90) {
        setXDown(evt.touches[0].clientY);
      }
    }

    function handleTouchMove(evt) {
      if (!xDown) {
        return;
      }
      let xDiff = evt.touches[0].clientY - xDown;
      if (xDiff < 10) {
        toggleRelatedAds(true); // You might need to change this according to your logic
      } else {
        toggleRelatedAds(false);
      }
      setXDown(null);
    }
    target.addEventListener("touchstart", handleTouchStart);
    target.addEventListener("touchmove", handleTouchMove);
    return () => {
      target.removeEventListener("touchstart", handleTouchStart);
      target.removeEventListener("touchmove", handleTouchMove);
    };
  }, [xDown]);

  useEffect(() => {
    if (showSurvey) {
      const timeout = setTimeout(closeSurvey, 30000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [showSurvey]);
  return (
    <section
      ref={playerRef}
      className={classNames(
        "transition-all relative bg-[#000] rounded text-white w-full flex items-center justify-center group overflow-hidden",
        className
      )}
    >
      {links.length > 0 && (
        <>
          {showSurvey ? (
            <div className="bg-matte-black w-full h-full flex items-center justify-center p-4 transition-all">
              <SurveyForm setSurvey={toggleSurvey} survey={showSurvey} />
            </div>
          ) : (
            <>
              <div
                className={classNames(
                  "relative transition-all bg-[#000] aspect-video overflow-hidden",
                  /*isFullScreen ? "max-w-full h-[72%]" :*/ "max-w-[90%] h-full"
                )}
              >
                {getType(links[currentVideoIndex]) === "image" ? (
                  <img
                    id="image-player"
                    src={getFileURL(links[currentVideoIndex])}
                    className="w-full h-full"
                  />
                ) : (
                  <video
                    id="video-player"
                    src={getFileURL(links[currentVideoIndex])}
                    ref={videoRef}
                    className="h-full w-full"
                    autoPlay
                  ></video>
                )}
              </div>
              <div
                id="controls"
                className="absolute bottom-0 w-full animate-fade hidden group-hover:flex items-center justify-between"
              >
                <Button
                  color="transparent"
                  theme={iconButton}
                  className="focus:ring-0"
                  onClick={togglePlayPause}
                >
                  {isPlaying ? (
                    <MdPlayArrow className="text-4xl" />
                  ) : (
                    <MdPause className="text-4xl" />
                  )}
                </Button>
                <div className="w-full">
                  <Progress
                    size="md"
                    progress={
                      currentTime === 0
                        ? 0
                        : (currentTime / (duration || 1)) * 100 // Added a fallback to avoid division by zero
                    }
                  />
                </div>
                <div className="bg-white text-black">
                  {/* {console.log(currentTime, duration)} */}
                </div>
                {/* <Button
              color="transparent"
              theme={iconButton}
              onClick={() => toggleFullScreen((current) => !current)}
              className="focus:ring-0"
            >
              {isFullScreen ? (
                <MdFullscreenExit className="animate-fade text-4xl" />
              ) : (
                <MdFullscreen className="animate-fade text-4xl" />
              )}
            </Button> */}
              </div>
              <RelatedAds
                ads={relatedAds}
                show={showRelatedAds}
                setVideo={setPlayingVideo}
              />
            </>
          )}
        </>
      )}
    </section>
  );
}

AdsPlayer.propTypes = {
  isFullScreen: PropTypes.bool,
  toggleFullScreen: PropTypes.func,
  links: PropTypes.array,
  showSurvey: PropTypes.func,
  className: PropTypes.string,
  relatedAds: PropTypes.array,
  playlist: PropTypes.array,
};

export default AdsPlayer;
