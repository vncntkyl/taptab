import classNames from "classnames";
import PropTypes from "prop-types";

function PageHeader({ children, className }) {
  return (
    <h1
      className={classNames(
        "font-[800] text-2xl text-left text-matte-black",
        className
      )}
    >
      {children}
    </h1>
  );
}

PageHeader.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

export default PageHeader;
