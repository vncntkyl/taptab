import classNames from "classnames";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";

function Card({ title, count, link, icon }) {
  const navigate = useNavigate();
  return (
    <Link
      to={`/${link ? link : ""}`}
      className={classNames(
        "relative w-full min-w-[100%] sm:min-w-[49%] lg:min-w-[32.5%] xl:min-w-[19%] min-h-[150px] snap-start flex flex-col justify-between p-2 bg-white border-b-8 border-main text-secondary-light shadow-md font-bold",
        link ? "cursor-pointer" : "cursor-default"
      )}
    >
      <p className="text-5xl pb-4">{count}</p>
      <div className="text-lg">{title}</div>
      <div className="absolute top-0 right-0 p-4">{icon}</div>
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
