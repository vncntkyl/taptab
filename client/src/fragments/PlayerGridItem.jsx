import PropTypes from "prop-types";
import { GoDotFill } from "react-icons/go";
import classNames from "classnames";
import { useFunction } from "../context/Functions";
import { Badge } from "flowbite-react";
import { differenceInMinutes } from "date-fns";

function PlayerGridItem({ player }) {
  const { capitalize } = useFunction();
  return (
    <div className="w-full min-h-[175px] shadow-md rounded bg-slate-200">
      <div className="flex items-center justify-between gap-1 p-1 text-white bg-slate-500 rounded-t">
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
        {}
        <p className="font-bold mr-auto text-lg">
          {capitalize(player.device_name)}
        </p>
        <Badge
          color={player.status === "connected" ? "success" : "warning"}
          className="capitalize"
        >
          {player.status}
        </Badge>
      </div>
      <div className="p-1 px-2 text-sm">
        <p>
          <span className="font-semibold">Location</span>:{" "}
          <a
            href={`https://maps.google.com?q=${player.last_location.lat}+${player.last_location.long}`}
            target="_blank"
            rel="noreferrer"
          >{`${player.last_location.lat},${player.last_location.long}`}</a>
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
