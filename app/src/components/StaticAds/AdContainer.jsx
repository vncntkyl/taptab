import PropTypes from "prop-types";
import { useVideos } from "../../functions/VideoFunctions";

function AdContainer({ ad }) {
  const {getFileURL} = useVideos();
  return (
    <>
      <img
        src={getFileURL(ad._urlID)}
        alt=""
        className="w-full h-full rounded-md"
      />
      <p className="text-lg absolute bottom-0 p-4 pb-2 w-full opacity-0 group-hover:opacity-100 transition-all bg-[#00000077] backdrop:blur-lg text-white font-bold">
        {ad.name}
      </p>
    </>
  );
}

AdContainer.propTypes = {
  ad: PropTypes.object,
};

export default AdContainer;
