import PropTypes from "prop-types";
import { Button, ToggleSwitch, Tooltip } from "flowbite-react";
import { MdAdd, MdDeleteOutline } from "react-icons/md";
import { iconButton } from "../../../context/CustomThemes";
function Options({ index, content, setModal, toggleRequired, addField }) {
  return (
    <div className="flex items-center gap-1 justify-end">
      <Tooltip content="Delete field" arrow={false}>
        <Button
          className="focus:ring-0 w-fit bg-white"
          color="transparent"
          size="sm"
          theme={iconButton}
          onClick={() =>
            setModal({
              toggle: true,
              title: "delete field",
              id: index,
            })
          }
        >
          <MdDeleteOutline className="text-lg text-gray-600" />
        </Button>
      </Tooltip>
      <Tooltip content="Add field" arrow={false}>
        <Button
          className="focus:ring-0 w-fit bg-white"
          color="transparent"
          size="sm"
          theme={iconButton}
          onClick={() => {
            addField();
            setModal({
              toggle: false,
              title: null,
              id: index,
            });
          }}
        >
          <MdAdd className="text-lg text-gray-600" />
        </Button>
      </Tooltip>

      <ToggleSwitch
        checked={content.required}
        label="Required field"
        theme={{
          toggle: {
            base: "toggle-bg h-6 w-11 rounded-full border group-focus:ring-0",
            checked: {
              off: "border-gray-300 bg-gray-300 dark:border-gray-600 dark:bg-gray-700",
              color: {
                blue: "bg-main border-main",
              },
            },
          },
        }}
        onChange={() => toggleRequired(index)}
      />
    </div>
  );
}

Options.propTypes = {
  index: PropTypes.number,
  content: PropTypes.object,
  setModal: PropTypes.func,
  toggleRequired: PropTypes.func,
  addField: PropTypes.func,
};

export default Options;
