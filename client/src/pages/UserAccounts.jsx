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
  selectTheme,
  textTheme,
} from "../context/CustomThemes";
import { useAuth } from "../context/AuthContext";
function UserAccounts() {
  const { capitalize, convertText } = useFunction();
  const { registerUser, setAlert } = useAuth();
  const { getUsers } = useUsers();
  const [users, setUsers] = useState(null);
  const [modal, setModal] = useState({
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
            <UsersTable users={users} />
          </div>
        </div>
        <Modal
          position="center"
          show={modal.toggle}
          dismissible
          onClose={() =>
            setModal({
              toggle: false,
              title: null,
            })
          }
          size="lg"
          theme={modalTheme}
        >
          <Modal.Header className="border-b-default-dark p-3 px-4">
            {modal.title}
          </Modal.Header>
          <Modal.Body>
            <form
              className="flex flex-col gap-2"
              onSubmit={handleUserRegistration}
            >
              {Object.keys(user).map((key, index) => {
                return (
                  <div className="w-full" key={index}>
                    <Label htmlFor={key} value={capitalize(convertText(key))} />
                    {key === "role" ? (
                      <Select
                        id={key}
                        onChange={(e) => onInputChange(e, key)}
                        required
                        theme={selectTheme}
                      >
                        <option defaultChecked>--Select Role--</option>
                        {["administrator", "manager", "contributor"].map(
                          (opt, index) => {
                            return (
                              <option key={index} value={opt}>
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
                        required
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
          </Modal.Body>
        </Modal>
      </>
    )
  );
}

export default UserAccounts;
