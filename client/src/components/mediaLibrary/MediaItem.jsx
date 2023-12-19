import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageHeader from "../../fragments/PageHeader";
import { useFunction } from "../../context/Functions";
import { useStorage } from "../../context/StorageContext";
import { format } from "date-fns";
import MediaAnalytics from "./mediaAnalytics";
function MediaItem() {
  const id = useParams();
  const { removeUnderscore } = useFunction();
  const { getMediaInformation } = useStorage();
  const [media, setMedia] = useState(null);

  const getFileURL = (objectName) => {
    return `https://storage.googleapis.com/tamc_advertisements/${objectName}`;
  };
  const getTime = (seconds) => {
    const milliseconds = Math.floor(seconds * 1000);

    // Format the milliseconds as HH:mm:ss.SSS
    return new Date(milliseconds).toISOString().substring(11, 19);
  };
  const convertSize = (size) => {
    if (size < 1048576) {
      return (size / 1000).toFixed(2) + "KB";
    } else {
      return (size / 1048576).toFixed(2) + "MB";
    }
  };
  useEffect(() => {
    const media_id = localStorage.getItem("media_id");

    if (!media_id) return;

    const setup = async (id) => {
      const response = await getMediaInformation(id);
      console.log(response);
      setMedia(response);
    };

    setup(media_id);
  }, []);
  return (
    media && (
      <div>
        <PageHeader>{removeUnderscore(id.id)} Information</PageHeader>
        {media !== null && (
          <div className="grid grid-cols-1 md:grid-cols-[30%_70%] gap-4">
            <section
              className="bg-white p-2 px-4 pb-4 shadow border flex flex-col gap-4 min-h-[500px]"
              id={media._id}
            >
              <p className="font-bold text-lg border-b">Media Information</p>
              <div className="flex flex-col gap-4">
                {media.type === "image" ? (
                  <img
                    src={getFileURL(media._urlID)}
                    className="w-full transition-all max-w-lg"
                  ></img>
                ) : media.type === "link" ? (
                  <video
                    src={media._urlID}
                    controls
                    className="w-full transition-all max-w-lg"
                  ></video>
                ) : (
                  <video
                    src={getFileURL(media._urlID)}
                    controls
                    className="w-full transition-all max-w-lg"
                  ></video>
                )}
                <div>
                  <p>
                    <span className="font-semibold">Name: </span>
                    <span>{removeUnderscore(media.name)}</span>
                  </p>
                  <p>
                    <span className="font-semibold">Category: </span>
                    <span>{media.category}</span>
                  </p>
                  <p>
                    <span className="font-semibold">Type: </span>
                    <span className="capitalize">{media.type}</span>
                  </p>
                  <p>
                    <span className="font-semibold">Usage: </span>
                    <span>{media.usage}</span>
                  </p>
                  <p>
                    <span className="font-semibold">Date Uploaded: </span>
                    <span>
                      {format(
                        new Date(media.timeCreated),
                        "MMMM dd, yyyy hh:mm a"
                      )}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="font-bold">Media Details</p>
                  {media.duration && (
                    <p>
                      <span className="font-semibold">Duration: </span>
                      <span>{getTime(media.duration)}</span>
                    </p>
                  )}
                  <p>
                    <span className="font-semibold">Resolution: </span>
                    <span className="capitalize">
                      {media.dimensions.width} &#215; {media.dimensions.height}
                    </span>
                  </p>
                  {media.size && (
                    <p>
                      <span className="font-semibold">Size: </span>
                      <span>{convertSize(media.size)}</span>
                    </p>
                  )}
                </div>
              </div>
            </section>
            <section className="flex flex-col gap-2 mr-4 min-h-[500px]">
              {media.logs.logs.length === 0 ? (
                <>
                  <div className="relative w-full h-full bg-white shadow border p-2 px-4">
                    <p className="font-bold text-lg border-b">Ad Analytics</p>
                    <p className="absolute top-0 left-0 w-full h-full flex items-center justify-center font-bold text-default-dark-2">
                      No analytics found
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <MediaAnalytics logs={media.logs.logs} id={media.logs._id} />
                </>
              )}
            </section>
          </div>
        )}
      </div>
    )
  );
}

export default MediaItem;
