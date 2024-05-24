import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { FaPhotoVideo } from "react-icons/fa";
import { BsMegaphoneFill } from "react-icons/bs";
import { FaTabletScreenButton, FaUsers } from "react-icons/fa6";
import { RiSurveyFill } from "react-icons/ri";
function Card({ title, count, link }) {
  let Icon;
  switch (link) {
    case "media_library":
      Icon = FaPhotoVideo;
      break;
    case "static_ads":
      Icon = BsMegaphoneFill;
      break;
    case "players":
      Icon = FaTabletScreenButton;
      break;
    case "user_engagements":
      Icon = RiSurveyFill;
      break;
    case "users":
      Icon = FaUsers;
      break;
    default:
  }
  return (
    <Link
      to={`/${link}`}
      className="relative w-full min-w-[100%] sm:min-w-[49%] lg:min-w-[32.5%] xl:min-w-[19%] min-h-[150px] snap-start flex flex-col items-center justify-evenly p-4 gap-6 bg-white py-8 text-secondary-light font-bold"
    >
      <div className="flex items-center gap-2">
        <Icon className="font-bold text-secondary-dark tracking-wider text-2xl" />
        <p className="capitalize">{title}</p>
      </div>
      <p className="text-7xl">{count}</p>
    </Link>
  );
}

Card.propTypes = {
  title: PropTypes.string,
  count: PropTypes.string,
  link: PropTypes.string,
};

export default Card;
