import { useEffect, useState } from "react";
import PageHeader from "../fragments/PageHeader";
import { useStorage } from "../context/StorageContext";
import { useAuth } from "../context/AuthContext";
import PlaylistTable from "../tables/PlaylistTable";
import { Button } from "flowbite-react";
import { lightButton } from "../context/CustomThemes";
import { RiAddFill } from "react-icons/ri";
import { Link, Route, Routes } from "react-router-dom";
import AddPlaylist from "../components/Playlist/AddPlaylist";
import FilterDropdown from "../fragments/FilterDropdown";

function Playlist() {
  const { setIsLoading, onAlert } = useAuth();
  const { getPlaylist, getMedia } = useStorage();
  const [playlist, setPlaylists] = useState(null);
  // const [modal, setModal] = useState({
  //   toggle: false,
  //   title: null,
  // });

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("normal");
  const [filter, setFilter] = useState("all");
  const [file, setFile] = useState(null);
  const [pages, setPages] = useState(1);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setIsLoading(true);
  }, [setIsLoading]);

  useEffect(() => {
    const setup = async () => {
      const response = await getPlaylist();
      const mediaFiles = await getMedia();
      let mappedPlaylist = response.map((res) => {
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
                  return item.contentType.startsWith("image");
                }
              }
            }),
        };
      });
      setPlaylists(mappedPlaylist);
      setIsLoading(false);
    };
    setup();
    // const realtimeData = setInterval(setup, 3000);
    // return () => {
    //   clearInterval(realtimeData);
    // };
  }, [window.location.pathname, onAlert]);
  return (
    <>
      <div className="transition-all w-full flex flex-col gap-4">
        <Routes>
          <Route
            exact
            path="/"
            element={
              <>
                <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                  <PageHeader>Manage Playlists</PageHeader>
                  <Button
                    as={Link}
                    to="./new_playlist"
                    className="focus:ring-0 w-fit bg-white"
                    color="transparent"
                    theme={lightButton}
                    onClick={() => {
                      localStorage.removeItem("playlistData");
                    }}
                  >
                    <RiAddFill />
                    <p>New Playlist</p>
                  </Button>
                </div>
                {playlist && (
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
                    <div className="w-full overflow-x-auto rounded-md shadow-md">
                      <PlaylistTable data={playlist} />
                    </div>
                  </>
                )}
              </>
            }
          />
          <Route path="/:_id" element={<AddPlaylist />} />
          <Route path="/new_playlist" element={<AddPlaylist />} />
        </Routes>
      </div>
    </>
  );
}

export default Playlist;
