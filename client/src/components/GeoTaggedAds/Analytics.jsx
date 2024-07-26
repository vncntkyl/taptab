import { useEffect, useState } from "react";
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import classNames from "classnames";
import format from "date-fns/format";
import { Datepicker, Label, Radio, Select } from "flowbite-react";
import AnalyticsCard from "../../fragments/AnalyticsCard";
import { useStaticAds } from "../../context/StaticAdsContext";
import { PlayerCategoryLabel } from "../../fragments/CustomChartComponents";

function Analytics() {
  const { getGeoAdStatistics } = useStaticAds();
  const currentDate = new Date();
  const [analytics, setAnalytics] = useState();
  const [dates, setDates] = useState({
    from: format(
      new Date(new Date(currentDate).setDate(currentDate.getDate() - 30)),
      "yyyy-MM-dd"
    ),
    to: format(currentDate, "yyyy-MM-dd"),
  });
  const [dateFilter, setDateFilter] = useState("range");
  const [metricFilter, setMetricFilter] = useState("all");

  useEffect(() => {
    const id = localStorage.getItem("geo_ad_id");
    const setup = async () => {
      if (id) {
        const dateOptions = dateFilter === "all" ? "all" : dates;
        console.log(dateOptions);
        const response = await getGeoAdStatistics(id, dateOptions);
        setAnalytics(response);
      }
    };
    setup();
  }, [dateFilter, dates]);
  return (
    analytics && (
      <div className="space-y-6">
        <div>
          <h2 className="font-bold text-lg">Summary Overview</h2>
          <section className="flex gap-4">
            <AnalyticsCard title="Total Shows" count={analytics.shows} />
            <AnalyticsCard
              title="Total Clicks"
              count={analytics.interactions.length}
            />
            <AnalyticsCard
              title="Players Passed By"
              count={analytics.players.length}
              link="#players"
            />
          </section>
        </div>
        <hr />
        <section className="flex flex-col gap-4">
          <div className="flex flex-row gap-2 items-center w-full">
            <div className="flex gap-4 items-center">
              <p className="font-bold whitespace-nowrap">Select Date:</p>
              <div className="flex items-center gap-2">
                <Radio
                  id="all"
                  name="date_types"
                  value="All"
                  onChange={() => setDateFilter("all")}
                />
                <Label htmlFor="all" value="All" />
              </div>
              <div className="flex items-center gap-2">
                <Radio
                  id="range"
                  name="date_types"
                  defaultChecked
                  value="Range"
                  onChange={() => setDateFilter("range")}
                />
                <Label htmlFor="range" value="Range" />
                <div
                  className={classNames(
                    dateFilter !== "range" && "pointer-events-none opacity-50",
                    "flex items-center gap-4"
                  )}
                >
                  <Datepicker
                    onSelectedDateChanged={(date) =>
                      setDates((prev) => ({ ...prev, from: date }))
                    }
                    defaultDate={new Date(dates.from)}
                  />
                  <span>-</span>
                  <Datepicker
                    onSelectedDateChanged={(date) =>
                      setDates((prev) => ({ ...prev, to: date }))
                    }
                    defaultDate={new Date(dates.to)}
                    maxDate={new Date()}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Label
                htmlFor="filter"
                value="Show Metrics"
                className="whitespace-nowrap"
              />
              <Select
                id="filter"
                className="w-full"
                onChange={(e) => setMetricFilter(e.target.value)}
              >
                {["all", "shows", "scans", "clicks"].map((key) => {
                  return (
                    <option
                      value={key}
                      key={key}
                      className="capitalize"
                      selected={metricFilter === key}
                    >
                      {key}
                    </option>
                  );
                })}
              </Select>
            </div>
          </div>
          <hr />
          <div className=" bg-white p-4 gap-4 w-full flex flex-col rounded border shadow-md">
            <h2 className="font-bold text-lg border-b">Ad Statistics</h2>
            <ResponsiveContainer
              width={"100%"}
              height={350}
              className="overflow-hidden"
            >
              <ComposedChart data={analytics?.charts}>
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#39b1e5" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#39b1e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                {metricFilter !== "all" ? (
                  metricFilter === "shows" ? (
                    <Area
                      type="monotone"
                      dataKey="records"
                      strokeWidth={2}
                      fill="url(#colorUv)"
                    />
                  ) : metricFilter === "clicks" ? (
                    <Area
                      type="monotone"
                      dataKey="clicks"
                      strokeWidth={2}
                      fill="#39b1e5"
                    />
                  ) : (
                    // <Bar dataKey="clicks" fill="#39b1e5" />
                    metricFilter === "scans" && (
                      <Area
                        type="monotone"
                        dataKey="scans"
                        strokeWidth={2}
                        fill="#052f41"
                      />
                      // <Bar dataKey="scans" fill="#052f41" />
                    )
                  )
                ) : (
                  <>
                    <Area
                      type="monotone"
                      dataKey="records"
                      strokeWidth={2}
                      fill="url(#colorUv)"
                    />
                    <Area
                      type="monotone"
                      dataKey="clicks"
                      strokeWidth={2}
                      fill="#39b1e5"
                    />
                    <Area
                      type="monotone"
                      dataKey="scans"
                      strokeWidth={2}
                      fill="#052f41"
                    />
                  </>
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <hr />
          <div
            id="players"
            className=" bg-white p-4 gap-4 w-full flex flex-col rounded border shadow-md"
          >
            <h2 className="font-bold text-lg border-b">
              Player Passage Frequency
            </h2>
            <ResponsiveContainer
              width={"100%"}
              height={350}
              className="overflow-hidden"
            >
              <BarChart
                data={analytics.players}
                layout="vertical"
                margin={{ left: 100 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, "max"]} />
                <YAxis
                  dataKey="player"
                  type="category"
                  tick={<PlayerCategoryLabel />}
                />
                <Tooltip />
                <Legend />
                <Bar dataKey="passed_by" fill="#39b1e5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
        {/* <pre className="whitespace-pre-wrap"> {JSON.stringify(analytics, null, 2)} </pre> */}
      </div>
    )
  );
}
export default Analytics;
