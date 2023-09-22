import PropTypes from "prop-types";
import { Button } from "flowbite-react";
import { MdFullscreen } from "react-icons/md";
import { iconButton } from "../functions/CustomThemes";
import classNames from "classnames";
function AdsPlayer({ isFullScreen, toggleFullScreen }) {
  return (
    <section
      className={classNames(
        "transition-all relative bg-matte-black rounded text-white w-full flex items-center justify-center",
        isFullScreen ? "h-[100%]" : "h-[65%]"
      )}
    >
      <div
        className={classNames(
          "transition-all bg-black aspect-video",
          isFullScreen ? "max-w-full h-[70%]" : "max-w-[80%] h-full"
        )}
      ></div>
      <Button
        color="transparent"
        theme={iconButton}
        onClick={() => toggleFullScreen((current) => !current)}
        className="absolute bottom-0 right-0 focus:ring-0"
      >
        <MdFullscreen className="text-xl" />
      </Button>
    </section>
  );
}

AdsPlayer.propTypes = {
  isFullScreen: PropTypes.bool,
  toggleFullScreen: PropTypes.func,
};

export default AdsPlayer;
