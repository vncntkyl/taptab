import classNames from "classnames";
import PropTypes from "prop-types";
import WeatherForecast from "./WeatherForecast";
import Maps from "./Maps";
import SideAdContainer from "./SideAdContainer";
// import News from "./News";
function Widget({ className }) {
  return (
    <>
      <div
        className={classNames(
          "relative",
          "grid grid-rows-[2fr_5fr] gap-4",
          "bg-[#f2f2f2] rounded-md p-2 overflow-hidden",
          className
        )}
      >
        <WeatherForecast />
        <Maps />
        <SideAdContainer />
      </div>
    </>
  );
}
Widget.propTypes = {
  className: PropTypes.string,
  setArticle: PropTypes.func,
};
export default Widget;
