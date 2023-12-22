import React, { useState } from "react";
import PropTypes from "prop-types";
import { format } from "date-fns";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Label, Select } from "flowbite-react";

function StaticAdAnalytics({ logs }) {
  const [analytics, setAnalytics] = useState(logs);
  const retrieveRatio = () => {
    const sortedData = groupViews();

    const result = sortedData.map((group) => {
      const { scans } = group;

      const scanCount = scans.reduce((count) => count + 1, 0);
      if (scanCount === 0) return 0;

      return parseFloat((1 / scanCount).toFixed(2));
    });
    const size = result.length;
    const ratio = result.reduce((count, item) => (count += item), 0);

    return (ratio / size) * 100;
  };
  const retrieveData = (action) => {
    const data = [...logs];

    return data.filter((item) => item.action === action).length;
  };
  const groupViews = () => {
    const result = [];
    let currentView = null;

    logs.forEach((view) => {
      if (view.action === "viewed") {
        if (currentView) {
          result.push({
            viewed: { action: currentView.action, date: currentView.date },
            scans: currentView.scans,
          });
        }
        currentView = { ...view, scans: [] }; // Initialize scans property
      } else if (view.action === "scanned" && currentView) {
        currentView.scans.push(view);
      }
    });

    if (currentView) {
      result.push({
        viewed: { action: currentView.action, date: currentView.date },
        scans: currentView.scans,
      });
    }

    return result;
  };

  const generateChartData = () => {
    const timedData = analytics.reduce((counts, session) => {
      const time = format(new Date(session.date), "H");
      counts[time] = {
        ...counts[time],
        [session.action]: (counts[time]?.[session.action] || 0) + 1,
      };
      return counts;
    }, {});

    // Ensure all actions have a count, defaulting to 0 if not present
    Object.values(timedData).forEach((timeData) => {
      Object.keys(timeData).forEach((action) => {
        timeData[action] = timeData[action] || 0;
      });
    });

    for (let i = 0; i < 24; i++) {
      if (!timedData[i]) {
        timedData[i] = { viewed: 0, scanned: 0 };
      }
    }
    return Object.keys(timedData).map((hour, index) => {
      return {
        time:
          hour == 0
            ? "12AM"
            : (hour > 12 ? hour - 12 : hour) + (index < 12 ? "AM" : "PM"),
        views: timedData[hour].viewed ? timedData[hour].viewed : 0,
        scans: timedData[hour].scanned ? timedData[hour].scanned : 0,
      };
    });
  };

  const filterLogs = (filter, logs) => {
    const today = new Date();
    const nextDate = new Date(today);
    const tomorrow = nextDate.setDate(today.getDate() + 1);
    switch (filter) {
      case "all":
        return logs;
      case "today": {
        const filteredLogs = logs.filter((log) => {
          const logDate = new Date(log.date);
          return logDate >= today && logDate < tomorrow;
        });

        return filteredLogs;
      }
      case "week": {
        nextDate.setDate(today.getDate() - 7);
        console.log(nextDate);
        const filteredLogs = logs.filter((log) => {
          const logDate = new Date(log.date);
          return logDate >= nextDate && logDate < tomorrow;
        });

        return filteredLogs;
      }
      case "monthly": {
        nextDate.setDate(today.getDate() - 28);
        console.log(nextDate);

        const filteredLogs = logs.filter((log) => {
          const logDate = new Date(log.date);
          return logDate >= nextDate && logDate < tomorrow;
        });

        return filteredLogs;
      }
    }
  };

  return (
    <>
      <p className="font-bold text-lg border-b">Ads Analytics</p>
      <div className="relative w-full h-full flex flex-col gap-4">
        <div className="flex gap-4">
          <AnalyticsCard
            count={retrieveData("viewed")}
            title={"Total Impressions"}
          />
          <AnalyticsCard
            count={retrieveData("scanned")}
            title={"QR Engagements"}
          />
          <AnalyticsCard
            count={<>{retrieveRatio()}%</>}
            title={"Average Scan Per View Ratio"}
          />
        </div>
        <div className=" bg-white p-4 gap-4 w-full flex flex-col rounded shadow-md">
          <h1 className="font-bold">Hourly Engagement Statistics</h1>
          <div className="flex flex-row gap-2 items-center border-b pb-2">
            <Label htmlFor="filter" value="Show Statistics" />
            <Select
              id="filter"
              onChange={(e) => {
                setAnalytics(filterLogs(e.target.value, logs));
              }}
            >
              <option value="all">All</option>
              <option value="today">Today</option>
              <option value="week">Past Week</option>
              <option value="monthly">Past 28 Days</option>
            </Select>
          </div>
          <ResponsiveContainer
            width={"100%"}
            height={350}
            className="overflow-auto"
          >
            <BarChart data={generateChartData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="time"
                interval={0}
                height={60}
                angle={-45}
                fontSize={12}
                textAnchor="end"
              />
              <YAxis />
              <Legend />
              <Tooltip />
              <Bar dataKey="views" fill="#119dd8" />
              <Bar dataKey="scans" fill="#052f41" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}

StaticAdAnalytics.propTypes = {
  logs: PropTypes.array,
};
const AnalyticsCard = ({ count, title }) => {
  return (
    <div className="w-full bg-white shadow border flex flex-col gap-2 p-4">
      <p className="text-4xl font-bold text-secondary-dark">{count}</p>
      <p className="font-semibold text-gray-700">{title}</p>
    </div>
  );
};
AnalyticsCard.propTypes = {
  count: PropTypes.node,
  title: PropTypes.string,
};
export default StaticAdAnalytics;
