import classNames from "classnames";
import { useStaticAds } from "../functions/staticAdFunctions";
import PropTypes from "prop-types";
import { useApp } from "../contexts/AppContext";
import test from "../assets/testImage.jpg";

function StaticAds({ className }) {
  const { updateStaticAdsAnalytics } = useStaticAds();
  const { staticAds, setActiveAd } = useApp();
  return (
    <>
      <section
        className={classNames(
          "bg-default rounded p-2 relative overflow-x-auto overflow-y-hidden h-full scrollbar-thin snap-x snap-mandatory",
          className
        )}
      >
        <div className="w-full h-full flex gap-2 justify-evenly transition-all">
          {staticAds.map((item) => {
            const thumbnail = item.images.find(img => img.type === "thumbnail").signedUrl 
            return (
              <img
                onClick={async () => {
                  setActiveAd({ ...item, ad_type: "static" });
                  await updateStaticAdsAnalytics(item);
                }}
                src={thumbnail}
                key={item._id}
                className="h-full rounded-md snap-start"
              />
            );
          })}
        </div>
      </section>
    </>
  );
}

StaticAds.propTypes = {
  className: PropTypes.string,
  toggle: PropTypes.func,
};

export default StaticAds;
