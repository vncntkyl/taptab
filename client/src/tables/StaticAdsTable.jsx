import PropTypes from "prop-types";
import { Button, Table } from "flowbite-react";
import {
  RiDeleteBinFill,
  RiEditBoxFill,
  RiExternalLinkFill,
} from "react-icons/ri";
import { useFunction } from "../context/Functions";
import { iconButton } from "../context/CustomThemes";
import { format } from "date-fns";

function StaticAdsTable({ ads, setItem, setModal }) {
  const { capitalize, convertText } = useFunction();
  const headers = ["image", "details", "description", "link", "date_modified"];

  const getFileURL = (objectName) => {
    return `https://storage.googleapis.com/tamc_advertisements/${objectName}`;
  };

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
        <Table.HeadCell className="text-main text-center">
          Actions
        </Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y">
        {ads.length > 0 ? (
          ads.map((item, index) => {
            return (
              <Table.Row key={index} className="text-center">
                <Table.Cell>
                  <img
                    src={getFileURL(item._urlID)}
                    alt=""
                    loading="lazy"
                    className="max-w-[250px] rounded"
                  />
                </Table.Cell>
                <Table.Cell>
                  <div className="flex flex-col text-start">
                    <p>
                      <span className="font-semibold">{item.name}</span>
                    </p>
                    <p>
                      <span>Status: </span>
                      {capitalize(item.status)}
                    </p>
                    <p>
                      <span>{item.views}</span>
                      <span> Interactions</span>
                    </p>
                  </div>
                </Table.Cell>
                <Table.Cell className="max-w-[250px] text-left">
                  <p>{item.description || "---"}</p>
                </Table.Cell>
                <Table.Cell className="text-left">
                  <a href={item.link} target="blank" className="relative group text-main">
                    {item.name}
                    <RiExternalLinkFill className="absolute bottom-0 right-0 hidden group-hover:block bg-white" />
                  </a>
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
                          title: "edit ad",
                        });
                        setItem({
                          _id: item._id,
                          name: item.name,
                          image: getFileURL(item._urlID),
                          category: item.category,
                          description: item.description,
                          link: item.link,
                          imagePath: item.fileName
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
                          title: "delete ad",
                        });
                        setItem(item);
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
            <Table.Cell colSpan={headers.length + 1}>No ads found</Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  );
}

StaticAdsTable.propTypes = {
  ads: PropTypes.array,
  setItem: PropTypes.func,
  setModal: PropTypes.func,
};

export default StaticAdsTable;
