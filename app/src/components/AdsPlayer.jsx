import PropTypes from "prop-types";
import { Button } from "flowbite-react";
import {
  // MdFullscreen,
  // MdFullscreenExit,
  MdPause,
  MdPlayArrow,
  MdSkipNext,
  MdSkipPrevious,
  // MdAnnouncement,
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
import Counter from "./Counter";
import Countdown from "./Countdown";
import { format } from "date-fns";

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
  const [xDown, setXDown] = useState(null);
  const [showRelatedAds, toggleRelatedAds] = useState(false);
  const [showSurvey, toggleSurvey] = useState(null);
  const [showSkipCounter, closeSkipCounter] = useState(false);
  const [showSkipButton, toggleSkipButton] = useState(true);
  const imageTimerRef = useRef(Date.now());

  let adData = {
    duration: 0,
    has_finished: false,
    log_date: "",
  };
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const setSkipVideo = (index) => {
    const media = playlist[index];
    setPlayingVideo(media._id);
    setIsPlaying(true);
  };
  const setPlayingVideo = async (_id) => {
    if (!_id) return;

    const item = playlist.find((item) => item._id === _id);
    const previousItem = playlist[currentVideoIndex];
    const prevURL = previousItem.signedUrl
      ? previousItem.signedUrl
      : previousItem.link;
    const index = playlist.indexOf(item);
    if (getType(prevURL) === "image") {
      //increment usage by 1
      const elapsedTimeInSeconds = (Date.now() - imageTimerRef.current) / 1000;
      adData.duration = elapsedTimeInSeconds;
    } else {
      const durationBeforeSwitching = currentTime;
      adData.duration = durationBeforeSwitching;
    }
    adData.log_date = format(new Date(), "yyyy-MM-dd'T'HH:mm:ssXXX");
    console.log(adData, `media_id: ${previousItem._id}`);
    imageTimerRef.current = Date.now();
    await recordAdViews(previousItem._id, adData);

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
        (item) =>
          item?.signedUrl === links[currentVideoIndex] ||
          item?.link === links[currentVideoIndex]
      );
      //ichecheck yung survey array if yung play after ID dun is same sa ID ng nag end na video so if true, show survey else tuloy
      const survey = surveys.find((survey) => survey.play_after == item._id);

      if (survey) {
        closeSkipCounter(false);
        toggleSkipButton(true);
        toggleSurvey([
          {
            _id: survey._id,
            title: survey.title,
            description: survey.description,
          },
          ...survey.questions,
        ]);
      }
      if (currentVideoIndex < links.length - 1) {
        setCurrentVideoIndex(currentVideoIndex + 1);
        setIsLoading(true);
      } else if (currentVideoIndex === links.length - 1) {
        setCurrentVideoIndex(0);
        setIsLoading(true);
      }

      if (item.type === "image") {
        const elapsedTimeInSeconds =
          (Date.now() - imageTimerRef.current) / 1000;
        adData.duration = elapsedTimeInSeconds;
      } else {
        adData.duration = item.videoDuration;
      }
      imageTimerRef.current = Date.now();
      adData.has_finished = true;
      adData.log_date = format(new Date(), "yyyy-MM-dd'T'HH:mm:ssXXX");

      await recordAdViews(item._id, adData);
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
      const timeout = setTimeout(handleVideoEnd, 5000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [currentVideoIndex, links, playlist, recordAdViews, surveys, showSurvey]);

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
      const skipTimeout = setTimeout(() => closeSkipCounter(true), 5000);
      return () => {
        clearTimeout(timeout);
        clearTimeout(skipTimeout);
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
            <div className="relative bg-matte-black w-full h-full flex items-center justify-center p-4 transition-all">
              <SurveyForm
                setSurvey={toggleSurvey}
                survey={showSurvey}
                closeSurvey={closeSurvey}
                toggleSkip={toggleSkipButton}
              />
              <Countdown max={30} />
              {showSkipButton && (
                <Button
                  className="absolute bottom-10 right-0 disabled:bg-black float-right bg-[#00000062] px-4 rounded-none disabled:pointer-events-none"
                  type={"button"}
                  color="transparent"
                  onClick={() => toggleSurvey(null)}
                  disabled={!showSkipCounter}
                >
                  <p className="text-xl">
                    Skip{" "}
                    {!showSkipCounter && (
                      <>
                        in <Counter max={5} /> seconds
                      </>
                    )}
                  </p>
                </Button>
              )}
            </div>
          ) : (
            <>
              <div
                className={classNames(
                  "relative transition-all bg-[#000] aspect-video overflow-hidden",
                  /*isFullScreen ? "max-w-full h-[72%]" :*/ "max-w-[100%] h-full"
                )}
              >
                {/* {console.log(links)} */}
                {getType(links[currentVideoIndex]) === "image" ? (
                  <img
                    id="image-player"
                    src={getFileURL(links[currentVideoIndex])}
                    className="w-full h-full"
                  />
                ) : (
                  <video
                    id="video-player"
                    src={
                      links[currentVideoIndex].includes("http")
                        ? links[currentVideoIndex]
                        : getFileURL(links[currentVideoIndex])
                    }
                    ref={videoRef}
                    className="h-full w-full"
                    autoPlay
                  ></video>
                )}
              </div>
              <div
                id="controls"
                className={classNames(
                  "absolute top-0 left-0 border w-full h-full flex items-center justify-center gap-4",
                  !isPlaying ? "bg-[#0000009c]" : "bg-transparent"
                )}
                onClick={togglePlayPause}
              >
                <Button
                  color="transparent"
                  theme={iconButton}
                  className={classNames(
                    "focus:ring-0 outline-none animate-fade transition-all bg-[#00000070]",
                    isPlaying
                      ? "opacity-0 pointer-events-none"
                      : "opacity-100 pointer-events-auto"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();

                    if (currentVideoIndex + 1 < playlist.length) {
                      setSkipVideo(currentVideoIndex + 1);
                    } else {
                      setSkipVideo(0);
                    }
                  }}
                >
                  <MdSkipPrevious className="text-7xl text-white" />
                </Button>
                <Button
                  color="transparent"
                  theme={iconButton}
                  className={classNames(
                    "focus:ring-0 outline-none animate-fade transition-all bg-[#00000070]",
                    isPlaying
                      ? "opacity-0 pointer-events-none"
                      : "opacity-100 pointer-events-auto"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlayPause();
                  }}
                >
                  {isPlaying ? (
                    <MdPlayArrow className="text-9xl text-white" />
                  ) : (
                    <MdPause className="text-9xl text-white" />
                  )}
                </Button>
                <Button
                  color="transparent"
                  theme={iconButton}
                  className={classNames(
                    "focus:ring-0 outline-none animate-fade transition-all bg-[#00000070]",
                    isPlaying
                      ? "opacity-0 pointer-events-none"
                      : "opacity-100 pointer-events-auto"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (currentVideoIndex > 0) {
                      setSkipVideo(currentVideoIndex - 1);
                    } else {
                      setSkipVideo(playlist.length - 1);
                    }
                  }}
                >
                  <MdSkipNext className="text-7xl text-white" />
                </Button>
                {/* <div className="w-full">
                  <Progress
                    size="md"
                    progress={
                      currentTime === 0
                        ? 0
                        : (currentTime / (duration || 1)) * 100 // Added a fallback to avoid division by zero
                    }
                  />
                </div> */}
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
                isPlaying={isPlaying}
                togglePlaying={setIsPlaying}
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
