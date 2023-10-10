import PropTypes from "prop-types";
import { useFunction } from "../context/Functions";
import { GoDotFill } from "react-icons/go";
import classNames from "classnames";
import { Badge } from "flowbite-react";

function PlayerGrid({ players }) {
  const { capitalize, convertText } = useFunction();
  return (
    <div className="grid grid-cols-[repeat(auto-fit,_minmax(100%,_1fr))] md:grid-cols-[repeat(auto-fit,_minmax(350px,_1fr))] gap-4 justify-items-center animate-fade">
      {players && players.length !== 0 ? (
        players.map((player) => {
          return (
            <div
              key={player._id}
              className="w-full min-h-[175px] shadow-md rounded bg-slate-200"
            >
              <div className="flex items-center justify-between gap-1 p-1 text-white bg-slate-500 rounded-t">
                <GoDotFill
                  className={classNames(
                    "text-3xl",
                    player.isOnline ? "text-green-400" : "text-red-400"
                  )}
                />
                <p className="font-bold mr-auto text-lg">
                  {capitalize(convertText(player.device_name))}
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
                    target="_blank" rel="noreferrer"
                  >{`${player.last_location.lat},${player.last_location.long}`}</a>
                </p>
                <div className="py-1 flex flex-col gap-1">
                  <p>
                    <span className="font-semibold">Driver</span>:{" "}
                    {player.driver.name}
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
        })
      ) : (
        <p className="bg-slate-400 w-full text-center p-2 rounded-md text-slate-600 font-semibold">
          No players found. Create now!
        </p>
      )}
    </div>
  );
}

PlayerGrid.propTypes = {
  players: PropTypes.array,
};

export default PlayerGrid;
