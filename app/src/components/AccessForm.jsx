/* eslint-disable react/prop-types */
import { useState, useRef } from "react";
import { TextInput, Button, Alert } from "flowbite-react";
import { iconButton, noBorderText } from "../functions/CustomThemes";
import { FaChevronRight } from "react-icons/fa";
import { CgDanger } from "react-icons/cg";
import { taptabLogo } from "../assets/index";
import { useSurvey } from "../functions/EngagementFunctions";
function AccessForm({ setLogin }) {
  const keyRef = useRef(null);
  const [onError, setError] = useState(null);
  const { loginTaptab, getIP } = useSurvey();
  const handleSubmit = async (e) => {
    e.preventDefault();

    const accessCode = keyRef.current.value;
    if (accessCode.length === 0) {
      setError("Please enter your access code.");
      return;
    }
    const deviceIP = await getIP();
    const response = await loginTaptab({
      accessCode: accessCode,
      IP: deviceIP,
    });
    console.log(response);
    if (typeof response === "string") {
      setError(response);
    } else {
      localStorage.setItem("driver", JSON.stringify(response));
      setLogin(false);
    }
  };

  return (
    <>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#fdfbfb] to-[#ebedee] animate-fade" />
      <div className="absolute top-1/2 left-1/2 bg-transparent -translate-x-1/2 -translate-y-1/2 w-full max-w-[425px] rounded-md">
        <div className="flex flex-col items-center tracking-wider text-lg font-bold text-secondary-light">
          <img src={taptabLogo} alt="Taptab Application Logo" />
          Welcome to Taptab Application!
        </div>
        <form className="p-2 flex flex-col gap-2" onSubmit={handleSubmit}>
          <div className="text-center">
            Please enter the 6-key access code provided by the administrator to
            use Taptab.
          </div>

          <div className="flex items-center gap-1 border-2 border-onyx-black border-opacity-60 rounded">
            <TextInput
              theme={noBorderText}
              maxLength={6}
              minLength={6}
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
  );
}

export default AccessForm;
