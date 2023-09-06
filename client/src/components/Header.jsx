import logo from "../assets/TapTabLogo.png";
import { Button, Dropdown, Navbar } from "flowbite-react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { GiHamburgerMenu } from "react-icons/gi";
import { useAuth } from "../context/AuthContext";

function Header({ toggleSidebar, logout }) {
  const { getFullName } = useAuth();
  return (
    <Navbar fluid className="sticky top-0 text-black z-[11] shadow-md">
      <Navbar.Brand className="flex items-center gap-2">
        <img alt="Kabalikat Logo" className="h-6 sm:h-9" src={logo} />
        <span className="self-center whitespace-nowrap text-lg font-medium dark:text-white hidden lg:block">
          Taptab Content Manager
        </span>
        <button
          type="button"
          onClick={() => toggleSidebar((current) => !current)}
        >
          <GiHamburgerMenu className="text-3xl" />
        </button>
      </Navbar.Brand>
      <div className="flex md:order-2">
        <Dropdown inline label="Username">
          <Dropdown.Header className="text-black">
            <span className="block truncate text-sm font-medium">
              {getFullName()}
            </span>
          </Dropdown.Header>
          <div className="flex flex-col px-4 gap-4 pb-4">
            <Link className="text-black">Account Settings</Link>
            <Button onClick={() => logout()}>Logout</Button>
          </div>
        </Dropdown>
      </div>
    </Navbar>
  );
}

Header.propTypes = {
  logout: PropTypes.func,
  toggleSidebar: PropTypes.func,
};

export default Header;
