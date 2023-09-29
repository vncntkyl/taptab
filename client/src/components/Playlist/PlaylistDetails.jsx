import PropTypes from "prop-types";
import { TextInput } from "flowbite-react";
import { bottomOnlyBorderText } from "../../context/CustomThemes";

function PlaylistDetails({ details, setDetails }) {
  const updateSettings = (e) => {
    const value = e.target.value;
    const key = e.target.id;

    setDetails((current) => ({
      ...current,
      [key]: value,
    }));
  };
  return (
    <section
      id="details"
      className="bg-white p-2 flex flex-col gap-2 rounded shadow"
    >
      <h4 className="text-secondary-dark font-bold text-lg uppercase">
        Details
      </h4>
      <label
        htmlFor="playlist_name"
        className="text-secondary-light font-semibold"
      >
        Playlist Name
      </label>
      <TextInput
        theme={bottomOnlyBorderText}
        id="playlist_name"
        className="ring-none outline-none focus:outline-none"
        placeholder="Ex. Shampoo"
        onChange={updateSettings}
        value={details.playlist_name}
        required
      />
      <label htmlFor="category" className="text-secondary-light font-semibold ">
        Category
      </label>
      <TextInput
        theme={bottomOnlyBorderText}
        id="category"
        className="ring-none outline-none focus:outline-none"
        placeholder="Ex. Hair Products"
        onChange={updateSettings}
        value={details.category}
        required
      />
    </section>
  );
}

PlaylistDetails.propTypes = {
  details: PropTypes.object,
  setDetails: PropTypes.func,
};

export default PlaylistDetails;
