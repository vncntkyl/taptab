import { useEffect, useState } from "react";
import PageHeader from "../fragments/PageHeader";
import { Badge, Button } from "flowbite-react";
import { iconButton, lightButton } from "../context/CustomThemes";
import { MdAdd, MdTableRows } from "react-icons/md";
import { GoDotFill } from "react-icons/go";
import classNames from "classnames";
import { values as useFunction } from "../context/Functions";
import { BiSolidGridAlt } from "react-icons/bi";
import { usePlayers } from "../context/PlayersContext";

function Players() {
  const { getPlayers } = usePlayers();
  const { capitalize, convertText } = useFunction();
  const [modal, setModal] = useState({
    toggle: false,
    title: null,
  });
  const [defaultView, setDefaultView] = useState("grid");
  const [players, setPlayers] = useState(null);
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    const setup = async () => {
      const response = await getPlayers();
      setPlayers(response);
    };
    setup();
  }, []);
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
                title: "New Schedule",
              })
            }
            color="transparent"
            theme={lightButton}
          >
            <MdAdd />
            <p>New Device</p>
          </Button>
        </div>
        <div className="bg-white rounded p-2 flex flex-col gap-4 ">
          <div className="p-1 pb-0 flex items-center">
            <p className="text-sm">View: </p>
            <Button
              className="focus:ring-0 w-fit bg-white"
              color="transparent"
              size="sm"
              pill
              theme={iconButton}
              onClick={() => setDefaultView("table")}
            >
              <MdTableRows
                className={classNames(
                  "text-lg ",
                  defaultView === "table"
                    ? "text-secondary-dark"
                    : "text-slate-400 hover:text-secondary-dark"
                )}
              />
            </Button>
            <Button
              className="focus:ring-0 w-fit bg-white"
              color="transparent"
              size="sm"
              pill
              theme={iconButton}
              onClick={() => setDefaultView("grid")}
            >
              <BiSolidGridAlt
                className={classNames(
                  "text-lg text-secondary-dark",
                  defaultView === "grid"
                    ? "text-secondary-dark"
                    : "text-slate-400 hover:text-secondary-dark"
                )}
              />
            </Button>
          </div>
          {defaultView === "grid" ? (
            <>
              <div className="grid grid-cols-[repeat(auto-fit,_minmax(100%,_1fr))] md:grid-cols-[repeat(auto-fit,_minmax(350px,_1fr))] gap-4 justify-items-center">
                {players &&
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
                              player.isOnline
                                ? "text-green-400"
                                : "text-red-400"
                            )}
                          />
                          <p className="font-bold mr-auto text-lg">
                            {capitalize(convertText(player.device_name))}
                          </p>
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
                        </div>
                        <div className="p-1 px-2 text-sm">
                          <p>
                            <span className="font-semibold">Location</span>:{" "}
                            {`${player.last_location.long}, ${player.last_location.lat}`}
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
                  })}
              </div>
            </>
          ) : (
            <>Table</>
          )}
        </div>
      </div>
      {/* <pre>
        {JSON.stringify(
          [
            {
              _id: "2ejc94jedad03duf6icz0w8",
              device_name: "player_01",
              status: "online",
              date_created: "2023-05-29T10:40:29.00Z",
              driver: {
                name: "Jose Mari Chan",
                contact_no: "639490376783",
                vehicle: "car",
                vehicle_model: "honda civic",
                plate_number: "HYVGI3",
              },
            },
            {
              _id: "3gskl238dheuwhdc8fie01",
              device_name: "player_02",
              status: "offline",
              date_created: "2023-06-15T14:20:15.00Z",
              driver: {
                name: "Maria Cruz",
                contact_no: "639512345678",
                vehicle: "motorcycle",
                vehicle_model: "yamaha",
                plate_number: "XYZ123",
              },
            },
            {
              _id: "kjsdf39djaf9c3984jc3c8",
              device_name: "player_03",
              status: "online",
              date_created: "2023-07-03T09:15:42.00Z",
              driver: {
                name: "John Smith",
                contact_no: "639577788899",
                vehicle: "truck",
                vehicle_model: "ford",
                plate_number: "ABC789",
              },
            },
          ],
          null,
          4
        )}
      </pre> */}
    </>
  );
}

export default Players;
