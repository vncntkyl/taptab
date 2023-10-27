import PropTypes from "prop-types";

function AdContainer({ ad }) {
  const getFileURL = (objectName) => {
    return `https://storage.googleapis.com/tamc_advertisements/${objectName}`;
  };
  return (
    <>
      <img
        src={getFileURL(ad._urlID)}
        alt=""
        className="w-full h-full rounded-md"
      />
      <p className="text-lg absolute bottom-0 p-4 pb-2 w-full opacity-100 group-hover:opacity-100 transition-all bg-[#00000077] backdrop:blur-lg text-white font-bold">
        {ad.name}
      </p>
    </>
  );
}

AdContainer.propTypes = {
  ad: PropTypes.object,
};

export default AdContainer;
