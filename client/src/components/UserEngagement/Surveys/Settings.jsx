import PropTypes from "prop-types";
import {
  bottomOnlyBorderParagraph,
  bottomOnlyBorderText,
} from "../../../context/CustomThemes";
import { TextInput, Textarea } from "flowbite-react";

function Settings({ settings, setSettings, media }) {
  const updateSettings = (e) => {
    const value = e.target.value;
    const key = e.target.id;

    setSettings((current) => ({
      ...current,
      [key]: value,
    }));
  };
  return (
    <section
      id="settings"
      className="bg-white p-2 flex flex-col gap-2 rounded shadow"
    >
      <h4 className="text-secondary-dark font-bold text-sm uppercase">
        Survey Information
      </h4>
      <TextInput
        theme={bottomOnlyBorderText}
        id="title"
        className="ring-none outline-none focus:outline-none"
        placeholder="Enter title here"
        onChange={updateSettings}
        value={settings.title}
      />
      <Textarea
        id="description"
        theme={bottomOnlyBorderParagraph}
        placeholder="Enter description here"
        onChange={updateSettings}
        value={settings.description}
      />
      <div className="flex items-center gap-2">
        <label htmlFor="play_after" className="font-bold text-secondary-dark ">
          Play after:{" "}
        </label>
        <select
          id="play_after"
          className="rounded-md text-sm"
          onChange={updateSettings}
        >
          <option disabled selected={settings.play_after === ""}>
            --Select media--
          </option>
          ;
          {media.map((item) => {
            return (
              <option
                key={item._id}
                selected={settings.play_after === item._id}
                value={item._id}
              >
                {item.name}
              </option>
            );
          })}
        </select>
      </div>
    </section>
  );
}

Settings.propTypes = {
  settings: PropTypes.object,
  setSettings: PropTypes.func,
  media: PropTypes.array,
  setMedia: PropTypes.func,
};

export default Settings;
