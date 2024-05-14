import { useEffect, useRef, useState } from "react";
import {
  Badge,
  Button,
  FileInput,
  Label,
  Modal,
  Pagination,
  Select,
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
  selectTheme,
  textTheme,
} from "../context/CustomThemes";
import { format } from "date-fns";
import { Route, Routes } from "react-router-dom";
import FilterDropdown from "../fragments/FilterDropdown";
import MediaItem from "../components/mediaLibrary/MediaItem";

function MediaLibrary() {
  const { getMedia, uploadMedia, deleteMediaItem, updateMedia } = useStorage();
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
    analytics: {
      clicks: 0,
      logs: [],
    },
  });
  const [media, setMedia] = useState(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("normal");
  const [filter, setFilter] = useState("all");
  const [file, setFile] = useState(null);
  const [pages, setPages] = useState(1);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const videoFeed = useRef(null);
  const canvasRef = useRef(null);
  const videoLink = useRef(null);

  const onPageChange = (page) => {
    setCurrentPage(page);
  };
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
    let handleFunction = modal.title === "edit" ? updateMedia : uploadMedia;
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

      response = await handleFunction([file], fileData);
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
            response = await handleFunction(mediaFile, fileData);
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
            response = await handleFunction(mediaFile, fileData);
            const alert = {
              isOn: true,
              type: "success",
              message: `You have successfully ${
                modal.title === "edit" ? "updated" : "added"
              } new media item.`,
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
      let filteredMedia = response.filter((res) => {
        // Check if the object has a fileName key, and if it doesn't, consider it as a link
        if (!res.fileName) {
          return res.type === "link";
        }
        // Include files that don't start with "thumbnail" or have a type of "link"
        return !res.fileName.startsWith("thumbnail") || res.type === "link";
      });

      setCategories([...new Set(filteredMedia.map((item) => item.category))]);
      if (search.length > 2) {
        filteredMedia = filteredMedia.filter((media) =>
          media.name.toLowerCase().includes(search.toLowerCase())
        );
      }
      if (sort !== "normal") {
        switch (sort) {
          case "A-Z_asc":
            filteredMedia = filteredMedia.sort((a, b) => {
              const itemA = a.name.toUpperCase();
              const itemB = b.name.toUpperCase();

              if (itemA < itemB) {
                return -1;
              }
              if (itemA > itemB) {
                return 1;
              }
              return 0;
            });
            break;
          case "Z-A_desc":
            filteredMedia = filteredMedia.sort((a, b) => {
              const itemA = b.name.toUpperCase();
              const itemB = a.name.toUpperCase();

              if (itemA < itemB) {
                return -1;
              }
              if (itemA > itemB) {
                return 1;
              }
              return 0;
            });
            break;
          case "date_asc":
            filteredMedia = filteredMedia.sort((a, b) => {
              const dateA = new Date(a.timeCreated).getTime();
              const dateB = new Date(b.timeCreated).getTime();
              return dateA - dateB;
            });
            break;
          case "date_desc":
            filteredMedia = filteredMedia.sort((a, b) => {
              const dateA = new Date(a.timeCreated).getTime();
              const dateB = new Date(b.timeCreated).getTime();
              return dateB - dateA;
            });
            break;
          case "usage_asc":
            filteredMedia = filteredMedia.sort((a, b) => {
              return a.usage - b.usage;
            });
            break;
          case "usage_desc":
            filteredMedia = filteredMedia.sort((a, b) => {
              return b.usage - a.usage;
            });
            break;
        }
      }
      if (filter !== "all") {
        filteredMedia = filteredMedia.filter(
          (media) => media.category.toLowerCase() === filter.toLowerCase()
        );
      }
      const size = filteredMedia.length;
      const pageCount = Math.ceil(size / 5);
      setPages(pageCount);
      const limit = (currentPage - 1) * 5;
      setMediaFiles(filteredMedia.splice(limit, 5));
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
  }, [currentPage, getMedia, search, setIsLoading, sort, filter]);
  return (
    <>
      <Routes>
        <Route
          exact
          path="/"
          element={
            <>
              <div className="transition-all w-full flex flex-col gap-2">
                <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                  <PageHeader>Manage Media Library</PageHeader>
                  <MediaUploadDropdown triggerModal={triggerModal} />
                </div>
                {mediaFiles && (
                  <>
                    <FilterDropdown
                      sortOptions={[
                        "A-Z_asc",
                        "Z-A_desc",
                        "date_asc",
                        "date_desc",
                        "usage_asc",
                        "usage_desc",
                      ]}
                      filterOptions={categories}
                      sort={sort}
                      filter={filter}
                      query={search}
                      searchItem={setSearch}
                      sortItems={setSort}
                      filterItems={setFilter}
                    />
                    <div className="w-full overflow-x-auto rounded-md shadow-md flex flex-col gap-2 max-h-[70vh]">
                      <MediaLibraryTable
                        media={mediaFiles}
                        thumbnails={thumbnails}
                        setItem={setMediaItem}
                        setCategory={setFilter}
                        filter={filter}
                        setModal={setModal}
                      />
                    </div>
                    <Pagination
                      totalPages={pages}
                      currentPage={currentPage}
                      onPageChange={onPageChange}
                    />
                  </>
                )}
              </div>
            </>
          }
        />
        <Route path="/:id" element={<MediaItem />} />
      </Routes>
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
            (modal.title.includes("delete") || modal.title.includes("edit")
              ? capitalize(modal.title) + ' "' + mediaItem.name + '"'
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
                    item={mediaItem}
                    title={modal.title}
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
                  {modal.title === "edit" ? "Save Changes" : "Upload"}
                </Button>
              </form>
            ))}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default MediaLibrary;
