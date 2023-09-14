import { Button, Label, Modal, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { BsPersonFillAdd } from "react-icons/bs";
import { useUsers } from "../context/UserContext";
import PageHeader from "../fragments/PageHeader";
import UsersTable from "../tables/UsersTable";
import { values as useFunction } from "../context/Functions";
import {
  lightButton,
  mainButton,
  modalTheme,
  redMainButton,
  selectTheme,
  textTheme,
} from "../context/CustomThemes";
import { useAuth } from "../context/AuthContext";
function UserAccounts() {
  const { capitalize, convertText } = useFunction();
  const {
    registerUser,
    updateUser,
    setAlert,
    setIsLoading,
    deleteUser,
    deactivateUser,
    reactivateUser,
  } = useAuth();
  const { getUsers } = useUsers();
  const [users, setUsers] = useState(null);
  const [modal, setModal] = useState({
    toggle: false,
    title: null,
  });
  const [user, setUser] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    position: "",
    role: "",
    email_address: "",
  });

  const handleUserRegistration = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    const response = await registerUser(user);
    const alert = {
      isOn: true,
      type: "success",
      message:
        "You have successfully registered " +
        user.first_name +
        ". Their login credentials are their surname in lowercase.",
    };

    setModal({
      title: null,
    });
    if (response.acknowledged) {
      setAlert(alert);
    } else {
      alert.type = "failure";
      alert.message = response;
      setAlert(alert);
    }
    setTimeout(() => setIsLoading(false), 500);
  };
  const handleUpdateInformation = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    const response = await updateUser(user);
    const alert = {
      isOn: true,
      type: "success",
      message:
        "You have successfully updated the account of " + user.first_name + ".",
    };

    setModal({
      toggle: false,
      title: null,
    });
    if (response.acknowledged) {
      setAlert(alert);
    } else {
      alert.type = "failure";
      alert.message = response;
      setAlert(alert);
    }
    setTimeout(() => setIsLoading(false), 500);
  };
  const handleAccountDeletion = async () => {
    setIsLoading(true);
    const response = await deleteUser(user._id);
    const alert = {
      isOn: true,
      type: "success",
      message: "You have successfully deleted " + user.first_name + ".",
    };
    setModal({
      toggle: false,
      title: "",
    });
    if (response.acknowledged) {
      setAlert(alert);
    } else {
      alert.type = "failure";
      alert.message = response;
      setAlert(alert);
    }
    setTimeout(() => setIsLoading(false), 500);
  };
  const handleAccountDeactivation = async () => {
    setIsLoading(true);
    const response = await deactivateUser(user._id);
    const alert = {
      isOn: true,
      type: "success",
      message: "You have successfully deactivated " + user.first_name + ".",
    };
    setModal({
      toggle: false,
      title: "",
    });
    if (response.acknowledged) {
      setAlert(alert);
    } else {
      alert.type = "failure";
      alert.message = response;
      setAlert(alert);
    }
    setTimeout(() => setIsLoading(false), 500);
  };
  const handleAccountReactivation = async () => {
    setIsLoading(true);
    const response = await reactivateUser(user._id);
    const alert = {
      isOn: true,
      type: "success",
      message: "You have successfully reactivated " + user.first_name + ". Updates will show in few seconds.",
    };
    setModal({
      toggle: false,
      title: "",
    });
    if (response.acknowledged) {
      setAlert(alert);
    } else {
      alert.type = "failure";
      alert.message = response;
      setAlert(alert);
    }
    setTimeout(() => setIsLoading(false), 500);
  };

  const onInputChange = (e, key) => {
    setUser((current) => {
      return {
        ...current,
        [key]: e.target.value,
      };
    });
  };

  useEffect(() => {
    const setup = async () => {
      const response = await getUsers();
      setUsers(response);
    };
    setup();
    const realtimeData = setInterval(setup, 5000);

    return () => {
      clearInterval(realtimeData);
    };
  }, [getUsers]);
  return (
    users && (
      <>
        <div className="transition-all w-full flex flex-col gap-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
            <PageHeader>Manage User Accounts</PageHeader>
            <Button
              className="focus:ring-0 w-fit bg-white"
              onClick={() =>
                setModal({
                  toggle: true,
                  title: "Create User",
                })
              }
              color="transparent"
              theme={lightButton}
            >
              <BsPersonFillAdd />
              <p>Create User</p>
            </Button>
          </div>
          <div className="w-full overflow-x-auto rounded-md shadow-md">
            <UsersTable users={users} setItem={setUser} setModal={setModal} />
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
            setUser({
              first_name: "",
              middle_name: "",
              last_name: "",
              position: "",
              role: "",
              email_address: "",
            });
          }}
          size="lg"
          theme={modalTheme}
        >
          <Modal.Header className="border-b-default-dark p-3 px-4">
            {modal.toggle && capitalize(modal.title) + " User"}
          </Modal.Header>
          <Modal.Body>
            {["delete", "deactivate", "reactivate"].includes(modal.title) ? (
              <div>
                <p>
                  {modal.title === "delete" ? (
                    <>Confirm account deletion for </>
                  ) : modal.title === "deactivate" ? (
                    <>Confirm account deactivation for </>
                  ) : (
                    <>Confirm account reactivation for </>
                  )}
                  <strong>{user.first_name}</strong>?
                </p>
                <Button
                  className="mt-4 w-fit float-right"
                  color="transparent"
                  theme={redMainButton}
                  onClick={
                    modal.title === "delete"
                      ? handleAccountDeletion
                      : modal.title === "deactivate"
                      ? handleAccountDeactivation
                      : handleAccountReactivation
                  }
                >
                  {capitalize(modal.title)}
                </Button>
              </div>
            ) : (
              <form
                className="flex flex-col gap-2"
                onSubmit={
                  user._id ? handleUpdateInformation : handleUserRegistration
                }
              >
                {Object.keys(user)
                  .filter((key) => key !== "_id")
                  .map((key, index) => {
                    return (
                      <div className="w-full" key={index}>
                        <Label
                          htmlFor={key}
                          value={
                            capitalize(convertText(key)) +
                            (key === "middle_name" ? " (optional)" : "")
                          }
                        />
                        {key === "role" ? (
                          <Select
                            id={key}
                            onChange={(e) => onInputChange(e, key)}
                            required
                            theme={selectTheme}
                          >
                            <option
                              selected={user[key] === ""}
                              defaultChecked
                              disabled
                            >
                              --Select Role--
                            </option>
                            {["administrator", "manager", "contributor"].map(
                              (opt, index) => {
                                return (
                                  <option
                                    key={index}
                                    value={opt}
                                    selected={user[key] === opt}
                                  >
                                    {capitalize(opt)}
                                  </option>
                                );
                              }
                            )}
                          </Select>
                        ) : (
                          <TextInput
                            onChange={(e) => onInputChange(e, key)}
                            type="text"
                            value={user[key]}
                            required={key !== "middle_name"}
                            theme={textTheme}
                          />
                        )}
                      </div>
                    );
                  })}
                <Button
                  className="mt-4 w-full"
                  type="submit"
                  color="transparent"
                  theme={mainButton}
                >
                  Save User
                </Button>
              </form>
            )}
          </Modal.Body>
        </Modal>
      </>
    )
  );
}

export default UserAccounts;
