import { useRef, useEffect } from "react";

const VideoLinkPlayer = ({ link }) => {
  const videoLink = useRef();
  const recordedChunks = useRef([]); // Use useRef to maintain across renders
  const mediaRecorder = useRef(); // Use useRef for the MediaRecorder instance

  useEffect(() => {
    const videoElement = videoLink.current;

    const handleVideoPlay = () => {
      const stream = videoElement.captureStream();
      mediaRecorder.current = new MediaRecorder(stream); // Store MediaRecorder instance in a ref

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.current.push(event.data);
        }
      };

      mediaRecorder.current.onstop = () => {
        const blob = new Blob(recordedChunks.current, { type: "video/webm" });
        // Use the blob as required, e.g., save it or set it in state
        console.log(blob);
      };

      mediaRecorder.current.start();
    };

    const handleVideoEnded = () => {
      if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
        mediaRecorder.current.stop();
      }
    };

    videoElement.addEventListener("play", handleVideoPlay);
    videoElement.addEventListener("ended", handleVideoEnded);

    return () => {
      videoElement.removeEventListener("play", handleVideoPlay);
      videoElement.removeEventListener("ended", handleVideoEnded);
    };
  }, []);

  return (
    <>
      <video
        width={320}
        height={160}
        controls
        ref={videoLink}
        crossOrigin="anonymous"
      >
        <source src={link} />
      </video>
      <br />
    </>
  );
};

export default VideoLinkPlayer;
