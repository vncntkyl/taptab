import { Link } from "react-router-dom";
import PageHeader from "../fragments/PageHeader";
import PropTypes from "prop-types";
import { Button, Label, Select, TextInput } from "flowbite-react";
import { MdOutlinePhotoSizeSelectLarge, MdWidthNormal } from "react-icons/md";
import {
  BsDatabaseFillX,
  BsFillFileEarmarkPlayFill,
  BsMegaphoneFill,
} from "react-icons/bs";
import { TiArrowMaximise } from "react-icons/ti";
import { FaTrash } from "react-icons/fa6";
import { mainButton } from "../context/CustomThemes";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useWidget } from "../context/WidgetContext";
function Settings() {
  const { updateSettings } = useWidget();
  const [settings, setSettings] = useState();
  const [settingsChanges, setChanges] = useState(null);
  const resolutions = [
    [1920, 1080],
    [1440, 900],
    [1280, 800],
    [1280, 720],
  ];
  const handleUpdate = (updates) => {
    updates = typeof updates === "string" ? JSON.parse(updates) : updates;
    setChanges((prev) => {
      if (prev) {
        return {
          ...prev,
          ...updates,
        };
      } else {
        return updates;
      }
    });
  };

  const handleSubmit = async () => {
    const user = localStorage.getItem("user");
    const userID = JSON.parse(user)._id;
    const response = await updateSettings(settingsChanges, userID);

    console.log(response);
    Cookies.set("settings", JSON.stringify(response));
  };
  useEffect(() => {
    const setup = () => {
      const settingsCookie = Cookies.get("settings");

      if (settingsCookie) {
        setSettings(JSON.parse(settingsCookie));
      }
    };
    setup();
  }, []);

  return (
    settings && (
      <>
        <div className="space-y-4">
          <PageHeader>Settings</PageHeader>
          <div className="space-y-4">
            <SettingSection title="Content Manager">
              <div className="flex flex-col">
                <h2 className="font-bold">Media</h2>
                <div className="border shadow p-4 flex flex-col gap-2">
                  <div className="border-b pb-2 flex items-center justify-between gap-4">
                    <OptionHeader icon={MdWidthNormal} title="Video Resolution">
                      Set the maximum resolution for your videos in{" "}
                      <PageLink title="Media Library" link="media_library" />.
                    </OptionHeader>
                    <Select
                      id="resolutions"
                      onChange={(e) => handleUpdate(e.target.value)}
                    >
                      {resolutions.map((res, index) => {
                        const value = {
                          "media.video_resolution.width": res[0],
                          "media.video_resolution.height": res[1],
                        };
                        return (
                          <option
                            key={res[0] + "_" + res[1]}
                            value={JSON.stringify(value)}
                            selected={
                              settings.media.video_resolution.width ===
                                res[0] &&
                              settings.media.video_resolution.height === res[1]
                            }
                          >
                            {`${res[0]} x ${res[1]} ${
                              index === 0 ? "(recommended)" : ""
                            }`}
                          </option>
                        );
                      })}
                    </Select>
                  </div>
                  <div className="border-b pb-2 flex flex-col gap-2">
                    <div className="flex gap-4 items-center">
                      <OptionHeader
                        icon={MdOutlinePhotoSizeSelectLarge}
                        title="Image Resolutions"
                      >
                        Set the maximum resolutions for your images in your
                        application. These can be found both in{" "}
                        <PageLink title="Static Ads" link="static_ads" /> and{" "}
                        <PageLink
                          title="Geo-tagged Ads"
                          link="geo_tagged_ads"
                        />
                        .
                      </OptionHeader>
                    </div>
                    <div className="ml-14 space-y-3">
                      <div className="flex items-center gap-4 justify-between">
                        <p className="font-semibold">Static Ads</p>
                        <StaticAdSetting
                          image_resolution={settings.media.image_resolution}
                          handleUpdate={handleUpdate}
                          module="static_ads"
                        />
                      </div>
                      <div className="flex items-center gap-4 justify-between">
                        <p className="font-semibold">Geo-tagged Ads</p>
                        <StaticAdSetting
                          image_resolution={settings.media.image_resolution}
                          handleUpdate={handleUpdate}
                          module="geo-tagged_ads"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="border-b pb-2 flex flex-row justify-between gap-2">
                    <div className="flex gap-4 items-center">
                      <OptionHeader
                        icon={TiArrowMaximise}
                        title="File Size Limit"
                      >
                        Set the maximum file size a user can upload for all the
                        media files.
                      </OptionHeader>
                    </div>
                    <div className="flex items-center gap-2">
                      <TextInput
                        id="size"
                        className="w-full max-w-[50px]"
                        value={10}
                        placeholder="size in mb"
                      />
                      <Label
                        htmlFor="size"
                        value="mb"
                        className="font-semibold"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-4 items-center">
                      <OptionHeader
                        icon={BsFillFileEarmarkPlayFill}
                        title="Accepted File Types"
                      >
                        These file types are optimized for web applications.
                        Please reach out to your developer if you&apos;d like to
                        make any changes.
                      </OptionHeader>
                    </div>
                    <div className="ml-14">
                      <p>
                        <span className="font-semibold text-sm">Videos: </span>
                        <span>webm</span>
                      </p>
                      <p>
                        <span className="font-semibold text-sm">Images: </span>
                        <span>webp</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <h2 className="font-bold">System</h2>
                <div className="border shadow p-4 flex flex-col gap-2">
                  <div className="border-b pb-2 flex items-center justify-between gap-4">
                    <OptionHeader icon={FaTrash} title="Recycle Bin">
                      Restore the deleted media files from the recycle bin or
                      permanently delete them.
                    </OptionHeader>
                    <div className="flex items-center gap-4">
                      <Button color="transparent" theme={mainButton} size="sm">
                        View Recycle Bin
                      </Button>
                      <Button color="gray" size="sm">
                        Delete Permanently
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <OptionHeader icon={BsDatabaseFillX} title="System Reset">
                      Resets the entire system, wiping the database and storage
                      clean, while preserving the users
                    </OptionHeader>
                    <Button color="failure" size="sm">
                      Reset
                    </Button>
                  </div>
                </div>
              </div>
            </SettingSection>
            <SettingSection title="App">
              <div className="flex flex-col">
                <h2 className="font-bold">System</h2>
                <div className="border shadow p-4 flex flex-col gap-2">
                  <div className="border-b pb-2 flex items-center justify-between gap-4">
                    <OptionHeader
                      icon={BsMegaphoneFill}
                      title="Static Ads Display"
                    >
                      Set the starting number of ads shown in the static ads
                      section of the app.
                    </OptionHeader>
                    <div className="flex items-center gap-2">
                      <button className="w-10 h-10 bg-gray-100 hover:bg-gray-300 transition-all rounded font-bold text-lg">
                        -
                      </button>
                      <TextInput
                        id="count"
                        className="w-full max-w-[40px]"
                        value={10}
                        placeholder="count"
                      />
                      <button className="w-10 h-10 bg-gray-100 hover:bg-gray-300 transition-all rounded font-bold text-lg">
                        +
                      </button>
                    </div>
                  </div>
                  <div className="pb-2 flex items-center justify-between gap-4">
                    <OptionHeader
                      icon={FaTrash}
                      title="Geo-tagged Ads Radius Setting"
                    >
                      Sets the radius,{" "}
                      <span className="font-bold italic">in meters</span>, for
                      triggering the pop up when the player (tablet) enters the
                      specified location. In meters.
                    </OptionHeader>
                    <div className="flex items-center gap-2">
                      <TextInput
                        id="distance"
                        className="w-full max-w-[50px]"
                        value={150}
                        placeholder="distance"
                      />
                      <Label
                        htmlFor="distance"
                        value="meters"
                        className="font-semibold"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </SettingSection>
            <SettingSection>
              <div className="flex gap-4 items-center justify-between">
                <p className="text-sm text-gray-600">
                  Last updated by {settings.updated_by || "---"} on{" "}
                  {settings.last_update || "---"}
                </p>
                <Button
                  onClick={handleSubmit}
                  color="transparent"
                  theme={mainButton}
                  size="sm"
                >
                  Save changes
                </Button>
              </div>
            </SettingSection>
          </div>
        </div>
      </>
    )
  );
}

function SettingSection({ title, children }) {
  return (
    <section className="p-4 bg-white shadow rounded-sm flex flex-col gap-4">
      {title && (
        <h1 className="font-bold text-lg capitalize border-b-2">{title}</h1>
      )}
      {children}
    </section>
  );
}
function OptionHeader({ icon: Icon, title, children }) {
  return (
    <>
      <Icon className="text-2xl" />
      <div className="mr-auto">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-gray-600 w-full">{children}</p>
      </div>
    </>
  );
}
function PageLink({ title, link }) {
  return (
    <Link className="text-secondary underline" to={`/${link}`}>
      {title}
    </Link>
  );
}
function StaticAdSetting({ image_resolution, handleUpdate, module }) {
  const [resolution, setResolution] = useState(image_resolution[module]);

  const handleWidthChange = (event) => {
    const newWidth = parseInt(event.target.value);
    if (!newWidth) {
      setResolution({
        height: 0,
        width: 0,
      });
      return;
    }

    const newHeight = Math.round(
      (newWidth / resolution.width) * resolution.height
    );
    const value = {
      [`media.image_resolution.${module}.width`]: newWidth,
      [`media.image_resolution.${module}.height`]: newHeight,
    };
    handleUpdate(value);
    setResolution({
      height: newHeight,
      width: newWidth,
    });
  };

  const handleHeightChange = (event) => {
    const newHeight = parseInt(event.target.value);
    if (!newHeight) {
      setResolution({
        height: 0,
        width: 0,
      });
      return;
    }
    const newWidth = Math.round(
      (newHeight / resolution.height) * resolution.width
    );
    const value = {
      [`media.image_resolution.${module}.width`]: newWidth,
      [`media.image_resolution.${module}.height`]: newHeight,
    };
    handleUpdate(value);
    setResolution({
      height: newHeight,
      width: newWidth,
    });
  };

  return (
    <div className="flex gap-4 items-center">
      <TextInput
        type="number"
        className="w-full max-w-[100px]"
        value={resolution.width}
        placeholder="width"
        onChange={handleWidthChange}
      />
      x
      <TextInput
        type="number"
        className="w-full max-w-[100px]"
        value={resolution.height}
        placeholder="height"
        onChange={handleHeightChange}
      />
    </div>
  );
}
PageLink.propTypes = {
  title: PropTypes.string,
  link: PropTypes.string,
};
OptionHeader.propTypes = {
  icon: PropTypes.func,
  title: PropTypes.string,
  children: PropTypes.node,
};
SettingSection.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
};
StaticAdSetting.propTypes = {
  module: PropTypes.string,
  image_resolution: PropTypes.object,
  handleUpdate: PropTypes.func,
};

export default Settings;
