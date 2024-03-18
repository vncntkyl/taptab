import PropTypes from "prop-types";

function AnalyticsCard({ count, title }) {
  return (
    <div className="w-full bg-white shadow border flex flex-col gap-2 p-4">
      <p className="text-4xl font-bold text-secondary-dark">{count}</p>
      <p className="font-semibold text-gray-700">{title}</p>
    </div>
  );
}
AnalyticsCard.propTypes = {
  count: PropTypes.node,
  title: PropTypes.string,
};

export default AnalyticsCard;
