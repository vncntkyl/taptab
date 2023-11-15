import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import Sidebar from "../components/sidebar/Sidebar";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard";
import Breadcrumb from "../fragments/Breadcrumb";
import UserAccounts from "./UserAccounts";
import { RiInformationFill } from "react-icons/ri";
import { Alert } from "flowbite-react";
import Loader from "../fragments/Loader";
import MediaLibrary from "./MediaLibrary";
import StaticAds from "./StaticAds";
import UserEngagement from "./UserEngagement";
import Playlist from "./Playlist";
import Planner from "./Planner";
import Players from "./Players";

function Home() {
  const [onSidebar, toggleSidebar] = useState(false);
  const { navigate, onAlert, setAlert, isLoading } = useAuth();

  const logoutUser = () => {
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    if (onAlert.isOn) {
      setTimeout(() => {
        setAlert({
          isOn: false,
          type: "info",
          message: "",
        });
      }, 3000);
    }
  }, [onAlert]);

  useEffect(() => {
    if (!window.location.pathname.includes("user_engagement")) {
      if (localStorage.getItem("activeTab")) {
        localStorage.removeItem("activeTab");
      }
    }
  }, [window.location.pathname]);
  if (!localStorage.getItem("user")) {
    navigate("/login");
    return;
  } else {
    return (
      <div className="max-h-screen relative bg-default">
        {isLoading && <Loader />}
        <div className="absolute max-h-[calc(100vh_-_4rem)] top-navbar left-0 px-4 pb-2 sm:pt-2 lg:left-sidebar transition-all xl:left-sidebar-xl w-full  lg:w-[calc(100%_-_15rem)] xl:w-[calc(100%_-_18.75rem)] overflow-y-auto">
          <Breadcrumb />
          <Routes>
            <Route exact path="/" element={<Dashboard />} />
            <Route path="/media_library" element={<MediaLibrary />} />
            <Route path="/playlist/*" element={<Playlist />} />
            <Route path="/planner" element={<Planner />} />
            <Route path="/players" element={<Players />} />
            <Route path="/static_ads" element={<StaticAds />} />
            <Route path="/user_engagement/*" element={<UserEngagement />} />
            {/* <Route path="/incident_reports" element={<>Incident Reports</>} /> */}
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
        {onAlert.isOn && (
          <Alert
            icon={RiInformationFill}
            color={onAlert.type}
            onDismiss={() =>
              setAlert({
                isOn: false,
                type: "info",
                message: "",
              })
            }
            className="absolute top-[10%] left-[50%] translate-x-[-50%] animate-fade-fr-t"
          >
            <span>
              <p className="w-[300px] text-center">{onAlert.message}</p>
            </span>
          </Alert>
        )}
      </div>
    );
  }
}

export default Home;
