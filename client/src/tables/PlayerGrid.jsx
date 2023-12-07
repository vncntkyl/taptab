import PropTypes from "prop-types";
import { useFunction } from "../context/Functions";
import { GoDotFill } from "react-icons/go";
import classNames from "classnames";
import { Badge } from "flowbite-react";
import PlayerGridItem from "../fragments/PlayerGridItem";

function PlayerGrid({ players }) {
  const { capitalize, convertText } = useFunction();
  return (
    <div className="grid grid-cols-[repeat(auto-fit,_minmax(100%,_1fr))] md:grid-cols-[repeat(auto-fit,_minmax(350px,_1fr))] gap-4 justify-items-center animate-fade">
      {players && players.length !== 0 ? (
        players.map((player) => {
          return <PlayerGridItem key={player._id} player={player} />;
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
