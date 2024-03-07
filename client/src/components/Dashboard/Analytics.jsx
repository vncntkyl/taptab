import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useStorage } from "../../context/StorageContext";
import { Link } from "react-router-dom";
import { useFunction } from "../../context/Functions";
import { RiInformationLine } from "react-icons/ri";
import { Tooltip } from "flowbite-react";
import classNames from "classnames";

function Analytics() {
  const { getAnalytics, getMedia } = useStorage();
  const [adAnalytics, setAdAnalytics] = useState(null);
  const { removeSpaces, removeUnderscore } = useFunction();

  const retrieveTotalDuration = (logs) => {
    return logs.reduce((total, log) => (total += log.duration), 0) / 3600;
  };
  const retrieveAverageDuration = (logs) => {
    return (
      logs.reduce((sum, session) => sum + session.duration, 0) /
      logs.length /
      3600
    );
  };
  const calculateHasFinishedData = (logs) => {
    return logs.reduce(
      (counts, session) => {
        counts[session.has_finished ? "true" : "false"] += 1;
        return counts;
      },
      { true: 0, false: 0 }
    );
  };
  const retrieveAverageWatchHoursBeforeSkipping = (logs) => {
    return logs.length === 0
      ? 0 // Avoid division by zero
      : logs.reduce((sum, session) => sum + session.duration, 0) / logs.length;
  };
  const calculateFinishRate = (logs) => {
    // Initialize counts
    let trueCount = 0;
    let falseCount = 0;

    // Iterate over logs to accumulate counts
    logs.forEach((log) => {
      trueCount += log.skipToFinishRate.true
        ? parseInt(log.skipToFinishRate.true)
        : 0;
      falseCount += log.skipToFinishRate.false
        ? parseInt(log.skipToFinishRate.false)
        : 0;
    });

    // Calculate total percentage
    const totalPercentage = (trueCount / (trueCount + falseCount)) * 100;
    return totalPercentage;
  };

  const calculateTotalWatchHours = (analytics) => {
    return analytics.reduce((hours, ad) => (hours += ad.totalWatchHours), 0);
  };

  function WatchCards({ title, module }) {
    let count = 0;
    let countText;
    switch (module) {
      case "total":
        count = calculateTotalWatchHours(adAnalytics);
        break;
      case "avg":
        count = adAnalytics.reduce(
          (hours, ad) =>
            (hours = ad.avgWatchHours ? hours + ad.avgWatchHours : hours),
          0
        );
        break;
      case "percentage":
        count = calculateFinishRate(adAnalytics);
        break;
      case "impression":
        count = 25;
        break;
      case "engagement":
        count = 29;
        break;
    }

    if (!/impression|engagement/.test(module)) {
      count = showHours(count, module);
    }
    if (!/impression|engagement|percentage/.test(module)) {
      countText = count.split(" ");
      countText = (
        <>
          <span>{countText[0]}</span>
          <span className="text-lg">{countText[1]}</span>
          {" "}
          <span>{countText[2]}</span>
          <span className="text-lg">{countText[3]}</span>
        </>
      );
    } else {
      countText = count;
    }

    //Split the count by decimals and return the hours and mins if module is total or avg
    return (
      <div className="relative w-full min-w-[100%] sm:min-w-[49%] lg:min-w-[32.5%] xl:min-w-[19%] min-h-[150px] snap-start flex flex-col items-center justify-between gap-4 p-4 bg-white py-8 pt-10 text-secondary-light font-bold border-b-8 border-secondary">
        <p
          className={classNames(
            "whitespace-nowrap text-center",
            count.length > 10
              ? "text-3xl"
              : count.length > 5
              ? "text-4xl"
              : "text-5xl"
          )}
        >
          {countText}
        </p>
        <p className="capitalize text-center">{title}</p>
      </div>
    );
  }
  function showHours(count, module) {
    let hours = count.toFixed(2);
    let [hour, minute] = hours.split(".");

    if (["total", "avg"].includes(module)) {
      hour = parseInt(hour);
      minute = parseInt((minute / 100) * 60); // Convert remaining minutes to seconds

      if (hour > 0 && minute > 0) {
        hours = `${hour} hrs ${minute} mins`;
      } else if (hour > 0) {
        hours = `${hour} hrs`;
      } else {
        hours = `${minute} mins`;
      }
    } else {
      hours += "%";
    }
    return hours;
  }

  useEffect(() => {
    const setup = async () => {
      const response = await getAnalytics();
      const mediaItems = await getMedia();
      if (!response || !mediaItems) return;
      setAdAnalytics(
        response.map((res) => {
          const logs = res.logs;
          const media = mediaItems.find((item) => item._id === res.media_id);
          const totalAdDuration = retrieveTotalDuration(logs);
          const avgDuration = retrieveAverageDuration(logs);
          const hasFinishedCounts = calculateHasFinishedData(logs);
          const trueToFalseRatio = { ...hasFinishedCounts };
          const unfinishedLogs = logs.filter(
            (session) => !session.has_finished
          );

          hasFinishedCounts.true = (hasFinishedCounts.true / logs.length) * 100;
          hasFinishedCounts.false =
            (hasFinishedCounts.false / logs.length) * 100;
          const averageDurationForUnfinishedAds =
            retrieveAverageWatchHoursBeforeSkipping(unfinishedLogs);

          return {
            _id: res._id,
            media_id: res.media_id,
            media_name: media.name,
            totalWatchHours: totalAdDuration,
            avgWatchHours: avgDuration,
            skipToFinishedData: trueToFalseRatio,
            skipToFinishRate: hasFinishedCounts,
            skippedAvgDuration: averageDurationForUnfinishedAds,
          };
        })
      );
    };
    setup();
  }, []);
  return adAnalytics ? (
    <>
      <div className="flex flex-row w-full gap-8 py-4">
        <div className="w-1/2 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <p className="font-bold text-xl">TapTab Summary</p>
            <Tooltip
              content="Taptab summary shows the analytics from the past 28 days"
              placement="right"
            >
              <RiInformationLine className="text-xl" />
            </Tooltip>
          </div>
          <div className="flex shadow-md">
            <WatchCards title="total watch hours" module="total" />
            <WatchCards title="average watch hours" module="avg" />
            <WatchCards title="total watch percentage" module="percentage" />
          </div>
          <div className="flex gap-4">
            <WatchCards title="static ad impressions" module="impression" />
            <WatchCards title="static ad engagements" module="engagement" />
          </div>
        </div>
        <div className="w-1/2 flex flex-col gap-4">
          <div className="font-bold text-xl">Top Advertisements</div>
          <div className="bg-white w-full h-full p-4 shadow-md">
            {adAnalytics
              .filter((ad) => ad.totalWatchHours)
              .splice(0, 5)
              .sort((a, b) => b.totalWatchHours - a.totalWatchHours)
              .map((ad) => {
                return (
                  <Link
                    key={ad._id}
                    to={`./media_library/${removeSpaces(ad.media_name)}`}
                    className="group w-full flex justify-between items-center gap-4 p-4 hover:text-secondary hover:cursor-pointer"
                    onClick={() => {
                      localStorage.setItem("media_id", ad.media_id);
                    }}
                  >
                    <p className="whitespace-nowrap font-semibold text-xl">
                      {removeUnderscore(
                        ad.media_name.length > 20
                          ? ad.media_name.substring(0, 20) + "..."
                          : ad.media_name
                      )}
                    </p>
                    <div className="relative w-full h-[10px]">
                      <div
                        className="bg-secondary-dark group-hover:bg-secondary absolute top-0 h-full rounded-full"
                        style={{
                          width: `${(
                            (ad.totalWatchHours /
                              calculateTotalWatchHours(adAnalytics)) *
                            100
                          ).toFixed(2)}%`,
                          right: `${
                            showHours(ad.totalWatchHours, "total").length
                          }ch`,
                        }}
                      ></div>

                      <p className="absolute right-0 top-0 h-full flex items-center justify-center text-secondary-dark group-hover:text-secondary">
                        {showHours(ad.totalWatchHours, "total")}
                      </p>
                    </div>
                  </Link>
                );
              })}
          </div>
        </div>
      </div>
    </>
  ) : (
    <>Loading...</>
  );
}

Analytics.propTypes = {
  title: PropTypes.string,
  module: PropTypes.string,
};

export default Analytics;
