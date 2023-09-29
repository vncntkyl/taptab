import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import PageHeader from "../../fragments/PageHeader";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { values as useFunction } from "../../context/Functions";
import { Button } from "flowbite-react";
import { mainButton } from "../../context/CustomThemes";
import PlaylistDetails from "./PlaylistDetails";

import { useStorage } from "../../context/StorageContext";
import MediaSelection from "./MediaSelection";

function AddPlaylist(props) {
  const { _id } = useParams();
  const { setAlert, navigate, setIsLoading } = useAuth();
  const { getMedia, uploadPlaylist } = useStorage();
  const { convertText, capitalize } = useFunction();
  const [details, setDetails] = useState({
    playlist_name: "",
    category: "",
  });
  const [library, setLibrary] = useState([]);

  const handleFormSubmission = async (e) => {
    e.preventDefault();

    const items = library
      .filter((item) => item.container === "playlist")
      .map((item) => item._id);
    const playlistData = {
      ...details,
      media_items: items,
    };
    const response = await uploadPlaylist(playlistData);
    console.log(response);
    const alert = {
      isOn: true,
      type: "success",
      message: `You have successfully ${
        _id ? "updated" : "created new"
      } playlist.`,
    };
    if (response.acknowledged) {
      setAlert(alert);
      navigate("./playlist");
    } else {
      alert.type = "failure";
      alert.message = response;
      setAlert(alert);
    }
  };

  useEffect(() => {
    setIsLoading(true);
  }, [setIsLoading]);

  useEffect(() => {
    const setup = async () => {
      let data;
      if (_id) {
        const playlistData = localStorage.getItem("playlistData");
        data = JSON.parse(playlistData);
        setDetails({
          playlist_name: data.playlist_name,
          category: data.category,
        });
      }
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
            container: _id
              ? data.media_items.find((plData) => plData._id == item._id)
                ? "playlist"
                : "media"
              : "media",
          }))
      );

      setIsLoading(false);
    };
    setup();
  }, [_id, getMedia, setIsLoading]);

  return (
    <>
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center pb-2">
          <PageHeader className="mr-auto">
            {_id
              ? `Edit '${capitalize(convertText(_id))}' Playlist`
              : "Create New Playlist"}
          </PageHeader>
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
