import { useEffect, useRef, useState } from "react";
import {
  Badge,
  Button,
  FileInput,
  Label,
  Modal,
  TextInput,
} from "flowbite-react";
import { useAuth } from "../context/AuthContext";
import PageHeader from "../fragments/PageHeader";
import { useStorage } from "../context/StorageContext";
import MediaLibraryTable from "../tables/MediaLibraryTable";
import { useFunction } from "../context/Functions";
import MediaUploadDropdown from "../fragments/MediaUploadDropdown";
import VideoUploadForm from "../components/mediaLibrary/VideoUploadForm";
import {
  mainButton,
  modalTheme,
  redMainButton,
  textTheme,
} from "../context/CustomThemes";
import { format } from "date-fns";

function MediaLibrary() {
  const { getMedia, uploadMedia, deleteMediaItem } = useStorage();
  const { capitalize } = useFunction();
  const { setIsLoading, setAlert } = useAuth();
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
  const [search, setSearch] = useState("");
  const [file, setFile] = useState(null);
  const videoFeed = useRef(null);
  const canvasRef = useRef(null);
  const videoLink = useRef(null);

  const isVideoLink = (link) => {
    const videoExtensions = [
      ".3g2",
      ".3gp",
      ".avi",
      ".flv",
      ".h264",
      ".m4v",
      ".mkv",
      ".mov",
      ".mp4",
      ".mpeg",
      ".mpg",
      ".rm",
      ".swf",
      ".vob",
      ".webm",
      ".wmv",
    ];

    return videoExtensions.some(
      (ext) => link.endsWith(ext) || link.includes(ext)
    );
  };
  const handleMediaUpload = async (e) => {
    e.preventDefault();
    let response = null;
    setIsLoading((previous) => !previous);
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
    if (mediaItem.type === "image") {
      const fileData = {
        ...mediaItem,
        height: videoFeed.current.height,
        width: videoFeed.current.width,
        status: "pending approval",
        usage: 0,
      };

      response = await uploadMedia([file], fileData);
      const alert = {
        isOn: true,
        type: "success",
        message: "You have successfully added new media item.",
      };
      console.log(response);
      if (response.acknowledged) {
        setAlert(alert);
      } else {
        alert.type = "failure";
        alert.message = response;
        setAlert(alert);
      }
    } else if (mediaItem.type === "link") {
      const fileData = {
        ...mediaItem,
        status: "pending approval",
        usage: 0,
        link: media,
        height: videoLink.current.videoHeight,
        width: videoLink.current.videoWidth,
        videoDuration: videoLink.current.duration,
        timeCreated: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
        timeUpdated: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
      };
      if (videoLink.current.readyState >= 2) {
        videoLink.current.currentTime = 2;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(videoLink.current, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(async (blob) => {
          if (blob) {
            // Create a File object from the Blob
            const screenshotFile = new File(
              [blob],
              `${fileData.name}_tmb.png`,
              {
                type: "image/png",
              }
            );
            const mediaFile = [screenshotFile, file];
            response = await uploadMedia(mediaFile, fileData);
            const alert = {
              isOn: true,
              type: "success",
              message: "You have successfully added new media item.",
            };
            console.log(response);
            if (response.acknowledged) {
              setAlert(alert);
            } else {
              alert.type = "failure";
              alert.message = response;
              setAlert(alert);
            }
          } else {
            console.log("Failed to create Blob from canvas");
          }
        }, "image/png");
      }
    } else {
      const fileData = {
        ...mediaItem,
        height: videoFeed.current.videoHeight,
        width: videoFeed.current.videoWidth,
        status: "pending approval",
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
            const screenshotFile = new File(
              [blob],
              `${fileData.name}_tmb.png`,
              {
                type: "image/png",
              }
            );
            const mediaFile = [screenshotFile, file];
            response = await uploadMedia(mediaFile, fileData);
            const alert = {
              isOn: true,
              type: "success",
              message: "You have successfully added new media item.",
            };
            console.log(response);
            if (response.acknowledged) {
              setAlert(alert);
            } else {
              alert.type = "failure";
              alert.message = response;
              setAlert(alert);
            }
          } else {
            console.log("Failed to create Blob from canvas");
          }
        }, "image/png");
      }
    }
    setIsLoading((previous) => !previous);
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

  const handleMediaDeletion = async () => {
    setIsLoading((previous) => !previous);
    setModal({
      toggle: false,
      title: null,
    });
    const response = await deleteMediaItem(mediaItem);
    console.log(response);
    const alert = {
      isOn: true,
      type: "success",
      message: `You have successfully deleted ${mediaItem.name}.`,
    };
    if (response.acknowledged) {
      setAlert(alert);
    } else {
      alert.type = "failure";
      alert.message = response;
      setAlert(alert);
    }
    setIsLoading((previous) => !previous);
  };
  useEffect(() => {
    setIsLoading(true);
  }, [setIsLoading]);

  useEffect(() => {
    const setup = async () => {
      const response = await getMedia();
      setMediaFiles(
        response.filter((res) => {
          // Check if the object has a fileName key, and if it doesn't, consider it as a link
          if (!res.fileName) {
            return res.type === "link";
          }
          // Include files that don't start with "thumbnail" or have a type of "link"
          return !res.fileName.startsWith("thumbnail") || res.type === "link";
        })
      );
      setThumbnails(
        response.filter((res) => {
          if (res.contentType) {
            return res.contentType.includes("image");
          }
        })
      );
      setIsLoading(false);
    };
    setup();
    const realtimeData = setInterval(setup, 3000);
    return () => {
      clearInterval(realtimeData);
    };
  }, []);
  return (
    <>
      <div className="transition-all w-full flex flex-col gap-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
          <PageHeader>Manage Media Library</PageHeader>
          <MediaUploadDropdown triggerModal={triggerModal} />
        </div>
        {mediaFiles && (
          <div className="w-full overflow-x-auto rounded-md shadow-md flex flex-col gap-2">
            <form>
              <TextInput
                id="search"
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                sizing="sm"
                placeholder={`Search media`}
                value={search}
                required
                theme={textTheme}
              />
            </form>
            <MediaLibraryTable
              media={mediaFiles}
              thumbnails={thumbnails}
              setItem={setMediaItem}
              setModal={setModal}
            />
          </div>
        )}
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
          {modal.toggle &&
            (modal.title.includes("delete")
              ? capitalize(modal.title) + " Item"
              : "Add New " + capitalize(modal.title))}
        </Modal.Header>
        <Modal.Body>
          {modal.toggle &&
            (modal.title.includes("delete") ? (
              <>
                <div>
                  Are you sure you want to delete{" "}
                  <strong>{mediaItem.name}</strong> ?
                </div>
                <Button
                  className="mt-4 w-fit float-right"
                  color="transparent"
                  onClick={() => handleMediaDeletion()}
                  theme={redMainButton}
                >
                  Delete
                </Button>
              </>
            ) : (
              <form
                className="flex flex-col gap-2"
                encType="multipart/form-data"
                onSubmit={handleMediaUpload}
              >
                {modal.title === "link" ? (
                  <div>
                    {media !== null &&
                      (isVideoLink(media) ? (
                        <>
                          <video
                            width={320}
                            height={160}
                            controls
                            ref={videoLink}
                            crossOrigin="anonymous"
                          >
                            <source src={media} />
                          </video>
                          <br />
                          <canvas className="hidden" ref={canvasRef}></canvas>
                        </>
                      ) : (
                        <>
                          <Badge size="md" color="failure">
                            You have entered an invalid link.
                          </Badge>
                        </>
                      ))}
                    <Label htmlFor="media" value="Valid URL" />
                    <TextInput
                      id="media"
                      onChange={(e) => {
                        setMedia(e.target.value);
                      }}
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
                        <img src={media} alt="" ref={videoFeed} />
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
            ))}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default MediaLibrary;

{
  /* {`https://storage.googleapis.com/${media[0].bucket}/${media[0]._urlID}`} */
}
