import classNames from "classnames";
import PropTypes from "prop-types";
import { useVideos } from "../../functions/VideoFunctions";
function RelatedAds({ ads, show, setVideo }) {
  const { getFileURL } = useVideos();
  return (
    <section
      className={classNames(
        "absolute bottom-0 w-full overflow-x-hidden transition-all duration-300 bg-[#0000009c] backdrop-blur-md scrollbar-none px-2",
        show
          ? "translate-y-[1%] opacity-100 pointer-events-auto"
          : "translate-y-[92.5%] opacity-30 pointer-events-none"
      )}
    >
      {ads && (
        <div className="flex items-center overflow-x-auto p-2 gap-4 snap-x snap-mandatory rounded-md scrollbar-none">
          {/* {console.log(ads)} */}
          {ads.map((ad) => {
            return (
              <div key={ad._id} className="w-full snap-start">
                <button
                  type="button"
                  onClick={() => {
                    setVideo(ad._id);
                  }}
                >
                  <img
                    src={getFileURL(ad._urlID)}
                    className="min-w-[350px] h-auto object-cover rounded-md"
                  />
                </button>
                <section>
                  {ad.name.substring(0, 25)}
                  {ad.name.length >= 25 && "..."}
                </section>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
RelatedAds.propTypes = {
  ads: PropTypes.array,
  show: PropTypes.bool,
  setVideo: PropTypes.func,
};
export default RelatedAds;
