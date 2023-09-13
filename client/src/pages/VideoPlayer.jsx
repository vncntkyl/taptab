import PropTypes from "prop-types";
import { useEffect, useState } from "react";

function VideoPlayer({ links }) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // Function to handle the end of a video
    const handleVideoEnd = () => {
      // Check if there are more videos in the list
      if (currentVideoIndex < links.length - 1) {
        // Play the next video
        setCurrentVideoIndex(currentVideoIndex + 1);
        setIsLoading(true);
      } else {
        setCurrentVideoIndex(0);
        setIsLoading(true);
      }
    };

    const loadData = () => {
      setIsLoading(false);
    };

    // Add event listener to handle video ending
    const videoElement = document.getElementById("video-player");
    videoElement.addEventListener("loadeddata", loadData);
    videoElement.addEventListener("ended", handleVideoEnd);

    // Clean up the event listener when the component unmounts
    return () => {
      videoElement.removeEventListener("loadeddata", loadData);
      videoElement.removeEventListener("ended", handleVideoEnd);
    };
  }, [currentVideoIndex, links]);
  return (
    <div>
      {isLoading && (
        <div className="w-[640px] h-[360px] bg-black text-white">Loading..</div>
      )}
      <video
        id="video-player"
        width="640"
        height="360"
        autoPlay
        src={links[currentVideoIndex]}
        type="video/webm"
        className="animate-fade"
      ></video>
    </div>
  );
}

VideoPlayer.propTypes = {
  links: PropTypes.array,
};

export default VideoPlayer;
