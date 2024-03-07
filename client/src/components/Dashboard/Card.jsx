import classNames from "classnames";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

function Card({ title, count, link, icon: Icon }) {
  return (
    <Link
      to={`/${link ? link : ""}`}
      className={classNames(
        "relative w-full min-w-[100%] sm:min-w-[49%] lg:min-w-[32.5%] xl:min-w-[19%] min-h-[150px] snap-start flex flex-col items-center justify-evenly p-4 gap-6 bg-white py-8 text-secondary-light font-bold",
        link ? "cursor-pointer" : "cursor-default"
      )}
    >
      <div className="flex items-center gap-2">
        <Icon
          className={classNames(
            "font-bold text-secondary-dark tracking-wider text-2xl"
          )}
        />
        <div>{title}</div>
      </div>
      <p className="text-7xl">{count}</p>
    </Link>
  );
}

Card.propTypes = {
  title: PropTypes.string,
  count: PropTypes.string,
  link: PropTypes.string,
  icon: PropTypes.node,
};

export default Card;
