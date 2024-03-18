import { useEffect, useState } from "react";
import { useStaticAds } from "../../context/StaticAdsContext";
import format from "date-fns/format";
import AnalyticsCard from "../../fragments/AnalyticsCard";
import { Datepicker, Label, Radio, Select } from "flowbite-react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import classNames from "classnames";
function Analytics() {
  const { getGeoAdStatistics } = useStaticAds();
  const currentDate = new Date();
  const [analytics, setAnalytics] = useState();
  const [dates, setDates] = useState({
    from: format(
      new Date(new Date(currentDate).setDate(currentDate.getDate() - 30)),
      "MM/dd/yy"
    ),
    to: format(currentDate, "MM/dd/yy"),
  });
  const [dateFilter, setDateFilter] = useState("all");
  const [metricFilter, setMetricFilter] = useState("all");

  useEffect(() => {
    const id = localStorage.getItem("geo_ad_id");
    const setup = async () => {
      if (id) {
        const dateOptions =
          dateFilter === "all" ? { range: dateFilter } : dates;
        const response = await getGeoAdStatistics(id, dateOptions);
        console.log(response);
        setAnalytics(response);
      }
    };
    setup();
  }, [dateFilter, dates]);
  return (
    analytics && (
      <div className="space-y-6">
        <section className="flex gap-4">
          {["shows"].map((key) => {
            return (
              <AnalyticsCard key={key} title={"Shows"} count={analytics[key]} />
            );
          })}
          <AnalyticsCard title="Total Clicks" count={analytics.interactions} />
          <AnalyticsCard
            title="Players Passed By"
            count={analytics.players?.length}
          />
        </section>
        <section className="flex flex-col gap-4">
          <h2 className="font-bold text-lg border-b">Statistics</h2>
          <div className="flex flex-row gap-2 items-center">
            <div className="flex gap-4 items-center">
              <p className="font-bold whitespace-nowrap">Select Date:</p>
              <div className="flex items-center gap-2">
                <Radio
                  id="all"
                  name="date_types"
                  value="All"
                  defaultChecked
                  onChange={() => setDateFilter("all")}
                />
                <Label htmlFor="all" value="All" />
              </div>
              <div className="flex items-center gap-2">
                <Radio
                  id="range"
                  name="date_types"
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
              <Label htmlFor="filter" value="Show Metrics" />
              <Select
                id="filter"
                onChange={(e) => setMetricFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="shows">Shows</option>
                <option value="clicks">Clicks</option>
                <option value="scans">Scans</option>
              </Select>
            </div>
          </div>
          <div className=" bg-white p-4 gap-4 w-full flex flex-col rounded shadow-md">
            <ResponsiveContainer
              width={"100%"}
              height={350}
              className="overflow-hidden"
            >
              <ComposedChart data={analytics?.charts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                {metricFilter !== "all" ? (
                  metricFilter === "shows" ? (
                    <Line
                      type="natural"
                      dataKey="records"
                      strokeWidth={4}
                      stroke="#1c4a5d"
                    />
                  ) : metricFilter === "clicks" ? (
                    <Bar dataKey="clicks" fill="#39b1e5" />
                  ) : (
                    metricFilter === "scans" && (
                      <Bar dataKey="scans" fill="#052f41" />
                    )
                  )
                ) : (
                  <>
                    <Line
                      type="natural"
                      dataKey="records"
                      strokeWidth={4}
                      stroke="#1c4a5d"
                    />
                    <Bar dataKey="clicks" fill="#39b1e5" />
                    <Bar dataKey="scans" fill="#052f41" />
                  </>
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </section>
        {/* <pre className="whitespace-pre-wrap">
          {JSON.stringify(analytics, null, 2)}
        </pre> */}
      </div>
    )
  );
}
export default Analytics;
