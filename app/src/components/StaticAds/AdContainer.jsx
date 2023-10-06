import PropTypes from "prop-types";

function AdContainer({ ad }) {
  const getFileURL = (objectName) => {
    return `https://storage.googleapis.com/tamc_advertisements/${objectName}`;
  };
  return (
    <>
      <img src={getFileURL(ad._urlID)} alt="" className="w-full object-cover rounded-md" />
      <p className="text-lg">{ad.name}</p>
    </>
  );
}

AdContainer.propTypes = {
  ad: PropTypes.object,
};

export default AdContainer;
