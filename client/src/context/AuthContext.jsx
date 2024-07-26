import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { developmentRoutes as url } from "./Routes";
import { useNavigate } from "react-router-dom";
const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [onAlert, setAlert] = useState({
    isOn: false,
    type: "info",
    message: "",
  });
  const navigate = useNavigate();

  const loginUser = async (loginForm) => {
    try {
      const response = await axios.post(url.userLogin, loginForm, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.error(error);
    }
  };
  const registerUser = async (userForm) => {
    try {
      const response = await axios.post(url.userRegistration, userForm, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.error(error);
    }
  };
  const updateUser = async (userData) => {
    try {
      const data = { ...userData };
      delete data._id;

      const response = await axios.patch(url.users + userData._id, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.error(error);
    }
  };
  const manageStatus = async (_id, status) => {
    try {
      const response = await axios.patch(
        url.userManageStatus + _id,
        { status: status },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getUser = () => {
    return JSON.parse(localStorage.getItem("user"));
  };
  const getFullName = (user = JSON.parse(localStorage.getItem("user"))) => {
    if (!user) return;
    const { first_name, middle_name, last_name } = user;
    const middleInitial =
      middle_name.length > 0
        ? middle_name
            .split(" ")
            .map((str) => str[0] + ".")
            .join("")
            .toUpperCase()
        : "";
    return `${first_name} ${middleInitial} ${last_name}`;
  };

  useEffect(() => {
    if (localStorage.getItem("user")) {
      setUser(JSON.parse(localStorage.getItem("user")));
    }
  }, []);
  const values = {
    user,
    onAlert,
    isLoading,
    setIsLoading,
    setAlert,
    navigate,
    loginUser,
    registerUser,
    getUser,
    getFullName,
    updateUser,
    manageStatus,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};
