import PropTypes from "prop-types";
import { Button, Table } from "flowbite-react";
import { useFunction } from "../context/Functions";
import PlaylistImage from "../components/Playlist/PlaylistImage";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { iconButton } from "../context/CustomThemes";
import { RiDeleteBinFill, RiEditBoxFill } from "react-icons/ri";

function PlaylistTable({ data }) {
  const { convertText } = useFunction();
  const headers = ["name", "details", "action"];

  return (
    <Table className="bg-white rounded-md">
      <Table.Head className="shadow-md sticky top-0 z-[5]">
        {headers.map((header, index) => {
          return (
            <Table.HeadCell key={index} className="text-main" align="center">
              {convertText(header)}
            </Table.HeadCell>
          );
        })}
      </Table.Head>
      <Table.Body className="divide-y">
        {data.length > 0 ? (
          data.map((media) => {
            const mediaFiles = media.media_items;
            return (
              <Table.Row key={media._id}>
                <Table.Cell align="left">
                  <div className="flex items-center gap-2">
                    <PlaylistImage media={media} mediaFiles={mediaFiles} />
                    <div>
                      <Link
                        to={`./${convertText(media.playlist_name)}`}
                        className="text-main"
                      >
                        {media.playlist_name}
                      </Link>
                      <p>
                        <span>Usage: </span>
                        {media.usage}
                      </p>
                    </div>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <p>
                    <span>Category: </span>
                    {media.category}
                  </p>
                  <p>
                    <span>Media Entries: </span>
                    {media.media_items.length}
                  </p>
                  <p>
                    <span>Date Modified: </span>
                    {format(
                      new Date(media.time_created),
                      "MMMM dd, yyy',' h:mm a"
                    )}
                  </p>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center justify-center gap-1">
                    <Button
                      as={Link}
                      to={`./${convertText(media.playlist_name)}`}
                      className="focus:ring-0 w-fit bg-white"
                      color="transparent"
                      size="sm"
                      theme={iconButton}
                      onClick={() => {
                        localStorage.setItem(
                          "playlistData",
                          JSON.stringify(media)
                        );
                      }}
                    >
                      <RiEditBoxFill className="text-lg" />
                    </Button>
                    <Button
                      className="focus:ring-0 w-fit bg-white"
                      color="transparent"
                      size="sm"
                      theme={iconButton}
                      onClick={() => {
                        // setModal({
                        //   toggle: true,
                        //   title: "delete survey",
                        // });
                        // setItem(item);
                      }}
                    >
                      <RiDeleteBinFill className="text-lg text-c-red" />
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            );
          })
        ) : (
          <Table.Row>
            <Table.Cell colSpan={headers.length}>No playlist found</Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  );
}

PlaylistTable.propTypes = {
  data: PropTypes.array,
};

export default PlaylistTable;
