import classNames from "classnames";
import PropTypes from "prop-types";
import SidebarLink from "./SidebarLink";
import { AiFillDashboard } from "react-icons/ai";

function Sidebar({ toggle }) {
  return (
    <div
      className={classNames(
        "w-sidebar transition-all duration-150 bg-sidebar min-h-[calc(100vh_-_3.125rem)] sm:min-h-[calc(100vh_-_3.5rem)] bg-dark text-white flex flex-col gap-2 z-[11]",
        toggle
          ? "translate-x-0 lg:translate-x-[unset] lg:w-[52px] lg:overflow-hidden lg:gap-2"
          : "translate-x-[-100%] lg:translate-x-[unset] lg:w-sidebar"
      )}
    >
      <SidebarLink
        name="dashboard"
        toggle={toggle}
        icon={
          <AiFillDashboard
            className={classNames(
              "text-xl h-[50px] w-[50px] p-2 transition-all duration-200",
              toggle && "lg:h-[45px] lg:w-[45px] pl-4"
            )}
          />
        }
      />
    </div>
  );
}

Sidebar.propTypes = {
  toggle: PropTypes.bool,
};

export default Sidebar;
