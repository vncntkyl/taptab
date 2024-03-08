import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { useFunction } from "../../context/Functions";

function SidebarLink({ name, icon: Icon, count = null, toggle, toggler }) {
  const { capitalize, convertText } = useFunction();
  return (
    <Link
      to={name === "dashboard" ? "/" : `/${convertText(name)}`}
      onClick={() => toggler(false)}
      className="relative hover:bg-secondary-dark transition-all py-1"
    >
      <div className="relative">
        <Icon className="text-xl h-[40px] w-[40px] p-2 transition-all duration-200" />
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
          "absolute top-[50%] translate-y-[-50%] left-[40px] whitespace-nowrap",
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
  toggle: PropTypes.bool,
  toggler: PropTypes.func,
};

export default SidebarLink;
