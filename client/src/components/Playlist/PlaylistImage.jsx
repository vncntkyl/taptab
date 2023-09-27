import PropTypes from "prop-types";
import { BsImageAlt } from "react-icons/bs";

function PlaylistImage({ media, mediaFiles }) {
  const getFileURL = (objectName) => {
    return `https://storage.googleapis.com/tamc_advertisements/${objectName}`;
  };
  return (
    <div className="stack" key={media._id}>
      {mediaFiles.map((item) => {
        if (item._urlID) {
          return (
            <img
              src={getFileURL(item._urlID)}
              key={item._id}
              alt=""
              className="aspect-square overflow-hidden object-cover max-w-[100px] rounded"
            />
          );
        } else {
          return (
            <div
              key={item._id}
              className="max-w-[100px] h-[100px] flex items-center justify-center rounded bg-black"
            >
              <BsImageAlt className="text-7xl" />
            </div>
          );
        }
      })}
    </div>
  );
}

PlaylistImage.propTypes = {
  media: PropTypes.object,
  mediaFiles: PropTypes.array,
};

export default PlaylistImage;
