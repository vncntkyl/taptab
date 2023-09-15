import { useEffect, useRef, useState } from "react";
import PageHeader from "../fragments/PageHeader";
import { Button, FileInput, Label, Modal, TextInput } from "flowbite-react";
import { mainButton, modalTheme, textTheme } from "../context/CustomThemes";
import { useStorage } from "../context/StorageContext";
import MediaLibraryTable from "../tables/MediaLibraryTable";
import { values as useFunction } from "../context/Functions";
import MediaUploadDropdown from "../fragments/MediaUploadDropdown";
import { useAuth } from "../context/AuthContext";
import VideoUploadForm from "../components/mediaLibrary/VideoUploadForm";
function MediaLibrary() {
  const { getMedia, uploadMedia } = useStorage();
  const { capitalize } = useFunction();
  const { setIsLoading } = useAuth();
  const [modal, setModal] = useState({
    toggle: false,
    title: null,
  });
  const [mediaFiles, setMediaFiles] = useState(null);
  const [thumbnails, setThumbnails] = useState(null);
  const [mediaItem, setMediaItem] = useState({
    name: "",
    category: "",
    type: "",
    status: "pending approval",
    usage: 0,
  });
  const [media, setMedia] = useState(null);
  const [file, setFile] = useState(null);
  const videoFeed = useRef(null);
  const canvasRef = useRef(null);

  const handleMediaUpload = async (e) => {
    e.preventDefault();
    const fileData = {
      ...mediaItem,
      height: videoFeed.current.videoHeight,
      width: videoFeed.current.videoWidth,
      videoDuration: videoFeed.current.duration,
    };

    if (videoFeed.current.readyState >= 2) {
      videoFeed.current.currentTime = 2;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(videoFeed.current, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(async (blob) => {
        if (blob) {
          // Create a File object from the Blob
          const screenshotFile = new File([blob], `${fileData.name}_tmb.png`, {
            type: "image/png",
          });
          const mediaFile = [screenshotFile, file];
          const response = await uploadMedia(mediaFile, fileData);
          console.log(response);
        } else {
          console.log("Failed to create Blob from canvas");
        }
      }, "image/png");
    }
  };

  const onFileChange = (evt) => {
    setMedia(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      // Access image contents from reader result
      const mediaContent = e.target.result;
      const filename = evt.target.files[0].name
        .split(".")
        .slice(0, -1)
        .join(".");
      setMedia(mediaContent);
      setFile(evt.target.files[0]);
      setMediaItem((current) => ({
        ...current,
        name: filename,
      }));
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
    setMediaItem((current) => ({ ...current, type: optionName }));
  };

  useEffect(() => {
    const setup = async () => {
      const response = await getMedia();
      setMediaFiles(
        response.filter((res) => res.contentType.includes("video"))
      );
      setThumbnails(
        response.filter((res) => res.contentType.includes("image"))
      );
    };
    setup();
    const realtimeData = setInterval(setup, 3000);

    return () => {
      clearInterval(realtimeData);
    };
  }, []);
  return mediaFiles ? (
    <>
      {setIsLoading(false)}
      <div className="transition-all w-full flex flex-col gap-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
          <PageHeader>Manage Media Library</PageHeader>
          <MediaUploadDropdown triggerModal={triggerModal} />
        </div>
        <div className="w-full overflow-x-auto rounded-md shadow-md">
          <MediaLibraryTable
            media={mediaFiles}
            thumbnails={thumbnails}
            setItem={setMediaItem}
            setModal={setModal}
          />
        </div>
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
          setMediaItem({
            name: "",
            category: "",
            type: "",
          });
        }}
        size="xl"
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
            {modal.title === "link" ? (
              <div>
                <Label htmlFor="media" value="Valid URL" />
                <TextInput
                  id="media"
                  onChange={(e) => setMedia(e.target.value)}
                  type="text"
                  sizing="sm"
                  placeholder="Enter url of advertisement here"
                  value={media}
                  required
                  theme={textTheme}
                />
              </div>
            ) : modal.title === "image" ? (
              <div>
                {media && (
                  <>
                    <img src={media} alt="" />
                    <br />
                  </>
                )}
                <Label htmlFor="file" value="Upload Image" />
                <FileInput
                  id="file"
                  type="text"
                  sizing="sm"
                  required
                  accept="image/*"
                  onChange={(e) => onFileChange(e)}
                  theme={textTheme}
                />
              </div>
            ) : (
              <VideoUploadForm
                canvasRef={canvasRef}
                videoRef={videoFeed}
                onFileChange={onFileChange}
                media={media}
              />
            )}
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
            <div>
              <Label htmlFor="category" value="Category" />
              <TextInput
                id="category"
                onChange={(e) => onInputChange(e, "category")}
                type="text"
                sizing="sm"
                value={mediaItem.category}
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
  ) : (
    setIsLoading(true)
  );
}

export default MediaLibrary;

{
  /* {`https://storage.googleapis.com/${media[0].bucket}/${media[0]._urlID}`} */
}
