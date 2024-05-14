import PropTypes from "prop-types";
import { BsImageAlt } from "react-icons/bs";

function PlaylistImage({ id, mediaFiles }) {
  return (
    <div className="stack" key={id}>
      {mediaFiles.map((item) => {
        if (item.signedUrl) {
          return (
            <img
              src={item.signedUrl}
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
  id: PropTypes.string,
  mediaFiles: PropTypes.array,
};

export default PlaylistImage;
