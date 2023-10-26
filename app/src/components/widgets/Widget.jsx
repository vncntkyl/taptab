import classNames from "classnames";
import React from "react";
import PropTypes from "prop-types";
import WeatherForecast from "./WeatherForecast";
function Widget({ className }) {
  return (
    <>
      <div className={classNames("bg-[#f2f2f2] rounded-md p-2 overflow-y-auto", className)}>
        <WeatherForecast />
      </div>
    </>
  );
}
Widget.propTypes = {
  className: PropTypes.string,
};
export default Widget;
