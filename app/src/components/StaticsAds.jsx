import classNames from "classnames";
import { useStaticAds } from "../functions/staticAdFunctions";
import useData from "../hooks/useData";
import PageHeader from "./PageHeader";
import AdContainer from "./StaticAds/AdContainer";
import PropTypes from "prop-types";

function StaticsAds({ className, toggle }) {
  const { getStaticAds } = useStaticAds();
  const [data] = useData(getStaticAds, true);

  return (
    <>
      <section
        className={classNames(
          "bg-default rounded p-2 overflow-x-auto overflow-y-hidden h-full",
          className
        )}
      >
        <div className="grid grid-cols-5 gap-2">
          {data &&
            data.map((item) => {
              return (
                <div
                  key={item._id}
                  className="relative group transition-all cursor-pointer"
                  onClick={() => toggle(item)}
                >
                  <AdContainer ad={item} />
                </div>
              );
            })}
        </div>
      </section>
    </>
  );
}

StaticsAds.propTypes = {
  className: PropTypes.string,
  toggle: PropTypes.func,
};

export default StaticsAds;
