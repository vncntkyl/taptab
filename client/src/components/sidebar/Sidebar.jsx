import classNames from "classnames";
import PropTypes from "prop-types";
import SidebarLink from "./SidebarLink";
import { BiSolidDashboard } from "react-icons/bi";
import { BsFillCalendarWeekFill } from "react-icons/bs";
import { FaTabletScreenButton } from "react-icons/fa6";
import { RiSurveyFill } from "react-icons/ri";
import { FaPhotoVideo } from "react-icons/fa";
import { MdOutlineVideoLibrary } from "react-icons/md";

function Sidebar({ toggle }) {
  const sidebarLinkClassname =
    "text-xl h-[40px] w-[40px] p-2 transition-all duration-200"; /* toggle && "lg:h-[45px] lg:w-[45px] pl-4"*/
  return (
    <div
      className={classNames(
        "w-sidebar transition-all duration-150 bg-sidebar min-h-[calc(100vh_-_3.125rem)] sm:min-h-[calc(100vh_-_3.5rem)] bg-dark text-white flex flex-col gap-2 z-[12]",
        toggle
          ? "translate-x-0 lg:translate-x-[unset] lg:w-sidebar xl:w-sidebar-xl lg:overflow-hidden lg:gap-2"
          : "translate-x-[-100%] lg:translate-x-[unset] lg:w-sidebar xl:w-sidebar-xl"
      )}
    >
      <SidebarLink
        name="dashboard"
        toggle={toggle}
        icon={<BiSolidDashboard className={classNames(sidebarLinkClassname)} />}
      />
      <hr className="mx-2" />
      <SidebarLink
        name="media library"
        toggle={toggle}
        icon={<FaPhotoVideo className={classNames(sidebarLinkClassname)} />}
      />
      <SidebarLink
        name="playlist"
        toggle={toggle}
        icon={
          <MdOutlineVideoLibrary className={classNames(sidebarLinkClassname)} />
        }
      />
      <SidebarLink
        name="planner"
        toggle={toggle}
        icon={
          <BsFillCalendarWeekFill
            className={classNames(sidebarLinkClassname)}
          />
        }
      />
      <SidebarLink
        name="players"
        toggle={toggle}
        icon={
          <FaTabletScreenButton className={classNames(sidebarLinkClassname)} />
        }
      />
      <hr className="mx-2" />
      <SidebarLink
        name="surveys and feedbacks"
        toggle={toggle}
        icon={<RiSurveyFill className={classNames(sidebarLinkClassname)} />}
      />
    </div>
  );
}

Sidebar.propTypes = {
  toggle: PropTypes.bool,
};

export default Sidebar;
