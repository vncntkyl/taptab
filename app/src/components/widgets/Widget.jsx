import classNames from "classnames";
import PropTypes from "prop-types";
import WeatherForecast from "./WeatherForecast";
import Maps from "./Maps";
import News from "./News";
function Widget({ className }) {
  return (
    <>
      <div
        className={classNames(
          "bg-[#f2f2f2] rounded-md p-2 overflow-x-hidden flex flex-col gap-2",
          className
        )}
      >
        <WeatherForecast />
        <Maps />
        <News />
      </div>
    </>
  );
}
Widget.propTypes = {
  className: PropTypes.string,
};
export default Widget;
