import PropTypes from "prop-types";
import {
  bottomOnlyBorderParagraph,
  bottomOnlyBorderText,
} from "../../../context/CustomThemes";
import { Label, Radio, TextInput, Textarea } from "flowbite-react";
import { values as useFunction } from "../../../context/Functions";

function Fields({ content }) {
  const { convertText } = useFunction();
  switch (content.type) {
    case "short text":
      return (
        <TextInput
          theme={bottomOnlyBorderText}
          className="ring-none outline-none focus:outline-none w-full max-w-lg pl-4 animate-fade"
          placeholder="Short answer field"
          value={content.answer}
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
            value={content.answer}
          />
        </div>
      );

    case "multiple choice":
      return (
        <div className="pl-4 flex flex-col gap-4 animate-fade">
          {content.answer.map((option, index) => {
            return (
              <div className="flex items-center gap-2" key={index}>
                <Radio
                  checked={option.selected}
                  id={convertText(option.value)}
                  name={`radio_${index}`}
                  value={option.value}
                />
                <Label htmlFor={convertText(option.value)}>
                  {option.value}
                </Label>
              </div>
            );
          })}
        </div>
      );
    case "checkboxes":
      return content.type;
  }
}

Fields.propTypes = {
  content: PropTypes.object,
};

export default Fields;
