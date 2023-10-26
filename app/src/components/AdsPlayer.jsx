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

function AdsPlayer({
  /*isFullScreen, toggleFullScreen,*/ links,
  showSurvey,
  className,
}) {
  const { getFileURL } = useVideos();
  const videoRef = useRef(null);

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [duration, setDuration] = useState(0);
  const [isLastVideo, setIsLastVideo] = useState(false);

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
  }, []);

  useEffect(() => {
    const videoElement = document.getElementById("video-player");

    if (videoElement) {
      const handleVideoEnd = () => {
        if (currentVideoIndex < links.length - 1) {
          setCurrentVideoIndex(currentVideoIndex + 1);
          setIsLoading(true);
        } else {
          setCurrentVideoIndex(0);
          setIsLoading(true);
          setIsLastVideo(true);
        }
      };

      const loadData = () => {
        setIsLoading(false);
      };

      videoElement.addEventListener("loadeddata", loadData);
      videoElement.addEventListener("ended", handleVideoEnd);

      return () => {
        videoElement.removeEventListener("loadeddata", loadData);
        videoElement.removeEventListener("ended", handleVideoEnd);
      };
    }
  }, [currentVideoIndex, links]);

  return (
    <section
      className={classNames(
        "transition-all relative bg-[#000] rounded text-white w-full flex items-center justify-center group",
        className
      )}
    >
      {links.length > 0 && (
        <>
          <div
            className={classNames(
              "relative transition-all bg-[#000] aspect-video overflow-hidden",
              /*isFullScreen ? "max-w-full h-[72%]" :*/ "max-w-[90%] h-full"
            )}
          >
            <video
              id="video-player"
              src={getFileURL(links[currentVideoIndex])}
              ref={videoRef}
              className="h-full w-full"
              autoPlay
            ></video>
          </div>
          {isLastVideo && (
            <Button
              color="transparent"
              theme={iconButton}
              className="absolute focus:ring-0 top-0 right-0 animate-pulse"
              onClick={() =>
                showSurvey({ toggle: true, title: "Quick Survey!" })
              }
            >
              <MdAnnouncement className="text-4xl" />
            </Button>
          )}
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
                  currentTime === 0 ? 0 : (currentTime / (duration || 1)) * 100 // Added a fallback to avoid division by zero
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
};

export default AdsPlayer;
