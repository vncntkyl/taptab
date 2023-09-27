import { useEffect, useState } from "react";
import PageHeader from "../fragments/PageHeader";
import { useStorage } from "../context/StorageContext";
import { useAuth } from "../context/AuthContext";
import PlaylistTable from "../tables/PlaylistTable";

function Playlist() {
  const { setIsLoading } = useAuth();
  const { getPlaylist, getMedia } = useStorage();
  const [playlist, setPlaylists] = useState(null);

  useEffect(() => {
    setIsLoading(true);
  }, [setIsLoading]);

  useEffect(() => {
    const setup = async () => {
      const response = await getPlaylist();
      const mediaFiles = await getMedia();
      setPlaylists(
        response.map((res) => {
          return {
            ...res,
            media_items: mediaFiles
              .map((media) => {
                if (res.media_items.find((item) => media._id === item)) {
                  return media;
                } else {
                  return;
                }
              })
              .filter((item) => {
                if (item != null) {
                  if (item.contentType) {
                    return !item.contentType.includes("video");
                  } else {
                    return item;
                  }
                }
              }),
          };
        })
      );
      setIsLoading(false);
    };
    setup();
    // const realtimeData = setInterval(setup, 3000);
    // return () => {
    //   clearInterval(realtimeData);
    // };
  }, []);
  return (
    <>
      <div className="transition-all w-full flex flex-col gap-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
          <PageHeader>Manage Playlists</PageHeader>
        </div>
        {playlist && (
          <div className="w-full overflow-x-auto rounded-md shadow-md">
            <PlaylistTable data={playlist} />
          </div>
        )}
        <pre>{JSON.stringify(playlist, null, 3)}</pre>
      </div>
    </>
  );
}

export default Playlist;
