/* eslint-disable react/prop-types */
import PropTypes from "prop-types";
import { Badge, Button, Table } from "flowbite-react";
import { useFunction } from "../context/Functions";
import { iconButton } from "../context/CustomThemes";
import { RiDeleteBinFill, RiEditBoxFill } from "react-icons/ri";
import classNames from "classnames";
import { GoDotFill, GoEye } from "react-icons/go";
import { useState } from "react";
import { differenceInMinutes } from "date-fns";

function PlayerTable({ data }) {
  const { convertText, capitalize } = useFunction();
  const [viewCode, showCode] = useState(
    data.map((item) => ({ _id: item._id, show: false }))
  );

  const LastLocation = ({ location_list }) => {
    const lastLocation = location_list[location_list.length - 1];
    return lastLocation.lat === 0 && lastLocation.long === 0 ? (
      "No record yet"
    ) : (
      <a
        href={`https://maps.google.com?q=${lastLocation.lat}+${lastLocation.long}`}
        target="_blank"
        rel="noreferrer"
      >{`${lastLocation.lat},${lastLocation.long}`}</a>
    );
  };
  const headers = ["status", "player", "driver", "action"];

  return (
    viewCode.length > 0 && (
      <Table className="border bg-white rounded-md animate-fade">
        <Table.Head className="shadow-md">
          {headers.map((header, index) => {
            return (
              <Table.HeadCell
                key={index}
                className="text-main w-fit"
                align="center"
              >
                {convertText(header)}
              </Table.HeadCell>
            );
          })}
        </Table.Head>
        <Table.Body className="divide-y">
          {data.length > 0 ? (
            data.map((player) => {
              return (
                <Table.Row key={player._id}>
                  <Table.Cell className="w-[50px]" align="center">
                    <GoDotFill
                      className={classNames(
                        "text-3xl",
                        player.isOnline !== ""
                          ? differenceInMinutes(
                              new Date(),
                              new Date(player.isOnline)
                            ) <= 10
                            ? "text-green-400"
                            : "text-red-400"
                          : "text-red-400"
                      )}
                    />
                  </Table.Cell>
                  <Table.Cell align="left" className="flex flex-col gap-1">
                    <Information label="Name" value={player.device_name} />
                    <Information
                      label="Location"
                      value={
                        <LastLocation location_list={player.last_location} />
                      }
                    />
                    <Information
                      label="Connectivity Status"
                      value={
                        <Badge
                          color={
                            player.status === "connected"
                              ? "success"
                              : "warning"
                          }
                          className="capitalize"
                        >
                          {player.status}
                        </Badge>
                      }
                    />
                    <Information
                      label="Access Code"
                      value={
                        <div className="flex flex-row gap-1">
                          <input
                            type={
                              viewCode.find((item) => item._id === player._id)
                                ? viewCode.find(
                                    (item) => item._id === player._id
                                  ).show === true
                                  ? "text"
                                  : "password"
                                : "password"
                            }
                            value={player.access_code}
                            className="p-0 px-1 max-w-[8ch] border-none focus:border-none focus:ring-0"
                            id={player._id}
                            readOnly
                          />
                          <Button
                            className="focus:ring-0 w-fit bg-white"
                            color="transparent"
                            size="sm"
                            theme={iconButton}
                            onClick={() => {
                              const updatedList = [...viewCode];
                              const thisPlayer = updatedList.find(
                                (item) => item._id === player._id
                              );
                              thisPlayer.show = !thisPlayer.show;
                              showCode(updatedList);
                            }}
                          >
                            <GoEye />
                          </Button>
                        </div>
                      }
                    />
                  </Table.Cell>
                  <Table.Cell align="left">
                    {Object.keys(player.driver).map((driver, index) => {
                      return (
                        <Information
                          key={index}
                          label={capitalize(convertText(driver))}
                          value={player.driver[driver]}
                        />
                      );
                    })}
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        className="focus:ring-0 w-fit bg-white"
                        color="transparent"
                        size="sm"
                        theme={iconButton}
                        onClick={() => {}}
                      >
                        <RiEditBoxFill className="text-lg" />
                      </Button>
                      <Button
                        className="focus:ring-0 w-fit bg-white"
                        color="transparent"
                        size="sm"
                        theme={iconButton}
                        onClick={() => {}}
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
              <Table.Cell colSpan={headers.length} align="center">
                No players found. Create now!
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    )
  );
}

function Information({ label, value }) {
  return (
    <div className="flex items-center gap-1 capitalize">
      <p className="font-bold whitespace-nowrap">{label}:</p>
      <div>{value}</div>
    </div>
  );
}
Information.propTypes = {
  label: PropTypes.string,
  value: PropTypes.node,
};
PlayerTable.propTypes = {
  data: PropTypes.array,
};
export default PlayerTable;
