import PropTypes from "prop-types";
import { Link } from "react-router-dom";
function AnalyticsCard({ count, title, link }) {
  const cardStyle = "w-full bg-white shadow border flex flex-col gap-2 p-4";
  const CardContent = () => {
    return (
      <>
        <p className="text-4xl font-bold text-secondary-dark">{count}</p>
        <p className="font-semibold text-gray-700">{title}</p>
      </>
    );
  };

  if (link) {
    return (
      <a href={link} className={cardStyle}>
        <CardContent />
      </a>
    );
  } else {
    return (
      <div className={cardStyle}>
        <CardContent />
      </div>
    );
  }
}
AnalyticsCard.propTypes = {
  count: PropTypes.node,
  title: PropTypes.string,
  link: PropTypes.string,
};

export default AnalyticsCard;
