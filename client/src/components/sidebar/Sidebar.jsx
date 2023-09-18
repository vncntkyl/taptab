import classNames from "classnames";
import PropTypes from "prop-types";
import SidebarLink from "./SidebarLink";
import { BiSolidDashboard } from "react-icons/bi";
import { BsFillCalendarWeekFill, BsMegaphoneFill } from "react-icons/bs";
import { FaTabletScreenButton, FaUsers } from "react-icons/fa6";
import { RiSurveyFill } from "react-icons/ri";
import { FaPhotoVideo } from "react-icons/fa";
import { MdOutlineVideoLibrary, MdWarning } from "react-icons/md";

function Sidebar({ toggle, setToggle }) {
  const sidebarLinkClassname =
    "text-xl h-[40px] w-[40px] p-2 transition-all duration-200"; /* toggle && "lg:h-[45px] lg:w-[45px] pl-4"*/

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
        icon={<BiSolidDashboard className={classNames(sidebarLinkClassname)} />}
      />
      <Divider>Media</Divider>
      <SidebarLink
        name="media library"
        toggle={toggle}
        toggler={setToggle}
        icon={<FaPhotoVideo className={classNames(sidebarLinkClassname)} />}
      />
      <SidebarLink
        name="playlist"
        toggle={toggle}
        toggler={setToggle}
        icon={
          <MdOutlineVideoLibrary className={classNames(sidebarLinkClassname)} />
        }
      />
      <SidebarLink
        name="planner"
        toggle={toggle}
        toggler={setToggle}
        icon={
          <BsFillCalendarWeekFill
            className={classNames(sidebarLinkClassname)}
          />
        }
      />
      <SidebarLink
        name="players"
        toggle={toggle}
        toggler={setToggle}
        icon={
          <FaTabletScreenButton className={classNames(sidebarLinkClassname)} />
        }
      />
      <Divider>Others</Divider>
      <SidebarLink
        name="static ads"
        toggle={toggle}
        toggler={setToggle}
        icon={<BsMegaphoneFill className={classNames(sidebarLinkClassname)} />}
      />
      <SidebarLink
        name="user engagement"
        toggle={toggle}
        toggler={setToggle}
        icon={<RiSurveyFill className={classNames(sidebarLinkClassname)} />}
      />
      <SidebarLink
        name="incident reports"
        toggle={toggle}
        toggler={setToggle}
        icon={<MdWarning className={classNames(sidebarLinkClassname)} />}
      />
      <SidebarLink
        name="user accounts"
        toggle={toggle}
        toggler={setToggle}
        icon={<FaUsers className={classNames(sidebarLinkClassname)} />}
      />
    </div>
  );
}

Sidebar.propTypes = {
  toggle: PropTypes.bool,
  setToggle: PropTypes.func,
};

export default Sidebar;
