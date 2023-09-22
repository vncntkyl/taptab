import PropTypes from "prop-types";
import {
  bottomOnlyBorderParagraph,
  bottomOnlyBorderText,
  iconButton,
} from "../../../context/CustomThemes";
import { Button, Label, TextInput, Textarea, Tooltip } from "flowbite-react";
import { values as useFunction } from "../../../context/Functions";
import {
  MdAdd,
  MdCheckBoxOutlineBlank,
  MdRadioButtonUnchecked,
  MdRemove,
} from "react-icons/md";

function Fields({ content, idx, updateOption, onChange }) {
  const { convertText } = useFunction();
  switch (content.type) {
    case "short text":
      return (
        <TextInput
          theme={bottomOnlyBorderText}
          className="ring-none outline-none focus:outline-none w-full max-w-lg pl-4 animate-fade"
          placeholder="Short answer field"
        />
      );
    case "paragraph":
      return (
        <div className="pl-4">
          <Textarea
            id="description"
            className="w-full max-w-lg animate-fade"
            theme={bottomOnlyBorderParagraph}
            placeholder="Paragraph answer field"
          />
        </div>
      );

    case "multiple choice":
    case "checkboxes":
      return (
        <div className="pl-4 flex flex-col gap-4 animate-fade">
          {content.answer.map((option, index) => {
            return (
              <div className="flex items-center gap-2" key={index}>
                {/* <Radio
                  checked={option.selected}
                  id={convertText(option.value)}
                  name={`radio_${index}`}
                  value={option.value}
                />
                <Label htmlFor={convertText(option.value)}>
                  {option.value}
                </Label> */}
                {content.type === "checkboxes" ? (
                  <MdCheckBoxOutlineBlank />
                ) : (
                  <MdRadioButtonUnchecked />
                )}
                <TextInput
                  theme={bottomOnlyBorderText}
                  className="transition-all ring-none outline-none focus:outline-none w-full max-w-[10rem] sm:max-w-xs pl-4 animate-fade"
                  placeholder="Option field"
                  value={option.value}
                  onChange={(e) => onChange(idx, index, e)}
                />
                {index !== 0 && (
                  <Tooltip content="Delete option" arrow={false}>
                    <Button
                      className="focus:ring-0 w-fit bg-white"
                      color="transparent"
                      size="sm"
                      theme={iconButton}
                      onClick={() => updateOption(idx, index, true)}
                    >
                      <MdRemove className="text-lg text-gray-600" />
                    </Button>
                  </Tooltip>
                )}
                {index === content.answer.length - 1 && (
                  <Tooltip content="Add option" arrow={false}>
                    <Button
                      className="focus:ring-0 w-fit bg-white"
                      color="transparent"
                      size="sm"
                      theme={iconButton}
                      onClick={() => updateOption(idx, index)}
                    >
                      <MdAdd className="text-lg text-gray-600" />
                    </Button>
                  </Tooltip>
                )}
              </div>
            );
          })}
        </div>
      );
  }
}

Fields.propTypes = {
  content: PropTypes.object,
  updateOption: PropTypes.func,
  onChange: PropTypes.func,
  idx: PropTypes.number,
};

export default Fields;
