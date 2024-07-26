import { useEffect, useState } from "react";
import PageHeader from "../fragments/PageHeader";
import { Button } from "flowbite-react";
import { lightButton } from "../context/CustomThemes";
import { MdAdd } from "react-icons/md";
import { usePlayers } from "../context/PlayersContext";
import PlayerModal from "../components/Players/PlayerModal";
import PlayerGrid from "../tables/PlayerGrid";
import PlayerVIewOptions from "../components/Players/PlayerVIewOptions";
import PlayerTable from "../tables/PlayerTable";
import { useFunction } from "../context/Functions";

function Players() {
  const { getPlayers, addPlayer } = usePlayers();
  const [modal, setModal] = useState({
    toggle: false,
    title: null,
  });
  const { generateRandomString } = useFunction();
  const [defaultView, setDefaultView] = useState("grid");
  const [players, setPlayers] = useState(null);
  const [player, setPlayer] = useState({
    device_name: "",
    isOnline: "",
    status: "ready",
    date_created: new Date(),
    last_location: [
      {
        long: 0,
        lat: 0,
        timestamp: new Date(),
      },
    ],
    driver: {
      name: "",
      contact_no: "",
      vehicle: "",
      vehicle_model: "",
      plate_number: "",
    },
  });

  const handleSubmission = async (e) => {
    e.preventDefault();
    const playerData = { ...player };
    playerData.access_code = generateRandomString(6);
    console.log(playerData);
    const response = await addPlayer(playerData);
    console.log(response);
  };

  useEffect(() => {
    const setup = async () => {
      const response = await getPlayers();
      setPlayers(response);
    };
    setup();
    const realtimeData = setInterval(setup, 5000);

    return () => {
      clearInterval(realtimeData);
    };
  }, [getPlayers]);
  return (
    <>
      <div className="transition-all w-full flex flex-col gap-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
          <PageHeader>Manage Players</PageHeader>
          <Button
            className="focus:ring-0 w-fit bg-white"
            onClick={() =>
              setModal({
                toggle: true,
                title: "New Player",
              })
            }
            color="transparent"
            theme={lightButton}
          >
            <MdAdd />
            <p>New Player</p>
          </Button>
        </div>
        <div className="bg-white rounded p-2 flex flex-col gap-4">
          <PlayerVIewOptions
            setDefaultView={setDefaultView}
            defaultView={defaultView}
          />
          {players && (
            <div className="overflow-x-auto">
              {defaultView === "grid" ? (
                <PlayerGrid players={players} setModal={setModal} />
              ) : (
                <PlayerTable data={players} />
              )}
            </div>
          )}
        </div>
      </div>
      <PlayerModal
        modal={modal}
        setModal={setModal}
        setPlayer={setPlayer}
        handleSubmission={handleSubmission}
        player={player}
      />
    </>
  );
}

export default Players;
