import classNames from "classnames";
import PropTypes from "prop-types";
function RelatedAds({ isFullScreen }) {
  return (
    <section
      className={classNames(
        "bg-default transition-all rounded w-full",
        isFullScreen ? "h-0" : "h-[35%]"
      )}
    ></section>
  );
}
RelatedAds.propTypes = {
  isFullScreen: PropTypes.bool,
};
export default RelatedAds;
