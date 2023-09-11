import { Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";

const App = () => {
  return (
    <>
      <AuthProvider>
        <Routes>
          <Route exact path="/*" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </AuthProvider>
    </>
  );
};

export default App;
