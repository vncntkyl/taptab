import PropTypes from "prop-types";
import { Badge, Button, Checkbox, Table } from "flowbite-react";
import { RiDeleteBinFill, RiEditBoxFill } from "react-icons/ri";
import { values as useFunction } from "../context/Functions";
import { iconButton } from "../context/CustomThemes";
import { format } from "date-fns";

function MediaLibraryTable({ media, setItem, setModal, thumbnails }) {
  const { capitalize, convertText } = useFunction();
  const headers = ["preview", "name", "details", "date_modified"];

  const getFileURL = (objectName) => {
    return `https://storage.googleapis.com/tamc_advertisements/${objectName}`;
  };
  const convertSize = (size) => {
    if (size < 1048576) {
      return (size / 1000).toFixed(2) + "KB";
    } else {
      return (size / 1048576).toFixed(2) + "MB";
    }
  };

  return (
    <Table className="border bg-white rounded-md">
      <Table.Head className="shadow-md">
        <Table.HeadCell className="text-main text-center">
          <Checkbox />
        </Table.HeadCell>
        {headers.map((header, index) => {
          return (
            <Table.HeadCell key={index} className="text-main">
              {convertText(header)}
            </Table.HeadCell>
          );
        })}
        <Table.HeadCell className="text-main text-center">
          Actions
        </Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y">
        {media.length > 0 ? (
          media.map((item, index) => {
            const tmb = thumbnails.find(
              (thumbnail) => thumbnail._id == item._id
            );

            return (
              <Table.Row key={index} className="text-center">
                <Table.Cell>
                  <Checkbox />
                </Table.Cell>
                <Table.Cell>
                  <img src={getFileURL(tmb._urlID)} alt="" />
                </Table.Cell>
                <Table.Cell>
                  <div className="flex flex-col text-start">
                    <p>
                      <span>Name: </span>
                      {item.name}
                    </p>
                    <p>{capitalize(item.status)}</p>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex flex-col text-start text-xs">
                    <p>
                      <span>Type: </span>
                      {capitalize(item.type)}
                    </p>
                    <p>
                      <span>Size: </span>
                      {capitalize(convertSize(item.size))}
                    </p>
                    <p>
                      <span>Duration: </span>
                      {item.videoDuration}
                    </p>
                    <p>
                      <span>Category: </span>
                      {capitalize(item.category)}
                    </p>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex flex-col text-start text-xs">
                    <p>
                      <span>Date Uploaded: </span>
                      {format(new Date(item.timeCreated), "yyyy-MM-dd h:m a")}
                    </p>
                    <p>
                      <span>Date Updated: </span>
                      {format(new Date(item.timeUpdated), "yyyy-MM-dd h:mm a")}
                    </p>
                    <p>
                      <span>Used: </span>
                      {item.usage}
                    </p>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center justify-center gap-1">
                    <Button
                      className="focus:ring-0 w-fit bg-white"
                      color="transparent"
                      size="sm"
                      theme={iconButton}
                      onClick={() => {
                        setModal({
                          toggle: true,
                          title: "edit",
                        });
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
                        setModal({
                          toggle: true,
                          title: "delete",
                        });
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
            <Table.Cell colSpan={headers.length}>No media found</Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  );
}

MediaLibraryTable.propTypes = {
  media: PropTypes.array,
  thumbnails: PropTypes.array,
  setItem: PropTypes.func,
  setModal: PropTypes.func,
};

export default MediaLibraryTable;
