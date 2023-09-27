import PropTypes from "prop-types";
import { Table } from "flowbite-react";
import { values as useFunction } from "../context/Functions";
import PlaylistImage from "../components/Playlist/PlaylistImage";
import { Link } from "react-router-dom";

function PlaylistTable({ data }) {
  const { capitalize, convertText } = useFunction();
  const headers = ["name", "details", "date", "action"];

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
                  <div className="flex flex-col items-start gap-2">
                    <PlaylistImage media={media} mediaFiles={mediaFiles} />
                    <Link to="/" className="">
                      {media.playlist_name}
                    </Link>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex flex-col items-start gap-2">
                    <PlaylistImage media={media} mediaFiles={mediaFiles} />
                    <Link to="/" className="">
                      {media.playlist_name}
                    </Link>
                  </div>
                </Table.Cell>
                <Table.Cell></Table.Cell>
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
