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
import { useNavigate } from "react-router-dom";
import ActionButton from "../components/ActionButton";

function StaticAdsTable({ ads, setItem, setModal }) {
  const { capitalize, convertText, removeSpaces } = useFunction();
  const headers = ["image", "details", "description", "link", "date_modified"];
  const navigate = useNavigate();

  const viewItem = (ad) => {
    const id = ad._id;
    const name = ad.name;
    localStorage.setItem("static_id", id);
    navigate(`./${removeSpaces(name)}`);
  };
  return (
    <Table className="bg-white rounded-md">
      <Table.Head className="shadow-md sticky top-0 z-[5]">
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
            const thumbnail = item.images.find(
              (img) => img.type === "thumbnail"
            ).signedUrl;
            return (
              <Table.Row
                key={index}
                className="text-center hover:bg-slate-200 cursor-pointer"
              >
                <Table.Cell onClick={() => viewItem(item)}>
                  <img
                    src={thumbnail}
                    alt=""
                    loading="lazy"
                    className="max-w-[250px] rounded"
                  />
                </Table.Cell>
                <Table.Cell onClick={() => viewItem(item)}>
                  <div className="flex flex-col text-start">
                    <p>
                      <span className="font-semibold">{item.name}</span>
                    </p>
                    <p>
                      <span>Status: </span>
                      {capitalize(item.status)}
                    </p>
                    <p>
                      {/* <pre>{JSON.stringify(item.views)}</pre> */}
                      <span>{item.views?.length}</span>
                      <span> Interactions</span>
                    </p>
                  </div>
                </Table.Cell>
                <Table.Cell
                  className="max-w-[250px] text-left"
                  onClick={() => viewItem(item)}
                >
                  <p>{item.description || "---"}</p>
                </Table.Cell>
                <Table.Cell className="text-left">
                  <a
                    href={item.link}
                    target="blank"
                    className="relative group text-main"
                  >
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
                    <ActionButton
                      tooltip={"Edit"}
                      onClick={() => {
                        setModal({
                          toggle: true,
                          title: "edit ad",
                        });
                        setItem({
                          _id: item._id,
                          name: item.name,
                          image: item.signedUrl,
                          category: item.category,
                          description: item.description,
                          link: item.link,
                          imagePath: item.fileName,
                        });
                      }}
                      icon={RiEditBoxFill}
                    />
                    <ActionButton
                      tooltip={"Delete"}
                      icon={RiDeleteBinFill}
                      onClick={() => {
                        setModal({
                          toggle: true,
                          title: "delete ad",
                        });
                        setItem(item);
                      }}
                      color={"text-c-red"}
                    />
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
