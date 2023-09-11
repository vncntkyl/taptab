import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import Sidebar from "../components/sidebar/Sidebar";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard";
import Breadcrumb from "../fragments/Breadcrumb";
import UserAccounts from "./UserAccounts";

function Home() {
  const [users, setUsers] = useState(null);
  const [onSidebar, toggleSidebar] = useState(false);
  const { retrieveUsers, navigate } = useAuth();

  useEffect(() => {
    const setup = async () => {
      const response = await retrieveUsers();
      setUsers(response);
    };
    setup();
  }, [retrieveUsers]);

  const logoutUser = () => {
    localStorage.clear();
    navigate("/login");
  };
  if (!localStorage.getItem("user")) {
    navigate("/login");
    return;
  } else {
    return (
      <div className="min-h-screen relative bg-default">
        <div className="absolute top-navbar left-0 px-4 sm:pt-2 lg:left-sidebar transition-all xl:left-sidebar-xl w-full  lg:w-[calc(100%_-_15rem)] xl:w-[calc(100%_-_18.75rem)]">
          <Breadcrumb />
          <Routes>
            <Route exact path="/" element={<Dashboard />} />
            <Route path="/media_library" element={<>media_library</>} />
            <Route path="/playlist" element={<>playlist</>} />
            <Route path="/planner" element={<>planner</>} />
            <Route path="/players" element={<>players</>} />
            <Route
              path="/surveys_and_feedbacks"
              element={<>surveys and feedbacks management page</>}
            />
            <Route path="/incident_reports" element={<>Incident Reports</>} />
            <Route path="/user_accounts" element={<UserAccounts />} />
          </Routes>
        </div>
        <Header logout={logoutUser} toggleSidebar={toggleSidebar} />
        {onSidebar && (
          <div
            className="fixed top-0 left-0 bg-[#00000025] w-screen h-screen pointer-events-auto lg:hidden"
            onClick={() => toggleSidebar(false)}
          />
        )}
        <Sidebar toggle={onSidebar} setToggle={toggleSidebar} />
        {/* {localStorage.getItem("user")} */}
      </div>
    );
  }
}

export default Home;
