/* eslint-disable react/prop-types */
import PropTypes from "prop-types";
import { GoDotFill } from "react-icons/go";
import classNames from "classnames";
import { useFunction } from "../context/Functions";
import { Badge } from "flowbite-react";
import { differenceInMinutes } from "date-fns";

function PlayerGridItem({ player }) {
  const { capitalize } = useFunction();

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
  return (
    <div className="w-full min-h-[175px] shadow-md rounded bg-slate-200">
      <div className="flex items-center justify-between p-2 text-white bg-slate-500 rounded-t">
        <GoDotFill
          className={classNames(
            "text-3xl",
            player.isOnline !== ""
              ? differenceInMinutes(new Date(), new Date(player.isOnline)) <= 10
                ? "text-green-400"
                : "text-red-400"
              : "text-red-400"
          )}
        />
        <p className="font-bold mr-auto text-lg mt-0.5">
          {capitalize(player.device_name)}
        </p>
        <Badge
          color={player.status === "connected" ? "success" : "warning"}
          className="capitalize"
          size="md"
        >
          {player.status}
        </Badge>
      </div>
      <div className="p-1 px-2 text-sm">
        <p>
          <span className="font-semibold">Location</span>:{" "}
          <LastLocation location_list={player.last_location} />
        </p>
        <div className="py-1 flex flex-col gap-1">
          <p>
            <span className="font-semibold">Driver</span>: {player.driver.name}
          </p>
          <p>
            <span className="font-semibold">Contact No</span>:{" "}
            {player.driver.contact_no}
          </p>
          <p className="pt-1">
            <span className="font-semibold">Type</span>:{" "}
            {capitalize(player.driver.vehicle)}
          </p>
          <p>
            <span className="font-semibold">Model</span>:{" "}
            {capitalize(player.driver.vehicle_model)}
          </p>
          <p>
            <span className="font-semibold">Plate No</span>:{" "}
            {capitalize(player.driver.plate_number)}
          </p>
        </div>
      </div>
    </div>
  );
}

PlayerGridItem.propTypes = {
  player: PropTypes.object,
};

export default PlayerGridItem;
