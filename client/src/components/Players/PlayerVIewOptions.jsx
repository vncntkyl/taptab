import PropTypes from "prop-types";
import { Button } from "flowbite-react";
import { iconButton } from "../../context/CustomThemes";
import { MdTableRows } from "react-icons/md";
import classNames from "classnames";
import { BiSolidGridAlt } from "react-icons/bi";

function PlayerVIewOptions({ setDefaultView, defaultView }) {
  return (
    <div className="p-1 pb-0 flex items-center">
      <p className="text-sm">View: </p>
      <Button
        className="focus:ring-0 w-fit bg-white"
        color="transparent"
        size="sm"
        pill
        theme={iconButton}
        onClick={() => setDefaultView("grid")}
      >
        <BiSolidGridAlt
          className={classNames(
            "text-lg text-secondary-dark",
            defaultView === "grid"
              ? "text-secondary-dark"
              : "text-slate-400 hover:text-secondary-dark"
          )}
        />
      </Button>
      <Button
        className="focus:ring-0 w-fit bg-white"
        color="transparent"
        size="sm"
        pill
        theme={iconButton}
        onClick={() => setDefaultView("table")}
      >
        <MdTableRows
          className={classNames(
            "text-lg ",
            defaultView === "table"
              ? "text-secondary-dark"
              : "text-slate-400 hover:text-secondary-dark"
          )}
        />
      </Button>
    </div>
  );
}

PlayerVIewOptions.propTypes = {
  defaultView: PropTypes.string,
  setDefaultView: PropTypes.func,
};

export default PlayerVIewOptions;
