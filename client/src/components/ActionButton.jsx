import React from "react";
import PropTypes from "prop-types";
import { Button, Tooltip } from "flowbite-react";
import { iconButton } from "../context/CustomThemes";
import classNames from "classnames";
import { Link } from "react-router-dom";

function ActionButton({
  tooltip,
  icon: Icon,
  onClick,
  color,
  isLink = false,
  to = null,
}) {
  return (
    <Tooltip arrow={false} content={tooltip}>
      <Button
        as={isLink ? Link : "button"}
        to={isLink && to}
        className="focus:ring-0 w-fit z-[2]"
        color="transparent"
        size="sm"
        theme={iconButton}
        onClick={onClick}
      >
        <Icon className={classNames("text-xl", color)} />
      </Button>
    </Tooltip>
  );
}

ActionButton.propTypes = {
  tooltip: PropTypes.string,
  icon: PropTypes.func,
  onClick: PropTypes.func,
  color: PropTypes.string,
  isLink: PropTypes.bool,
  to: PropTypes.string,
};

export default ActionButton;
