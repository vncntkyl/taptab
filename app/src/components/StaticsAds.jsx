import classNames from "classnames";
import { useStaticAds } from "../functions/staticAdFunctions";
import useData from "../hooks/useData";
import AdContainer from "./StaticAds/AdContainer";
import PropTypes from "prop-types";
// import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
// import { useRef } from "react";

function StaticsAds({ className, toggle }) {
  const { getStaticAds, updateStaticAdsAnalytics } = useStaticAds();
  const [data] = useData(getStaticAds, true);
  // const carousel = useRef();
  // const slideRight = () => {
  //   const container = carousel.current;
  //   container.scrollRight += 200;
  // };
  // const slideLeft = () => {
  //   const container = carousel.current;

  //   console.log(window.innerWidth);
  // };
  return (
    <>
      <section
        className={classNames(
          "bg-default rounded p-2 relative overflow-x-auto overflow-y-hidden h-full scrollbar-thin snap-x snap-mandatory",
          className
        )}
      >
        <div className="flex gap-2 transition-all">
          {data &&
            data.map((item) => {
              return (
                <div
                  key={item._id}
                  className="w-full min-w-[19.5%] relative group transition-all cursor-pointer snap-center last:pr-2"
                  onClick={async () => {
                    toggle(item);
                    await updateStaticAdsAnalytics(item);
                  }}
                >
                  <AdContainer ad={item} />
                </div>
              );
            })}
        </div>
        {/* <div className="relative" ref={carousel}>
          <button
            className="group fixed left-5 bottom-16 bg-[#0000003b] hover:bg-[#000000a9] p-2 rounded-full"
            onClick={slideLeft}
          >
            <MdNavigateBefore className="text-slate-400 group-hover:text-slate-50 text-4xl" />
          </button>
          <button
            className="group fixed right-5 bottom-16 bg-[#0000003b] hover:bg-[#000000a9] p-2 rounded-full"
            onClick={slideRight}
          >
            <MdNavigateNext className="text-slate-300 group-hover:text-slate-50 text-4xl" />
          </button>
        </div> */}
      </section>
    </>
  );
}

StaticsAds.propTypes = {
  className: PropTypes.string,
  toggle: PropTypes.func,
};

export default StaticsAds;
