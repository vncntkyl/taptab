import PropTypes from "prop-types";
import { Dropdown } from "flowbite-react";
import { HiViewGridAdd } from "react-icons/hi";

function MediaUploadDropdown({ triggerModal }) {
  return (
    <div className="bg-white flex items-center text-main rounded-lg border border-main shadow-sm w-fit">
      <Dropdown
        inline
        label={
          <div className="flex items-center gap-1 p-2">
            <HiViewGridAdd />
            <p>Add New</p>
          </div>
        }
      >
        <Dropdown.Item onClick={() => triggerModal("image")}>
          Image
        </Dropdown.Item>
        <Dropdown.Item onClick={() => triggerModal("video")}>
          Video
        </Dropdown.Item>
        <Dropdown.Item onClick={() => triggerModal("link")}>Link</Dropdown.Item>
      </Dropdown>
    </div>
  );
}

MediaUploadDropdown.propTypes = {
  triggerModal: PropTypes.func,
};

export default MediaUploadDropdown;
