import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useStorage } from "../../context/StorageContext";
import { Link } from "react-router-dom";
import { useFunction } from "../../context/Functions";
import { RiInformationLine } from "react-icons/ri";
import { Tooltip } from "flowbite-react";
import { functions } from "./dashboard.functions";
import {
  CartesianGrid,
  ComposedChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip as Tip,
  Legend,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { format } from "date-fns";

function Analytics() {
  const { getAnalytics, getMedia, getStaticAnalyticsSummary } = useStorage();
  const [adAnalytics, setAdAnalytics] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [staticAnalytics, setStaticAnalytics] = useState(null);
  const { removeSpaces } = useFunction();
  const {
    calculateFinishRate,
    calculateHasFinishedData,
    calculateTotalWatchHours,
    calculateDailyWatchHours,
    retrieveAverageDuration,
    retrieveAverageWatchHoursBeforeSkipping,
    retrieveTotalDuration,
    showHours,
  } = functions;

  const COLORS = ["#7ecdef", "#119dd8"];
  function AnalyticsGraph({ data }) {
    const maxValue = Math.ceil(Math.max(...data.map((d) => d.total_runtime)));
    return (
      <ResponsiveContainer width="100%" height={600}>
        <ComposedChart width="100%" data={data}>
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#119dd8" stopOpacity={1} />
              <stop offset="95%" stopColor="#119dd8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis dataKey="date" tick={CustomTick} />
          <YAxis domain={[0, maxValue + 10]} />
          <Tip content={CustomTooltip} />
          <Legend content={CustomLegend} />
          <Area
            type="monotone"
            dataKey="total_runtime"
            stroke="#119dd8"
            fill="url(#colorUv)"
            strokeWidth={3}
          />
          <Area
            type="monotone"
            strokeWidth={3}
            dataKey="average_runtime"
            stroke="#1c4a5d"
          />
        </ComposedChart>
      </ResponsiveContainer>
    );
  }
  function AnalyticsCard({ title, children, tooltip }) {
    return (
      <Tooltip content={tooltip}>
        <div className="w-full max-w-[200px] p-2 border flex flex-col gap-1 relative group">
          <span className="font-bold text-sm">{title}</span>
          {children}
          {/* <RiQuestionLine className="text-lg absolute right-0 top-0 mt-2 mr-2 text-slate-500 group-hover:text-slate-800" /> */}
        </div>
      </Tooltip>
    );
  }
  const CustomTick = ({ x, y, payload }) => {
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="middle">
          {format(new Date(payload.value), "MMM dd")}
        </text>
      </g>
    );
  };
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const { total_runtime, average_runtime, finish_rate } =
        payload[0].payload;
      let runtime = Math.round(total_runtime) + "mins";
      if (total_runtime > 60) {
        runtime = `${parseInt(total_runtime / 60)}hr ${Math.round(
          total_runtime % 60
        )}mins`;
      }
      const Content = () =>
        total_runtime === "0.00" ? (
          <>
            <p className="label">{format(new Date(label), "MMMM d, yyyy")}</p>
            <p>No data found.</p>
          </>
        ) : (
          <>
            <p className="label">{format(new Date(label), "MMMM d, yyyy")}</p>
            <p className="intro">{`Total Runtime: ${runtime}`}</p>
            <p className="intro">{`Average Runtime: ${Math.round(
              average_runtime * 60
            )} secs`}</p>
            <p className="intro">{`Total Watch Percentage: ${finish_rate.toFixed(
              2
            )}%`}</p>
          </>
        );
      return (
        <div
          className="custom-tooltip"
          style={{
            backgroundColor: "#fff",
            padding: "10px",
            border: "1px solid #ccc",
          }}
        >
          <Content />
        </div>
      );
    }

    return null;
  };

  const CustomLegend = ({ payload }) => {
    return (
      <div className="flex items-center justify-center gap-4">
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center">
            <div
              style={{
                width: "10px",
                height: "10px",
                backgroundColor: entry.color,
                marginRight: "5px",
              }}
            ></div>
            <span className="capitalize">{entry.value.replace("_", " ")}</span>
          </div>
        ))}
      </div>
    );
  };

  useEffect(() => {
    const setup = async () => {
      const response = await getAnalytics();
      const mediaItems = await getMedia();
      const staticAdAnalytics = await getStaticAnalyticsSummary();

      if (!response || !mediaItems) return;

      setStaticAnalytics(staticAdAnalytics);
      setAnalyticsData(
        calculateDailyWatchHours(response.map((res) => res.logs))
      );
      setAdAnalytics(
        response.map((res) => {
          const logs = res.logs;
          const media = mediaItems.find((item) => item._id === res.media_id);
          const thumbnail = mediaItems.find(
            (item) =>
              item._id === res.media_id && item.fileName.startsWith("thumbnail")
          );
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
            ...media,
            media_name: media.name,
            thumbnail: thumbnail.signedUrl,
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
      <div className="grid gap-6 py-4 lg:grid-cols-[2fr_1fr]">
        <div className="w-full flex flex-col gap-4 lg:row-[1/3]">
          <div className="flex items-center gap-2">
            <p className="font-bold text-xl">TapTab Summary</p>
            <Tooltip
              content="Taptab summary shows the analytics from the past 28 days"
              placement="right"
            >
              <RiInformationLine className="text-xl" />
            </Tooltip>
          </div>
          <div className="bg-white p-4 shadow flex flex-col gap-4 h-full justify-between">
            <div className="flex gap-4">
              <AnalyticsCard title="Total Runtime" tooltip="Total ad runtime">
                <p className="text-2xl text-bold">
                  {showHours(calculateTotalWatchHours(adAnalytics), "total")}
                </p>
              </AnalyticsCard>
              <AnalyticsCard
                title="Average Runtime"
                tooltip="Average runtime of each ad before transitioning to the next ad"
              >
                <p className="text-2xl text-bold">
                  {Math.ceil(
                    (analyticsData.reduce(
                      (hours, ad) =>
                        (hours = parseFloat(ad.average_runtime)
                          ? hours + parseFloat(ad.average_runtime)
                          : hours),
                      0
                    ) *
                      60) /
                      analyticsData.filter(
                        (entry) => entry.total_runtime !== "0.00"
                      ).length
                  ) + " secs"}
                </p>
              </AnalyticsCard>
              <AnalyticsCard
                title="Total Watch Percentage"
                tooltip="Percentage of total ad runtime not skipped"
              >
                <p className="text-2xl text-bold">
                  {calculateFinishRate(adAnalytics).toFixed(2) || 0}%
                </p>
              </AnalyticsCard>
            </div>
            <AnalyticsGraph data={analyticsData} />
          </div>
        </div>
        <div className="w-full flex flex-col gap-4">
          <p className="font-bold text-xl">Static Ads Summary</p>
          <div className="bg-white p-4 shadow">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={staticAnalytics}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                >
                  {staticAnalytics.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend />
                <Tip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* TOP ADVERTISEMENT LIST */}
        <div className="w-full flex flex-col gap-4">
          <div className="font-bold text-xl">Top Advertisements</div>
          <div className="bg-white w-full h-full p-4 shadow-md flex flex-col gap-2">
            {adAnalytics
              .filter((ad) => ad.totalWatchHours)
              .sort((a, b) => b.totalWatchHours - a.totalWatchHours)
              .splice(0, 3)
              .map((ad) => {
                return (
                  <Link
                    key={ad._id}
                    to={`./media_library/${removeSpaces(ad.media_name)}`}
                    className="group p-2 flex gap-4 hover:bg-slate-100 rounded-lg"
                    // className="group w-full flex justify-between items-center gap-4 p-4 hover:text-secondary hover:cursor-pointer"
                    onClick={() => {
                      localStorage.setItem("media_id", ad._id);
                    }}
                  >
                    <img
                      src={ad.thumbnail}
                      className="w-full max-w-[90px] object-cover aspect-square rounded-md"
                      alt=""
                    />
                    <div className="w-full flex flex-col">
                      <h3 className="font-bold text-black">{ad.media_name}</h3>
                      <p>
                        View-through rate: {ad.skipToFinishRate.true.toFixed(2)}
                        %
                      </p>
                      <div className="w-full h-4 border mt-auto relative rounded-md overflow-hidden">
                        <div
                          className="group-hover:bg-secondary absolute top-0 h-full bg-secondary-dark"
                          style={{
                            width: `${(
                              (ad.totalWatchHours /
                                calculateTotalWatchHours(adAnalytics)) *
                              100
                            ).toFixed(2)}%`,
                          }}
                        ></div>
                      </div>
                      <p>{showHours(ad.totalWatchHours, "total")}</p>
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
  data: PropTypes.array,
  title: PropTypes.string,
  module: PropTypes.string,
  children: PropTypes.node,
  tooltip: PropTypes.string,
  x: PropTypes.number,
  y: PropTypes.number,
  payload: PropTypes.object,
};

export default Analytics;
