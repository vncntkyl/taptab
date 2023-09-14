import React, { useEffect, useRef, useState } from "react";
import PageHeader from "../fragments/PageHeader";
import {
  Button,
  Dropdown,
  FileInput,
  Label,
  Modal,
  TextInput,
} from "flowbite-react";
import { mainButton, modalTheme, textTheme } from "../context/CustomThemes";
import { HiViewGridAdd } from "react-icons/hi";
import { useStorage } from "../context/StorageContext";
import MediaLibraryTable from "../tables/MediaLibraryTable";
import { values as useFunction } from "../context/Functions";
function MediaLibrary() {
  const { getMedia } = useStorage();
  const { capitalize } = useFunction();
  const [modal, setModal] = useState({
    toggle: false,
    title: null,
  });
  const [mediaFiles, setMediaFiles] = useState(null);
  const [mediaItem, setMediaItem] = useState({
    name: "",
    folder: "",
    category: "",
  });
  const [media, setMedia] = useState(null);
  const [file, setFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const videoFeed = useRef(null);
  const canvasRef = useRef(null);

  const handleMediaUpload = async (e) => {
    e.preventDefault();

    if (videoFeed.current.readyState >= 2) {
      videoFeed.current.currentTime = 2;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(videoFeed.current, 0, 0, canvas.width, canvas.height);

      // Convert the canvas to a data URL and set it as the screenshot URL.
      const screenshotDataUrl = canvas.toDataURL("image/png");
      setThumbnail(screenshotDataUrl);
    }
  };

  const onFileChange = (evt) => {
    setMedia(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      // Access image contents from reader result
      const videoContent = e.target.result;
      setMedia(videoContent);
      setFile(evt.target.files[0]);
    };
    reader.readAsDataURL(evt.target.files[0]);
  };
  const onInputChange = (e, key) => {
    setMediaItem((current) => {
      return {
        ...current,
        [key]: e.target.value,
      };
    });
  };

  const triggerModal = (optionName) => {
    setModal({
      toggle: true,
      title: optionName,
    });
  };

  useEffect(() => {
    const setup = async () => {
      const response = await getMedia();
      setMediaFiles(response);
    };
    setup();
  }, []);
  return (
    mediaFiles && (
      <>
        <div className="transition-all w-full flex flex-col gap-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
            <PageHeader>Manage Media Library</PageHeader>
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
                <Dropdown.Item onClick={() => triggerModal("link")}>
                  Link
                </Dropdown.Item>
              </Dropdown>
            </div>
          </div>
          <div className="w-full overflow-x-auto rounded-md shadow-md">
            <MediaLibraryTable
              media={mediaFiles}
              setItem={setMediaItem}
              setModal={setModal}
            />
            {/* {`https://storage.googleapis.com/${media[0].bucket}/${media[0]._urlID}`} */}
          </div>
          <pre className="whitespace-pre-wrap">
            {JSON.stringify(mediaFiles, null, 4)}
          </pre>
        </div>
        <Modal
          position="center"
          show={modal.toggle}
          dismissible
          onClose={() => {
            setModal({
              toggle: false,
              title: null,
            });
            setFile(null);
            setMedia(null);
          }}
          size="3xl"
          theme={modalTheme}
        >
          <Modal.Header className="border-b-default-dark p-3 px-4">
            {modal.toggle && "Add New " + capitalize(modal.title)}
          </Modal.Header>
          <Modal.Body>
            <form
              className="flex flex-col gap-2"
              encType="multipart/form-data"
              onSubmit={handleMediaUpload}
            >
              <div>
                {media && (
                  <>
                    <video width={320} height={160} controls ref={videoFeed}>
                      <source src={media} />
                    </video>
                  </>
                )}
                <br />
                {thumbnail && <img src={thumbnail} alt="" />}
                <canvas className="hidden" ref={canvasRef}></canvas>
                <Label htmlFor="file" value="Upload File" />
                <FileInput
                  id="file"
                  type="text"
                  sizing="sm"
                  required
                  onChange={(e) => onFileChange(e)}
                  theme={textTheme}
                />
              </div>
              <div>
                <Label htmlFor="name" value="Name" />
                <TextInput
                  id="name"
                  onChange={(e) => onInputChange(e, "name")}
                  type="text"
                  sizing="sm"
                  value={mediaItem.name}
                  required
                  theme={textTheme}
                />
              </div>
              <Button
                className="mt-4 w-full disabled:bg-black"
                type="submit"
                color="transparent"
                theme={mainButton}
              >
                Upload
              </Button>
            </form>
          </Modal.Body>
        </Modal>
      </>
    )
  );
}

export default MediaLibrary;
