import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import PageHeader from "../../fragments/PageHeader";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { values as useFunction } from "../../context/Functions";
import { Badge, Button } from "flowbite-react";
import { iconButton, mainButton } from "../../context/CustomThemes";
import { MdSave } from "react-icons/md";
import PlaylistDetails from "./PlaylistDetails";

import { useStorage } from "../../context/StorageContext";
import MediaSelection from "./MediaSelection";

function AddPlaylist(props) {
  const { _id } = useParams();
  const { setAlert, navigate, setIsLoading } = useAuth();
  const { getMedia } = useStorage();
  const { convertText, capitalize } = useFunction();
  const [modal, setModal] = useState({
    toggle: false,
    title: null,
    id: null,
  });
  const [details, setDetails] = useState({
    name: "",
    category: "",
  });
  const [status, setStatus] = useState("Changes are not yet saved");
  const [library, setLibrary] = useState();

  const handleFormSubmission = (e) => {
    e.preventDefault();

    console.log(library.filter((item) => item.container === "playlist"));
  };
  const saveProgress = () => {};

  useEffect(() => {
    setIsLoading(true);
  }, [setIsLoading]);

  useEffect(() => {
    const setup = async () => {
      const response = await getMedia();
      setLibrary(
        response
          .filter((item) => {
            if (item != null) {
              if (item.contentType) {
                return !item.contentType.includes("video");
              } else {
                return item;
              }
            }
          })
          .map((item) => ({
            ...item,
            container: "media",
          }))
      );

      setIsLoading(false);
    };
    setup();
  }, []);
  return (
    <>
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center pb-2">
          <PageHeader className="mr-auto">
            {_id
              ? `Edit '${capitalize(convertText(_id))}' Playlist`
              : "Create New Playlist"}
          </PageHeader>
          <Badge
            color={status === "Progress saved" ? "success" : "warning"}
            className="w-fit  font-semibold"
            size="xs"
          >
            {status}
          </Badge>
          {status === "Changes are not yet saved" && (
            <Button
              className="focus:ring-0 w-fit bg-white"
              color="transparent"
              size="sm"
              theme={iconButton}
              onClick={saveProgress}
            >
              <MdSave className="text-lg text-gray-600" />
              Save Progress
            </Button>
          )}
        </div>
        <form className="flex flex-col gap-2" onSubmit={handleFormSubmission}>
          <PlaylistDetails details={details} setDetails={setDetails} />
          <section className="flex flex-col gap-2">
            <h4 className="text-secondary-dark font-bold text-lg uppercase">
              Select Media
            </h4>
            {library && (
              <MediaSelection mediaLibrary={library} updateMedia={setLibrary} />
            )}
          </section>
          <Button
            className="mt-2 w-full disabled:bg-black md:max-w-fit md:float-right md:ml-auto"
            type="submit"
            color="transparent"
            theme={mainButton}
          >
            {_id ? "Save Changes" : "Upload Playlist"}
          </Button>
        </form>
      </div>
    </>
  );
}

AddPlaylist.propTypes = {};

export default AddPlaylist;
