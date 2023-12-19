import { useEffect, useState } from "react";
import PageHeader from "../fragments/PageHeader";
import { useStorage } from "../context/StorageContext";
import { useAuth } from "../context/AuthContext";
import PlaylistTable from "../tables/PlaylistTable";
import { Button, Pagination } from "flowbite-react";
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
  const [pages, setPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState([]);

  const onPageChange = (page) => {
    setCurrentPage(page);
  };
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
      setCategories([...new Set(mappedPlaylist.map((item) => item.category))]);
      if (search.length > 2) {
        mappedPlaylist = mappedPlaylist.filter((media) =>
          media.playlist_name.toLowerCase().includes(search.toLowerCase())
        );
      }
      if (sort !== "normal") {
        setCurrentPage(1);
        switch (sort) {
          case "A-Z_asc":
            mappedPlaylist = mappedPlaylist.sort((a, b) => {
              const itemA = a.playlist_name.toUpperCase();
              const itemB = b.playlist_name.toUpperCase();

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
            mappedPlaylist = mappedPlaylist.sort((a, b) => {
              const itemA = b.playlist_name.toUpperCase();
              const itemB = a.playlist_name.toUpperCase();

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
            mappedPlaylist = mappedPlaylist.sort((a, b) => {
              const dateA = new Date(a.time_created).getTime();
              const dateB = new Date(b.time_created).getTime();
              return dateA - dateB;
            });
            break;
          case "date_desc":
            mappedPlaylist = mappedPlaylist.sort((a, b) => {
              const dateA = new Date(a.time_created).getTime();
              const dateB = new Date(b.time_created).getTime();
              return dateB - dateA;
            });
            break;
          case "usage_asc":
            mappedPlaylist = mappedPlaylist.sort((a, b) => {
              return a.usage - b.usage;
            });
            break;
          case "usage_desc":
            mappedPlaylist = mappedPlaylist.sort((a, b) => {
              return b.usage - a.usage;
            });
            break;
        }
      }
      if (filter !== "all") {
        setCurrentPage(1);
        mappedPlaylist = mappedPlaylist.filter(
          (media) => media.category.toLowerCase() === filter.toLowerCase()
        );
      }
      const size = mappedPlaylist.length;
      const pageCount = Math.ceil(size / 5);
      setPages(pageCount);
      const limit = (currentPage - 1) * 5;
      setPlaylists(mappedPlaylist.splice(limit, 5));
      setIsLoading(false);
    };
    setup();
    // const realtimeData = setInterval(setup, 3000);
    // return () => {
    //   clearInterval(realtimeData);
    // };
  }, [onAlert, sort, filter, search, setIsLoading, currentPage]);
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
                    <div className="w-full overflow-x-auto rounded-md shadow-md flex flex-col gap-2 max-h-[70vh]">
                      <PlaylistTable data={playlist} />
                    </div>
                    <Pagination
                      totalPages={pages}
                      currentPage={currentPage}
                      onPageChange={onPageChange}
                    />
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
