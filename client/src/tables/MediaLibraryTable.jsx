import PropTypes from "prop-types";
import { Button, Table } from "flowbite-react";
import { RiDeleteBinFill, RiEditBoxFill } from "react-icons/ri";
import { useFunction } from "../context/Functions";
import { iconButton } from "../context/CustomThemes";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

function MediaLibraryTable({ media, setItem, setModal, thumbnails }) {
  const { capitalize, convertText, removeSpaces } = useFunction();
  const headers = ["preview", "name", "details", "date_modified"];
  const navigate = useNavigate();

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
    <Table className="bg-white rounded-md">
      <Table.Head className="shadow-md sticky top-0 z-[5]">
        {headers.map((header, index) => {
          return (
            <Table.HeadCell
              key={index}
              className="text-main"
              onClick={(e) => console.log(e.currentTarget)}
            >
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
              <Table.Row
                key={index}
                className="text-center hover:bg-slate-200 "
              >
                <Table.Cell
                  align="left"
                  className="cursor-pointer"
                  onClick={() => {
                    localStorage.setItem("media_id", item._id);
                    navigate(`./${removeSpaces(item.name)}`);
                  }}
                >
                  {tmb ? (
                    <img
                      src={getFileURL(tmb._urlID)}
                      alt=""
                      loading="lazy"
                      className="w-full max-w-[300px] rounded"
                    />
                  ) : (
                    <>No preview available</>
                  )}
                </Table.Cell>
                <Table.Cell>
                  <div className="flex flex-col text-start">
                    <p>
                      <span>Name: </span>
                      <span className="font-semibold">{item.name}</span>
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
                    {item.type !== "link" && (
                      <p>
                        <span>Size: </span>
                        {capitalize(convertSize(item.size))}
                      </p>
                    )}
                    {item.videoDuration && (
                      <p>
                        <span>Duration: </span>
                        {item.videoDuration}
                      </p>
                    )}
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
                      className="focus:ring-0 w-fit"
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
                      className="focus:ring-0 w-fit"
                      color="transparent"
                      size="sm"
                      theme={iconButton}
                      onClick={() => {
                        setModal({
                          toggle: true,
                          title: "delete",
                        });
                        setItem({
                          ...item,
                          thumbnail_src: thumbnails.find(
                            (thumbnail) => thumbnail._id == item._id
                          )?.fileName,
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
