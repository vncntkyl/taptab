import { useEffect, useState } from "react";
import { GrNext } from "react-icons/gr";
import { values as useFunction } from "../context/Functions";
import { Link } from "react-router-dom";
function Breadcrumb() {
  const { createBreadCrumb, capitalize, convertText, getPath } = useFunction();
  const [crumbs, setCrumbs] = useState([]);

  useEffect(() => {
    setCrumbs(createBreadCrumb(getPath()));
  }, [window.location.pathname]);
  return (
    <div className="flex flex-row items-center gap-1 font-semibold">
      {crumbs.map((crumb, index) => {
        const path = `/${crumbs.slice(0, index + 1).join("/")}`;
        return (
          <div key={index} className="flex flex-row items-center gap-1">
            {index !== crumbs.length - 1 ? (
              <>
                <Link to={path} className="underline text-sm text-black">
                  {capitalize(convertText(crumb))}
                </Link>
                <GrNext />
              </>
            ) : (
              <>
                <span className="text-main">
                  {capitalize(convertText(crumb))}
                </span>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
export default Breadcrumb;
