import React from "react";
import PropTypes from "prop-types";
import { textTheme } from "../../context/CustomThemes";
import { FileInput, Label } from "flowbite-react";

function VideoUploadForm({
  media,
  onFileChange,
  canvasRef,
  videoRef,
  fromLink,
}) {
  return (
    <div>
      {media && (
        <>
          <video width={320} height={160} controls ref={videoRef}>
            <source src={media} />
          </video>
          <br />
        </>
      )}
      <canvas className="hidden" ref={canvasRef}></canvas>
      {!fromLink ? (
        <>
          <Label htmlFor="file" value="Upload Video" />
          <FileInput
            id="file"
            type="text"
            sizing="sm"
            required
            accept="video/*"
            onChange={(e) => onFileChange(e)}
            theme={textTheme}
          />
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

VideoUploadForm.propTypes = {
  media: PropTypes.string, // Change to PropTypes.string
  onFileChange: PropTypes.func,
  fromLink: PropTypes.bool,
};

export default React.forwardRef(VideoUploadForm);
