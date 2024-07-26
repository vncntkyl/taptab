/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import { TextInput, Button, Alert, Spinner } from "flowbite-react";
import { iconButton, noBorderText } from "../functions/CustomThemes";
import { FaChevronRight } from "react-icons/fa";
import { CgDanger } from "react-icons/cg";
import { taptabLogo } from "../assets/index";
import { useSurvey } from "../functions/EngagementFunctions";
import classNames from "classnames";
function AccessForm() {
  const keyRef = useRef(null);
  const { loginTaptab, getIP, validateUser } = useSurvey();

  const [hide, setHide] = useState(false);
  const [onError, setError] = useState(null);
  const [newLogin, setLogin] = useState(true);
  const [showWelcome, toggleWelcome] = useState(false);
  const [clear, setClear] = useState(false);

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
    if (typeof response === "string") {
      setError(response);
    } else {
      localStorage.setItem("driver", JSON.stringify(response));
      setClear(true);
      setLogin(false);
    }
  };

  const handleLoad = () => {
    const clearScreen = setTimeout(() => {
      setClear(true);
    }, 1000);

    return () => clearTimeout(clearScreen);
  };

  useEffect(() => {
    const setup = async () => {
      let driver = localStorage.getItem("driver");
      if (driver) {
        driver = JSON.parse(driver);
        
        const response = await validateUser(driver);
        // console.log(response);
        if (typeof response === "object") {
          setLogin(false);
          localStorage.setItem("driver", JSON.stringify(response));
        }
      }
    };
    setup();
  }, [validateUser]);
  return (
    !hide && (
      <>
        <div
          className={classNames(
            "absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#fdfbfb] to-[#ebedee] z-10 transition-all duration-500",
            clear ? "opacity-0 pointer-events-none" : "opacity-100"
          )}
          onTransitionEnd={() => {
            setHide(true);
          }}
        />
        <div
          className={classNames(
            "absolute top-1/2 left-1/2 bg-transparent -translate-x-1/2 -translate-y-1/2 w-full max-w-[425px] rounded-md z-10 transition-all duration-500",
            clear ? "opacity-0 pointer-events-none" : "opacity-100"
          )}
        >
          <div className="flex flex-col items-center tracking-wider text-lg font-bold text-secondary-light">
            <img
              src={taptabLogo}
              alt="Taptab Application Logo"
              className="animate-splash"
              onAnimationEnd={() => toggleWelcome(true)}
            />
            <span
              className={classNames(
                "transition-all delay-300",
                showWelcome ? "opacity-100" : "opacity-0"
              )}
            >
              Welcome to Taptab Application!
            </span>
          </div>
          {newLogin ? (
            <form
              className={classNames(
                "p-2 flex flex-col gap-2 overflow-hidden transition-all duration-700 delay-700",
                showWelcome ? "max-h-32 opacity-100" : "max-h-0 opacity-0"
              )}
              onSubmit={handleSubmit}
            >
              <div className="text-center">
                Please enter the 6-key access code provided by the administrator
                to use Taptab.
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
          ) : (
            <div
              className={classNames(
                "w-full flex justify-center py-5 transition-all delay-500",
                showWelcome ? "opacity-100" : "opacity-0"
              )}
              onTransitionEnd={handleLoad}
            >
              <Spinner size="lg" />
            </div>
          )}
        </div>
      </>
    )
  );
}

export default AccessForm;
