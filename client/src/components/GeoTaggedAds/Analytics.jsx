import React, { useEffect, useState } from "react";
import { useStaticAds } from "../../context/StaticAdsContext";
import format from "date-fns/format";
import AnalyticsCard from "../../fragments/AnalyticsCard";
import { Label, Select } from "flowbite-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
function Analytics() {
  const currentDate = new Date();
  const [analytics, setAnalytics] = useState();
  const [dates, setDates] = useState({
    from: format(
      new Date(new Date(currentDate).setDate(currentDate.getDate() - 30)),
      "MM/dd/yy"
    ),
    to: format(currentDate, "MM/dd/yy"),
  });
  const { getGeoAdStatistics } = useStaticAds();

  useEffect(() => {
    const id = localStorage.getItem("geo_ad_id");
    const setup = async () => {
      if (id) {
        const response = await getGeoAdStatistics(id, dates);
        setAnalytics(response);
      }
    };
    setup();
  }, [dates]);
  return (
    analytics && (
      <div>
        <section className="flex gap-4">
          {["shows", "scans", "interactions"].map((key) => {
            return (
              <AnalyticsCard key={key} title={key} count={analytics[key]} />
            );
          })}
        </section>
        <section>
          <div className=" bg-white p-4 gap-4 w-full flex flex-col rounded shadow-md">
            <h1 className="font-bold">Hourly Engagement Statistics</h1>
            <div className="flex flex-row gap-2 items-center border-b pb-2">
              <Label htmlFor="filter" value="Show Statistics" />
              {/* <Select
                id="filter"
                onChange={(e) => {
                  setAnalytics(filterLogs(e.target.value, logs));
                }}
              >
                <option value="all">All</option>
                <option value="today">Today</option>
                <option value="week">Past Week</option>
                <option value="monthly">Past 28 Days</option>
              </Select> */}
            </div>
            {/* <ResponsiveContainer
              width={"100%"}
              height={350}
              className="overflow-auto"
            >
              {console.log(analytics.charts.daily)}
              <BarChart data={analytics.charts.daily}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="isScanned" />
                <YAxis />
                <Legend />
                <Tooltip />
                <Bar dataKey="isClosed" fill="#119dd8" />
                <Bar dataKey="isScanned" fill="#052f41" />
              </BarChart>
            </ResponsiveContainer> */}
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
