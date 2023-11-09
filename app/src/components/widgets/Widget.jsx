import classNames from "classnames";
import PropTypes from "prop-types";
import WeatherForecast from "./WeatherForecast";
import Maps from "./Maps";
import News from "./News";
function Widget({ className, setArticle }) {
  return (
    <>
      <div
        className={classNames(
          "bg-[#f2f2f2] rounded-md p-2 overflow-hidden grid grid-rows-[2fr_3.25fr_0.75fr] gap-2",
          className
        )}
      >
        <WeatherForecast />
        <Maps />
        <News setArticle={setArticle}/>
      </div>
    </>
  );
}
Widget.propTypes = {
  className: PropTypes.string,
  setArticle: PropTypes.func,
};
export default Widget;
