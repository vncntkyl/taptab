import PropTypes from "prop-types";
import { Table } from "flowbite-react";
import {
  RiDeleteBinFill,
  RiEditBoxFill,
  RiExternalLinkFill,
} from "react-icons/ri";
import { useFunction } from "../context/Functions";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import ActionButton from "../components/ActionButton";

function GeoTaggedAdsTable({ ads, setItem, setModal }) {
  const { convertText, removeSpaces, getType } = useFunction();
  const headers = ["image", "details", "location", "link", "date_modified"];
  const navigate = useNavigate();
  const viewItem = (ad, isEdit) => {
    const id = ad._id;
    const name = ad.name;
    localStorage.setItem("geo_ad_id", id);
    const url = !isEdit
      ? `./${removeSpaces(name)}`
      : `./${removeSpaces(name)}/edit`;
    navigate(url);
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
        {ads?.length > 0 ? (
          ads.map((item, index) => {
            return (
              <Table.Row
                key={index}
                id={item._id}
                className="text-center hover:bg-slate-200"
              >
                <Table.Cell onClick={() => viewItem(item)} align="center">
                  {getType(item.signedUrl) === "video" ? (
                    <video className="max-w-[150px]" autoPlay muted loop>
                      <source src={item.signedUrl} />
                    </video>
                  ) : (
                    <img
                      src={item.signedUrl}
                      alt=""
                      loading="lazy"
                      className="max-w-[250px] rounded"
                    />
                  )}
                </Table.Cell>
                <Table.Cell onClick={() => viewItem(item)}>
                  <div className="flex flex-col text-start">
                    <p>
                      <span className="font-semibold">{item.name}</span>
                    </p>
                    <div>
                      <span className="font-semibold">Runtime Date: </span>
                      <p className="flex gap-1">
                        <span>
                          {format(
                            new Date(item.runtime_date?.from),
                            "MMMM dd, yyyy"
                          )}
                        </span>
                        <span>-</span>
                        <span>
                          {format(
                            new Date(item.runtime_date?.to),
                            "MMMM dd, yyyy"
                          )}
                        </span>
                      </p>
                    </div>
                  </div>
                </Table.Cell>
                <Table.Cell className="max-w-[250px] text-left">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${item.coords.lat}%2C${item.coords.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="relative group font-semibold"
                  >
                    {item.location}
                    <RiExternalLinkFill className="absolute bottom-0 right-0 hidden group-hover:block bg-white" />
                  </a>
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
                      tooltip="Edit"
                      onClick={() => viewItem(item, true)}
                      icon={RiEditBoxFill}
                    />
                    <ActionButton
                      tooltip="Delete"
                      onClick={() => {
                        setModal({
                          toggle: true,
                          title: "delete ad",
                        });
                        setItem(item);
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
            <Table.Cell colSpan={headers.length + 1}>No ads found</Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  );
}

GeoTaggedAdsTable.propTypes = {
  ads: PropTypes.array,
  setItem: PropTypes.func,
  setModal: PropTypes.func,
};

export default GeoTaggedAdsTable;
