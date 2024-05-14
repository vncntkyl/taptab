import PropTypes from "prop-types";
import { Button } from "flowbite-react";
import { mainButton } from "../../context/CustomThemes";
import { format, isThisMonth } from "date-fns";
import classNames from "classnames";

function CustomToolbar({ onNavigate, onView, date, view }) {
  const navigations = ["previous", "today", "next"];
  const views = ["month", "week", "day"];

  const handleNavigation = (where) => {
    onNavigate(where);
  };
  const handleViewChange = (view) => {
    onView(view);
  };
  return (
    <div className="flex flex-col md:flex-row items-center justify-between pb-2 gap-2">
      <Button.Group className="w-full md:w-fit">
        {navigations.map((loc, index) => {
          return (
            <Button
              className={classNames(
                "w-full disabled:bg-black capitalize hover:bg-secondary-dark",
                loc === "today" &&
                  isThisMonth(new Date(date)) &&
                  "bg-secondary-dark disabled:bg-secondary-dark"
              )}
              type="submit"
              color="transparent"
              key={index}
              disabled={loc === "today" && isThisMonth(new Date(date))}
              theme={mainButton}
              onClick={() =>
                handleNavigation(
                  loc === "previous" ? "PREV" : loc.toUpperCase()
                )
              }
            >
              {loc === "previous" ? "<" : loc === "next" ? ">" : loc}
            </Button>
          );
        })}
      </Button.Group>
      <h1 className="text-center font-bold text-secondary-dark">
        {format(new Date(date), "MMMM dd, yyyy")}
      </h1>
      <Button.Group className="w-full md:w-fit">
        {views.map((item, index) => {
          return (
            <Button
              className={classNames(
                "w-full disabled:bg-black capitalize hover:bg-secondary-dark",
                item === view && "bg-secondary-dark"
              )}
              type="submit"
              color="transparent"
              key={index}
              theme={mainButton}
              onClick={() => handleViewChange(item)}
            >
              {item}
            </Button>
          );
        })}
      </Button.Group>
    </div>
  );
}

CustomToolbar.propTypes = {
  onNavigate: PropTypes.func,
  onView: PropTypes.func,
  date: PropTypes.object,
  view: PropTypes.string,
};

export default CustomToolbar;
