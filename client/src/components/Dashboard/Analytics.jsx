import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useStorage } from "../../context/StorageContext";
import Card from "./Card";
import { useNavigate } from "react-router-dom";
import { useFunction } from "../../context/Functions";

function Analytics(props) {
  const { getAnalytics, getMedia } = useStorage();
  const [adAnalytics, setAdAnalytics] = useState(null);
  const navigate = useNavigate();
  const { removeSpaces } = useFunction();

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
      <div className="flex flex-col gap-2">
        <div>
          <div className="font-bold text-lg">TapTab Summary</div>
          <p>Last 28 days</p>
          <div className="flex gap-2 w-full overflow-x-auto snap-mandatory snap-x pt-2">
            <Card
              title="Total Watch Hours"
              count={`${calculateTotalWatchHours(adAnalytics).toFixed(
                2
              )} hours`}
            />
            <Card
              title="Average Watch Hours"
              count={`${adAnalytics
                .reduce(
                  (hours, ad) =>
                    (hours = ad.avgWatchHours
                      ? hours + ad.avgWatchHours
                      : hours),
                  0
                )
                .toFixed(2)} hour`}
            />
            <Card
              title="Total Watch Percentage"
              count={`${calculateFinishRate(adAnalytics)}%`}
            />
            <Card title="Static Ads Impressions" count={25} />
          </div>
        </div>
        <div>
          <div className="font-bold text-lg">Top Advertisements</div>
          <div className="bg-white w-full md:w-1/3 p-2">
            {adAnalytics
              .filter((ad) => ad.totalWatchHours)
              .splice(0, 5)
              .sort((a, b) => b.totalWatchHours - a.totalWatchHours)
              .map((ad) => {
                return (
                  <div
                    key={ad._id}
                    className="w-full flex justify-between items-center gap-2 p-2 hover:text-secondary hover:cursor-pointer"
                    onClick={() => {
                      localStorage.setItem("media_id", ad.media_id);
                      navigate(
                        `./media_library/${removeSpaces(ad.media_name)}`
                      );
                    }}
                  >
                    <p className="whitespace-nowrap font-semibold">
                      {ad.media_name.length > 20
                        ? ad.media_name.substring(0, 20) + "..."
                        : ad.media_name}
                    </p>
                    <div className="relative w-full h-[10px]">
                      <div
                        className="bg-secondary-dark absolute right-10 top-0 h-full rounded-full"
                        style={{
                          width: `${
                            (ad.totalWatchHours /
                              calculateTotalWatchHours(adAnalytics)) *
                            100
                          }%`,
                        }}
                      ></div>
                      <p className="absolute right-0 top-0 h-full flex items-center justify-center text-secondary-dark">
                        {ad.totalWatchHours.toFixed(2)}
                      </p>
                    </div>
                    {/* <Progress
                      theme={{ base: "w-full overflow-hidden rounded-full" }}
                      progress={
                        (ad.totalWatchHours /
                          calculateTotalWatchHours(adAnalytics)) *
                        100
                      }
                    /> */}
                  </div>
                );
              })}
          </div>
        </div>
        {/* <pre className="whitespace-pre-wrap">
          {JSON.stringify(adAnalytics, null, 2)}
        </pre> */}
      </div>
    </>
  ) : (
    <>Loading...</>
  );
}

Analytics.propTypes = {};

export default Analytics;
