import { Alert, Button, Label, TextInput } from "flowbite-react";
import bg from "../assets/background.svg";
import logo from "../assets/TapTabLogo.png";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { RiInformationFill } from "react-icons/ri";
import { mainButton } from "../context/CustomThemes";
function Login() {
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });
  const [onError, toggleError] = useState(false);

  const { loginUser, navigate } = useAuth();
  const customTextInputTheme = {
    field: {
      input: {
        colors: {
          gray: "bg-gray-50 border-gray-300 text-gray-900 focus:border-secondary focus:ring-secondary dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-secondary dark:focus:ring-secondary",
        },
        withAddon: {
          off: "rounded-sm",
        },
      },
    },
  };
  const updateForm = (value) => {
    return setLoginForm((current) => {
      return { ...current, ...value };
    });
  };

  const login = async (e) => {
    e.preventDefault();

    const response = await loginUser(loginForm);

    if (response._id) {
      localStorage.setItem("last_login", Date.now());
      localStorage.setItem("user", JSON.stringify(response));
      navigate("/");
    } else {
      toggleError(true);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <>
      <div
        className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-white dark:bg-matte-black"
        style={{ backgroundImage: `url('${bg}')` }}
      >
        <div className="flex flex-col items-center justify-center gap-2 w-full px-4">
          <img
            src={logo}
            alt=""
            className="max-w-[200px] md:max-w-[250px] transition-all"
          />
          <span className="text-2xl font-semibold text-center">
            Taptab Content Manager
          </span>
          <form
            onSubmit={login}
            className="min-w-full sm:min-w-[350px] bg-white shadow-md border-2 p-4 flex flex-col items-center gap-2 rounded-md transition-all"
          >
            <h3 className="text-xl font-semibold">Login</h3>
            <div className="w-full">
              <Label htmlFor="username" value="Username" />
              <TextInput
                type="text"
                value={loginForm.username}
                required
                theme={customTextInputTheme}
                onChange={(e) => updateForm({ username: e.target.value })}
              />
            </div>
            <div className="w-full">
              <Label htmlFor="password" value="Password" />
              <TextInput
                type="password"
                value={loginForm.password}
                required
                theme={customTextInputTheme}
                onChange={(e) => updateForm({ password: e.target.value })}
              />
            </div>
            <Link
              to={"/"}
              className="text-secondary-dark text-right w-fit float-right"
            >
              Forgot password?
            </Link>
            <Button
              className="mt-4 w-full"
              type="submit"
              color="transparent"
              theme={mainButton}
            >
              Login
            </Button>
          </form>
        </div>
      </div>
      {onError && (
        <Alert
          icon={RiInformationFill}
          color="failure"
          onDismiss={() => toggleError(false)}
          className="absolute top-[10%] left-[50%] translate-x-[-50%] animate-fade-fr-t whitespace-nowrap"
        >
          <span>
            <p>Username or password is incorrect.</p>
          </span>
        </Alert>
      )}
    </>
  );
}

export default Login;
