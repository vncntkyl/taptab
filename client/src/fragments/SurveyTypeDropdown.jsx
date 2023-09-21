import PropTypes from "prop-types";
import { Dropdown } from "flowbite-react";
import {
  MdOutlineCheckBox,
  MdOutlineShortText,
  MdRadioButtonChecked,
} from "react-icons/md";
import { GrTextAlignFull } from "react-icons/gr";

function SurveyTypeDropdown({ triggerModal, type, index }) {
  const showIcon = (type) => {
    switch (type) {
      case "short text":
        return <MdOutlineShortText />;
      case "paragraph":
        return <GrTextAlignFull />;
      case "multiple choice":
        return <MdRadioButtonChecked />;
      case "checkboxes":
        return <MdOutlineCheckBox />;
    }
  };
  return (
    <div className="bg-white flex items-center text-main rounded-lg border border-main shadow-sm w-fit">
      <Dropdown
        inline
        label={
          <div className="flex items-center gap-1 p-2 select-none">
            {showIcon(type)}
            <p className="capitalize whitespace-nowrap text-xs">{type}</p>
          </div>
        }
      >
        <Dropdown.Item
          onClick={() => triggerModal("short text", index)}
          className="flex items-center gap-1 select-none"
        >
          <MdOutlineShortText />
          Short Text
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => triggerModal("paragraph", index)}
          className="flex items-center gap-1 select-none"
        >
          <GrTextAlignFull />
          Paragraph
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => triggerModal("multiple choice", index)}
          className="flex items-center gap-1 select-none"
        >
          <MdRadioButtonChecked />
          <span>Multiple Choice</span>
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => triggerModal("checkboxes", index)}
          className="flex items-center gap-1 select-none"
        >
          <MdOutlineCheckBox />
          Checkboxes
        </Dropdown.Item>
      </Dropdown>
    </div>
  );
}

SurveyTypeDropdown.propTypes = {
  triggerModal: PropTypes.func,
  type: PropTypes.string,
  index: PropTypes.number,
};

export default SurveyTypeDropdown;
