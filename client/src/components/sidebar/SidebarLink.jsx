import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { values as Functions } from "../../context/Functions";

function SidebarLink({ name, icon, count = null, toggle }) {
  const { capitalize, convertText } = Functions;
  return (
    <Link
      to={
        name === "dashboard"
          ? `/${convertText(name)}`
          : `/dashboard/${convertText(name)}`
      }
      className="relative hover:bg-sidebar-highlight transition-all border-l-sidebar-highlight"
    >
      <div className="relative">
        {icon}
        {count !== null && (
          <span
            className={classNames(
              "absolute top-0 right-1 p-1 px-2 bg-green-400 rounded-full text-xs transition-all",
              toggle ? "opacity-0 lg:opacity-100" : "lg:opacity-0"
            )}
          >
            {count}
          </span>
        )}
      </div>
      <p
        className={classNames(
          "absolute top-[50%] translate-y-[-50%] left-[52px] text-sm whitespace-nowrap",
          count !== null
            ? "w-[calc(100%_-_52px)] pr-4 flex flex-row items-center justify-between"
            : ""
        )}
      >
        {capitalize(name)}
        {count !== null && (
          <span className="px-2 bg-green-400 rounded text-xs">{count}</span>
        )}
      </p>
    </Link>
  );
}
SidebarLink.propTypes = {
  name: PropTypes.string,
  icon: PropTypes.node,
  count: PropTypes.number,
  toggle: PropTypes.func,
};

export default SidebarLink;
