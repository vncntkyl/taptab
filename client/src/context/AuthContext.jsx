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
  const retrieveUsers = async () => {
    try {
      const response = await axios.get(url.users);
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
    const currentuser = user;
    const middleInitial =
      currentuser.middle_name.length > 0 &&
      currentuser.middle_name.substring(0, 1) + ". ";
    return currentuser.first_name + " " + middleInitial + currentuser.last_name;
  };

  useEffect(() => {
    if (localStorage.getItem("user")) {
      setUser(JSON.parse(localStorage.getItem("user")));
    }
  }, []);
  const values = {
    user,
    navigate,
    loginUser,
    getUser,
    retrieveUsers,
    getFullName,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};
