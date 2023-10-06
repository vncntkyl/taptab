import classNames from "classnames";
import PropTypes from "prop-types";
import PageHeader from "./PageHeader";
import { useVideos } from "../functions/VideoFunctions";
import { Button } from "flowbite-react";
import { mainButton } from "../functions/CustomThemes";
function RelatedAds({ isFullScreen, ads }) {
  const { getFileURL } = useVideos();
  return (
    <section
      className={classNames(
        "bg-default transition-all rounded w-full p-2",
        isFullScreen ? "h-0" : "h-[35%]"
      )}
    >
      <div className="flex justify-between items-center p-2">
        <PageHeader>
          Enjoying what you&lsquo;re seeing? Check these out!
        </PageHeader>
        <Button
          className="disabled:bg-black"
          type="submit"
          color="transparent"
          theme={mainButton}
          onClick={() => {}}
        >
          Share your thoughts with us!
        </Button>
      </div>
      {ads && (
        <div className="flex items-center overflow-x-auto p-2 gap-4 snap-x snap-mandatory rounded-md">
          {ads.map((ad) => {
            return (
              <div key={ad._id} className="w-full snap-start">
                <img
                  src={getFileURL(ad._urlID)}
                  className="w-full min-w-[550px] rounded-md"
                />
                <section>{ad.name}</section>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
RelatedAds.propTypes = {
  isFullScreen: PropTypes.bool,
  ads: PropTypes.array,
};
export default RelatedAds;
