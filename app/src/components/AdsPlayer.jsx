import PropTypes from "prop-types";
import { Button, Progress } from "flowbite-react";
import { MdFullscreen, MdFullscreenExit, MdPause } from "react-icons/md";
import { iconButton } from "../functions/CustomThemes";
import classNames from "classnames";
import useData from "../hooks/useData";
import { useVideos } from "../functions/VideoFunctions";
import { MdPlayArrow } from "react-icons/md";
import { useEffect, useRef, useState } from "react";

function AdsPlayer({ isFullScreen, toggleFullScreen }) {
  const { getMedia, getFileURL } = useVideos();
  const [playlist] = useData(getMedia);
  const videoRef = useRef(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [duration, setDuration] = useState(0);

  const togglePlayPause = () => {
    setIsPlaying((current) => !current);

    if (videoRef.current.paused) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current != null) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  useEffect(() => {
    if (videoRef.current != null) {
      // Add an event listener for the 'timeupdate' event
      videoRef.current.addEventListener("timeupdate", handleTimeUpdate);
      setDuration(videoRef.current.duration);
    }

    // Cleanup the event listener when the component unmounts
    return () => {
      if (videoRef.current != null) {
        videoRef.current.removeEventListener("timeupdate", handleTimeUpdate);
      }
    };
  }, []);
  return (
    playlist.length > 0 && (
      <section
        className={classNames(
          "transition-all relative bg-matte-black rounded text-white w-full flex items-center justify-center",
          isFullScreen ? "h-[100%]" : "h-[65%]"
        )}
      >
        <div
          className={classNames(
            "relative transition-all bg-black aspect-video overflow-hidden",
            isFullScreen ? "max-w-full h-[72%]" : "max-w-[80%] h-full"
          )}
        >
          <video
            src={getFileURL(playlist[1]._urlID)}
            ref={videoRef}
            className="min-h-full min-w-full"
            autoPlay
          ></video>
        </div>
        <div
          id="controls"
          className="absolute bottom-0 w-full flex items-center justify-between"
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
                currentTime == 0
                  ? 0
                  : (currentTime / videoRef.current.duration) * 100
              }
            />
          </div>

          <div className="bg-white text-black">
            {console.log(currentTime, duration)}
          </div>
          <Button
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
          </Button>
        </div>
      </section>
    )
  );
}

AdsPlayer.propTypes = {
  isFullScreen: PropTypes.bool,
  toggleFullScreen: PropTypes.func,
};

export default AdsPlayer;
