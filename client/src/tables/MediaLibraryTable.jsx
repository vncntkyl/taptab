import PropTypes from "prop-types";
import { Table } from "flowbite-react";
import { RiDeleteBinFill, RiEditBoxFill } from "react-icons/ri";
import { useFunction } from "../context/Functions";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import classNames from "classnames";
import ActionButton from "../components/ActionButton";

function MediaLibraryTable({
  media,
  setItem,
  setModal,
  thumbnails,
  setCategory,
  filter,
}) {
  const { capitalize, convertText, removeSpaces } = useFunction();
  const headers = ["preview", "name", "details", "date_modified"];
  const navigate = useNavigate();

  const convertSize = (size) => {
    if (size < 1048576) {
      return (size / 1000).toFixed(2) + "KB";
    } else {
      return (size / 1048576).toFixed(2) + "MB";
    }
  };

  return (
    <Table className="bg-white rounded-md" hoverable>
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
              <Table.Row key={index} className="text-center">
                <Table.Cell
                  align="left"
                  className="cursor-pointer max-w-[300px]"
                  onClick={() => {
                    localStorage.setItem("media_id", item._id);
                    navigate(`./${removeSpaces(item.name)}`);
                  }}
                >
                  {tmb ? (
                    <img
                      src={tmb.signedUrl}
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
                      {/* <span>Name: </span> */}
                      <span className="font-bold">{item.name}</span>
                    </p>
                    <p
                      className={classNames(
                        "text-secondary font-semibold w-fit",
                        filter === "all" && "cursor-pointer"
                      )}
                      onClick={() => {
                        if (filter === "all") {
                          setCategory(item.category);
                        }
                      }}
                    >
                      {/* <span>Category: </span> */}
                      {capitalize(item.category)}
                    </p>
                    {/* <p>{capitalize(item.status)}</p> */}
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex flex-col text-start text-xs 2xl:text-sm">
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
                        {Math.round(item.videoDuration)}s
                      </p>
                    )}
                    <p>
                      <span>Used: </span>
                      {item.usage}
                    </p>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex flex-col text-start text-xs 2xl:text-sm">
                    <p>
                      {format(new Date(item.timeCreated), "yyyy-MM-dd h:m a")}
                    </p>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center justify-center gap-1">
                    <ActionButton
                      tooltip="Edit"
                      onClick={() => {
                        setModal({
                          toggle: true,
                          title: "edit",
                        });
                        setItem({
                          ...item,
                          thumbnail_src: thumbnails.find(
                            (thumbnail) => thumbnail._id == item._id
                          )?.fileName,
                        });
                      }}
                      icon={RiEditBoxFill}
                    />
                    <ActionButton
                      tooltip="Delete"
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
                      icon={RiDeleteBinFill}
                      color="text-c-red"
                    />
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
  setCategory: PropTypes.func,
  filter: PropTypes.string,
};

export default MediaLibraryTable;
