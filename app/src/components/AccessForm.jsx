import { TextInput, Button, Alert } from "flowbite-react";
import { iconButton, noBorderText } from "../functions/CustomThemes";
import { FaChevronRight } from "react-icons/fa";
import { CgDanger } from "react-icons/cg";
import { developmentRoutes as url } from "../functions/Routes";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
function AccessForm() {
  const keyRef = useRef(null);
  const [newLogin, setNewLogin] = useState(false);
  const [onError, setError] = useState(null);
  const version = useRef(1);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const accessCode = keyRef.current.value;

    const response = await axios.post(
      url.players + "login",
      {
        key: accessCode,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (typeof response.data === "string") {
      setError(response.data);
    } else {
      console.log(response.data);
      version.current += 1;
      const dbRequest = indexedDB.open("accounts", version.current);

      dbRequest.onupgradeneeded = (e) => {
        const db = e.target.result;
        // Check if the object store already exists before creating it
        if (!db.objectStoreNames.contains("players")) {
          db.createObjectStore("players", { keyPath: "key" });
        }
      };
      dbRequest.onsuccess = (e) => {
        const database = e.target.result;

        if (!database.objectStoreNames.contains("players")) {
          database.createObjectStore("players", { keyPath: "key" });
        }
        const transaction = database.transaction("players", "readwrite");
        const players = transaction.objectStore("players");
        const data = { key: "data", value: JSON.stringify(response.data) }; // Replace with your data
        const addRequest = players.add(data);
        addRequest.onsuccess = () => {
          console.log("Data inserted successfully:", data);
          setNewLogin(false);
        };

        addRequest.onerror = (event) => {
          console.error("Error inserting data:", event.target.error);
        };
      };
    }
  };

  useEffect(() => {
    const request = indexedDB.open("accounts");
    request.onsuccess = (e) => {
      const db = e.target.result;

      version.current = db.version;
      if (!db.objectStoreNames.contains("players")) {
        setNewLogin(true);
      } else {
        const transaction = db.transaction("players", "readonly");
        const players = transaction.objectStore("players");

        const getRequest = players.get("data");
        getRequest.onsuccess = (event) => {
          const data = event.target.result;
          if (data) {
            // Data was found and retrieved successfully
            // console.log("Retrieved data:", data);
          } else {
            // Data with the specified key was not found
            setNewLogin(true);
          }
        };
      }
    };
  }, []);

  return (
    newLogin && (
      <>
        <div className="absolute top-0 left-0 w-full h-full bg-[#00000050]" />
        <div className="absolute top-1/2 left-1/2 bg-white -translate-x-1/2 -translate-y-1/2 w-full max-w-[425px] rounded-md">
          <div id="header" className="p-2 border-b border-default-dark">
            Welcome to Taptab!
          </div>
          <form className="p-2 flex flex-col gap-2" onSubmit={handleSubmit}>
            <div className="text-center">
              Please enter the 6-key access code provided by the administrator
              to use Taptab.
            </div>

            <div className="flex items-center gap-1 border-2 border-onyx-black border-opacity-60 rounded">
              <TextInput
                theme={noBorderText}
                maxLength={6}
                minLength={6}
                required
                onClick={() => setError(null)}
                className="w-full"
                ref={keyRef}
                placeholder="Ex. E9Ujs1"
              />
              <Button
                className="disabled:bg-black rounded-full ring-0 focus:ring-0 text-onyx-black hover:text-secondary-dark"
                type="submit"
                color="transparent"
                theme={iconButton}
              >
                <FaChevronRight />
              </Button>
            </div>
            {onError && (
              <Alert
                color={onError.includes("used") ? "warning" : "failure"}
                className="p-2 animate-fade"
              >
                <div className="flex items-center gap-1">
                  <CgDanger className="text-xl" />
                  <p>{onError}</p>
                </div>
              </Alert>
            )}
          </form>
        </div>
      </>
    )
  );
}

export default AccessForm;
