import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import Sidebar from "../components/sidebar/Sidebar";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard";
import Breadcrumb from "../fragments/Breadcrumb";

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
      <div className="min-h-screen relative">
        <div className="absolute top-navbar left-0 px-4 sm:px-2 lg:left-sidebar transition-all xl:left-sidebar-xl">
          <Breadcrumb />
          <Routes>
            <Route exact path="/" element={<Dashboard />} />
            <Route exact path="/media_library" element={<>media_library</>} />
            <Route exact path="/playlist" element={<>playlist</>} />
            <Route exact path="/planner" element={<>planner</>} />
            <Route exact path="/players" element={<>players</>} />
            <Route
              exact
              path="/surveys_and_feedbacks"
              element={<>surveys and feedbacks management page</>}
            />
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
