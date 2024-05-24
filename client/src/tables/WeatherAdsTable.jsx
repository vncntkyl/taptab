import React from "react";
import PropTypes from "prop-types";
import { Button, Table } from "flowbite-react";
import { useFunction } from "../context/Functions";
import { RiDeleteBinFill, RiEditBoxFill } from "react-icons/ri";
import { iconButton } from "../context/CustomThemes";
import { format } from "date-fns";

function WeatherAdsTable({ ads, setModal, setItem }) {
  const { convertText, removeSpaces } = useFunction();
  const headers = ["image", "name", "details", "date_modified", "actions"];

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
                <Table.Cell className="max-w-[150px]">
                  <img
                    src={item.signedUrl}
                    alt=""
                    loading="lazy"
                    className="w-full rounded"
                  />
                </Table.Cell>
                <Table.Cell className="text-start">
                  <span className="font-bold">{item.name}</span>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex flex-col text-start gap-2">
                    <p>
                      <span>Shows on </span>
                      <span className="font-bold">{item.weather} weather</span>
                      <span> or when temperature reaches </span>
                      <span className="font-bold">
                        {item.trigger_temperature}&deg;{item.trigger_unit}
                      </span>
                      <span> and above. </span>
                    </p>
                    <div className="flex gap-2">
                      <span>Runtime Date: </span>
                      <p className="flex gap-1 font-bold">
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
                <Table.Cell>
                  <div className="flex flex-col text-start text-xs">
                    <p>
                      <span>Date Uploaded: </span>
                      {format(new Date(item.timeCreated), "yyyy-MM-dd h:m a")}
                    </p>
                    {/* <p>
                      <span>Date Updated: </span>
                      {format(new Date(item.timeUpdated), "yyyy-MM-dd h:mm a")}
                    </p> */}
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center justify-center gap-1">
                    <Button
                      className="focus:ring-0 w-fit z-[2]"
                      color="transparent"
                      size="sm"
                      theme={iconButton}
                      onClick={() => {
                        setModal({
                          toggle: true,
                          title: "edit ad",
                        });
                        setItem({
                          ...item,
                          image: item.signedUrl,
                        });
                      }}
                    >
                      <RiEditBoxFill className="text-lg" />
                    </Button>
                    <Button
                      className="focus:ring-0 w-fit z-[2]"
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

WeatherAdsTable.propTypes = {
  ads: PropTypes.array,
  setItem: PropTypes.func,
  setModal: PropTypes.func,
};

export default WeatherAdsTable;
