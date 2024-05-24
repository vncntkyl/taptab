import classNames from "classnames";
import PropTypes from "prop-types";
function RelatedAds({ ads, show, setVideo, isPlaying, togglePlaying }) {
  return (
    <section
      className={classNames(
        "absolute bottom-0 w-full overflow-x-hidden transition-all duration-300 scrollbar-none px-2",
        show
          ? "translate-y-[1%] opacity-100 pointer-events-auto"
          : "translate-y-[92.5%] opacity-30 pointer-events-none",
        !isPlaying ? "bg-transparent" : "bg-[#0000009c]"
      )}
    >
      {ads && (
        <div className="flex items-center overflow-x-auto p-2 pt-4 gap-4 snap-x snap-mandatory rounded-md scrollbar-none">
          {/* {console.log(ads)} */}
          {ads.map((ad) => {
            return (
              <div key={ad._id} className="w-full snap-start flex items-center flex-col">
                <button
                  type="button"
                  onClick={() => {
                    setVideo(ad._id);
                  }}
                >
                  <img
                    src={ad.signedUrl}
                    className="min-w-[450px] h-auto object-cover rounded-md"
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
  isPlaying: PropTypes.bool,
  togglePlaying: PropTypes.func,
};
export default RelatedAds;
