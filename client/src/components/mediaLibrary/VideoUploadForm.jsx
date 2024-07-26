/* eslint-disable react/prop-types */
import React, { useState } from "react";
import PropTypes from "prop-types";
import { lightButton, textTheme } from "../../context/CustomThemes";
import { Button, FileInput, Label } from "flowbite-react";

function VideoUploadForm({
  media,
  onFileChange,
  canvasRef,
  videoRef,
  item,
  title,
}) {
  const [changeFile, toggleChangeFile] = useState(false);
  return (
    <div>
      {title === "edit" ? (
        <video
          width={320}
          height={160}
          controls
          ref={videoRef}
          src={media ? media : item.signedUrl}
        />
      ) : (
        media && (
          <video width={320} height={160} controls ref={videoRef} src={media} />
        )
      )}
      <br />
      <canvas className="hidden" ref={canvasRef}></canvas>
      {title === "edit" && !changeFile && (
        <Button
          className="mt-4 w-fit disabled:bg-black"
          type="button"
          color="transparent"
          theme={lightButton}
          onClick={() => toggleChangeFile((prev) => !prev)}
        >
          {changeFile ? "cancel" : "Change media"}
        </Button>
      )}
      {title === "edit" && changeFile ? (
        <>
          <Label htmlFor="file" value="Upload Video" />
          <FileInput
            id="file"
            type="text"
            sizing="sm"
            accept="video/*"
            onChange={(e) => onFileChange(e)}
            theme={textTheme}
          />
        </>
      ) : (
        title === "video" && (
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
        )
      )}
    </div>
  );
}

VideoUploadForm.propTypes = {
  media: PropTypes.string, // Change to PropTypes.string
  onFileChange: PropTypes.func,
  fromLink: PropTypes.bool,
  item: PropTypes.object,
  title: PropTypes.string,
};

export default React.forwardRef(VideoUploadForm);
