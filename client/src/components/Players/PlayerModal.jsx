import PropTypes from "prop-types";
import { Button, Label, Modal, TextInput } from "flowbite-react";
import { mainButton, modalTheme, textTheme } from "../../context/CustomThemes";
import { useFunction } from "../../context/Functions";

function PlayerModal({ modal, setModal, setPlayer, handleSubmission, player }) {
  const { capitalize } = useFunction();
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

  return (
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
  );
}

PlayerModal.propTypes = {
  modal: PropTypes.object,
  setModal: PropTypes.func,
  setPlayer: PropTypes.func,
  handleSubmission: PropTypes.func,
  player: PropTypes.object,
};

export default PlayerModal;
