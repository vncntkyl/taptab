import PropTypes from "prop-types";
import PlayerGridItem from "../fragments/PlayerGridItem";

function PlayerGrid({ players, setModal }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,_minmax(100%,_1fr))] md:grid-cols-[repeat(auto-fit,_minmax(350px,_1fr))] gap-4 justify-items-center animate-fade">
      {players && players.length !== 0 ? (
        players.map((player) => {
          return <PlayerGridItem key={player._id} player={player} />;
        })
      ) : (
        <div className="flex gap-1 justify-center items-center bg-slate-200 w-full text-center p-2 rounded-md text-slate-400 font-semibold">
          <p>
            No players found. You may click the &apos;+ New Player&apos; button
            or{" "}
          </p>
          <button
            type="button"
            className="underline text-main font-semibold"
            onClick={() =>
              setModal({
                toggle: true,
                title: "New Player",
              })
            }
          >
            click here
          </button>
          <p>to create your first player.</p>
        </div>
      )}
    </div>
  );
}

PlayerGrid.propTypes = {
  players: PropTypes.array,
  setModal: PropTypes.func,
};

export default PlayerGrid;
