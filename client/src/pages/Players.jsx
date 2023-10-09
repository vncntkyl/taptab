import { useEffect, useState } from "react";
import PageHeader from "../fragments/PageHeader";
import { Badge, Button, Label, Modal, TextInput } from "flowbite-react";
import {
  iconButton,
  lightButton,
  mainButton,
  modalTheme,
  textTheme,
} from "../context/CustomThemes";
import { MdAdd, MdTableRows } from "react-icons/md";
import { GoDotFill } from "react-icons/go";
import classNames from "classnames";
import { values as useFunction } from "../context/Functions";
import { BiSolidGridAlt } from "react-icons/bi";
import { usePlayers } from "../context/PlayersContext";

function Players() {
  const { getPlayers, addPlayer } = usePlayers();
  const { capitalize, convertText } = useFunction();
  const [modal, setModal] = useState({
    toggle: false,
    title: null,
  });
  const [defaultView, setDefaultView] = useState("grid");
  const [players, setPlayers] = useState(null);
  const [player, setPlayer] = useState({
    device_name: "",
    isOnline: false,
    status: "available",
    date_created: new Date(),
    last_location: {
      long: 0,
      lat: 0,
    },
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
    const response = await addPlayer(player);
    console.log(response);
  };

  const onInputChange = (e) => {
    const key = e.target.id;
    const value = e.target.value;

    setPlayer((current) => {
      if (key.includes("driver")) {
        // Handle nested object
        const id = key.split("-")[1];
        return {
          ...current,
          driver: {
            ...current.driver,
            [id]: value,
          },
        };
      } else {
        // Handle other keys
        return {
          ...current,
          [key]: value,
        };
      }
    });
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
      <Modal
        position="center"
        show={modal.toggle}
        dismissible
        onClose={() => {
          setModal({
            toggle: false,
            title: null,
          });

          setPlayer({
            device_name: "",
            isOnline: false,
            status: "available",
            date_created: new Date(),
            last_location: {
              long: 0,
              lat: 0,
            },
            driver: {
              name: "",
              contact_no: "",
              vehicle: "",
              vehicle_model: "",
              plate_number: "",
            },
          });
        }}
        size="lg"
        theme={modalTheme}
      >
        <Modal.Header className="border-b-default-dark p-3 px-4">
          {modal.toggle && "Add New " + capitalize(modal.title)}
        </Modal.Header>
        <Modal.Body>
          <form className="flex flex-col gap-1" onSubmit={handleSubmission}>
            <div>
              <Label htmlFor="device_name" value="Device Name" />
              <TextInput
                id="device_name"
                onChange={(e) => onInputChange(e, "device_name")}
                type="text"
                sizing="sm"
                value={player.device_name}
                required
                theme={textTheme}
              />
            </div>
            <h1 className="font-bold pt-2">Driver Details</h1>
            <div>
              <Label htmlFor="driver-name" value="Name" />
              <TextInput
                id="driver-name"
                onChange={(e) => onInputChange(e, "driver-name")}
                type="text"
                sizing="sm"
                value={player.driver.name}
                required
                theme={textTheme}
              />
            </div>
            <div>
              <Label htmlFor="driver-contact_no" value="Contact Number" />
              <TextInput
                id="driver-contact_no"
                onChange={(e) => onInputChange(e, "driver-contact_no")}
                type="text"
                sizing="sm"
                value={player.driver.contact_no}
                required
                theme={textTheme}
              />
            </div>
            <div>
              <Label htmlFor="driver-vehicle" value="Vehicle" />
              <TextInput
                id="driver-vehicle"
                onChange={(e) => onInputChange(e, "driver-vehicle")}
                type="text"
                sizing="sm"
                value={player.driver.vehicle}
                required
                theme={textTheme}
              />
            </div>
            <div>
              <Label htmlFor="driver-vehicle_model" value="Vehicle Model" />
              <TextInput
                id="driver-vehicle_model"
                onChange={(e) => onInputChange(e, "driver-vehicle_model")}
                type="text"
                sizing="sm"
                value={player.driver.vehicle_model}
                required
                theme={textTheme}
              />
            </div>
            <div>
              <Label htmlFor="driver-plate_number" value="Plate Number" />
              <TextInput
                id="driver-plate_number"
                onChange={(e) => onInputChange(e, "driver-plate_number")}
                type="text"
                sizing="sm"
                value={player.driver.plate_number}
                required
                theme={textTheme}
              />
            </div>
            <Button
              className="mt-4 w-full disabled:bg-black"
              type="submit"
              color="transparent"
              theme={mainButton}
            >
              Save
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Players;
