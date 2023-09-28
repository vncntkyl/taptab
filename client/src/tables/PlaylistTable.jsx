import PropTypes from "prop-types";
import { Table } from "flowbite-react";
import { values as useFunction } from "../context/Functions";
import PlaylistImage from "../components/Playlist/PlaylistImage";
import { Link } from "react-router-dom";
import { format } from "date-fns";

function PlaylistTable({ data }) {
  const { capitalize, convertText } = useFunction();
  const headers = ["name", "details", "action"];

  return (
    <Table className="border bg-white rounded-md">
      <Table.Head className="shadow-md">
        {headers.map((header, index) => {
          return (
            <Table.HeadCell key={index} className="text-main">
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
                    <Link to="/" className="text-main">
                      {media.playlist_name}
                    </Link>
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
                    {format(new Date(media.time_created),"MMMM dd, yyy',' h:mm a")}
                  </p>
                </Table.Cell>
                <Table.Cell></Table.Cell>
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
