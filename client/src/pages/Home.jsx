import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import Sidebar from "../components/sidebar/Sidebar";

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
      <div className="min-h-screen">
        <Header logout={logoutUser} toggleSidebar={toggleSidebar} />
        <Sidebar toggle={onSidebar} />
        {onSidebar && (
          <div
            className="fixed top-0 left-0 bg-[#00000025] w-screen h-screen pointer-events-auto lg:hidden"
            onClick={() => toggleSidebar(false)}
          />
        )}
        {/* {localStorage.getItem("user")} */}
      </div>
    );
  }
}

export default Home;
