import classNames from "classnames";
import PropTypes from "prop-types";
import SidebarLink from "./SidebarLink";
import { BiSolidDashboard } from "react-icons/bi";
import { BsCloudSunFill, BsFillCalendarWeekFill, BsMegaphoneFill } from "react-icons/bs";
import { FaGear, FaTabletScreenButton, FaUsers } from "react-icons/fa6";
import { RiSurveyFill } from "react-icons/ri";
import { FaPhotoVideo } from "react-icons/fa";
import { MdOutlineVideoLibrary } from "react-icons/md";
import { FaMapMarkedAlt } from "react-icons/fa";
import {IoIosCloud} from "react-icons/io"

function Sidebar({ toggle, setToggle }) {
  const links = [
    {
      name: "media library",
      icon: FaPhotoVideo,
    },
    {
      name: "playlist",
      icon: MdOutlineVideoLibrary,
    },
    {
      name: "players",
      icon: FaTabletScreenButton,
    },
    {
      name: "planner",
      icon: BsFillCalendarWeekFill,
    },
    {
      name: "static ads",
      icon: BsMegaphoneFill,
    },
    { name: "geo tagged ads", icon: FaMapMarkedAlt },
    { name: "weather targeted ads", icon: BsCloudSunFill },
    { name: "user engagements", icon: RiSurveyFill },
    { name: "user accounts", icon: FaUsers },
    { name: "settings", icon: FaGear },
  ];
  return (
    <div
      className={classNames(
        "w-sidebar transition-all duration-150 bg-sidebar min-h-[calc(100vh_-_3.125rem)] sm:min-h-[calc(100vh_-_3.5rem)] bg-dark text-white flex flex-col gap-2 z-[12] pt-2",
        toggle
          ? "translate-x-0 lg:translate-x-[unset] lg:w-sidebar xl:w-sidebar-xl lg:overflow-hidden lg:gap-2"
          : "translate-x-[-100%] lg:translate-x-[unset] lg:w-sidebar xl:w-sidebar-xl"
      )}
    >
      <SidebarLink
        name="dashboard"
        toggle={toggle}
        toggler={setToggle}
        icon={BiSolidDashboard}
      />
      <Divider>Media</Divider>
      {links.splice(0, 4).map((link) => {
        const { name, icon: Icon } = link;
        return (
          <SidebarLink
            key={name}
            name={name}
            toggle={toggle}
            toggler={setToggle}
            icon={Icon}
          />
        );
      })}
      <Divider>Others</Divider>
      {links.splice(0, 4).map((link) => {
        const { name, icon: Icon } = link;
        return (
          <SidebarLink
            key={name}
            name={name}
            toggle={toggle}
            toggler={setToggle}
            icon={Icon}
          />
        );
      })}
      <Divider>System</Divider>
      {links.splice(0, 3).map((link) => {
        const { name, icon: Icon } = link;
        return (
          <SidebarLink
            key={name}
            name={name}
            toggle={toggle}
            toggler={setToggle}
            icon={Icon}
          />
        );
      })}
    </div>
  );
}
const Divider = ({ children, className }) => {
  return (
    <p
      className={classNames(
        "mx-2 uppercase font-bold text-main tracking-wider text-sm",
        className
      )}
    >
      {children}
    </p>
  );
};
Divider.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};
Sidebar.propTypes = {
  toggle: PropTypes.bool,
  setToggle: PropTypes.func,
};

export default Sidebar;
