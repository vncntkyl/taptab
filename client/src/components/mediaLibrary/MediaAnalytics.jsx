import { format } from "date-fns";
import { Label, Select } from "flowbite-react";
import PropTypes from "prop-types";
import { useState } from "react";
import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const AnalyticsCard = ({ count, title }) => {
  return (
    <div className="w-1/4 bg-white shadow border flex flex-col gap-2 p-4">
      <p className="text-4xl font-bold text-secondary-dark">{count}</p>
      <p className="font-semibold text-gray-700">{title}</p>
    </div>
  );
};
function MediaAnalytics({ logs, id }) {
  const [analytics, setAnalytics] = useState(logs);
  const getTotalPlaytime = () => {
    const totalWatchHours = logs.reduce((total, item) => {
      return (total += parseFloat(item.duration));
    }, 0);
    return (totalWatchHours / 60 / 60).toFixed(2);
  };
  const getViewthroughRate = () => {
    const rates = logs.reduce(
      (counts, session) => {
        counts[session.has_finished ? "true" : "false"] += 1;
        return counts;
      },
      { true: 0, false: 0 }
    );
    return ((rates.true / logs.length) * 100).toFixed(2);
  };
  const getTotalHourlyViews = (logs) => {
    const timeData = logs.reduce((counts, session) => {
      const time = format(new Date(session.log_date), "H");
      counts[time] = (counts[time] || 0) + 1;
      return counts;
    }, {});

    // Fill in missing hours with zero counts
    for (let i = 0; i < 24; i++) {
      if (!timeData[i]) {
        timeData[i] = 0;
      }
    }

    return Object.keys(timeData).map((hour, index) => {
      return {
        time:
          hour == 0
            ? "12AM"
            : (hour > 12 ? hour - 12 : hour) + (index < 12 ? "AM" : "PM"),
        views: timeData[hour],
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
          const logDate = new Date(log.log_date);
          return logDate >= today && logDate < tomorrow;
        });

        return filteredLogs;
      }
      case "week": {
        nextDate.setDate(today.getDate() - 7);
        console.log(nextDate);
        const filteredLogs = logs.filter((log) => {
          const logDate = new Date(log.log_date);
          return logDate >= nextDate && logDate < tomorrow;
        });

        return filteredLogs;
      }
      case "monthly": {
        nextDate.setDate(today.getDate() - 28);
        console.log(nextDate);

        const filteredLogs = logs.filter((log) => {
          const logDate = new Date(log.log_date);
          return logDate >= nextDate && logDate < tomorrow;
        });

        return filteredLogs;
      }
    }
  };

  const getPeakTime = (data) => {
    const itemWithHighestViews = data.reduce((maxItem, currentItem) => {
      return currentItem.views > maxItem.views ? currentItem : maxItem;
    }, data[0]);
    return itemWithHighestViews;
  };

  return (
    <>
      <p className="font-bold text-lg border-b">Ad Analytics</p>
      <div className="relative w-full h-full flex flex-col gap-4" id={id}>
        <div className="flex gap-4">
          <AnalyticsCard count={logs.length} title={"Total Play Count"} />
          <AnalyticsCard
            count={<>{getTotalPlaytime()} hours</>}
            title={"Total Watch Hours"}
          />
          <AnalyticsCard
            count={<>{getViewthroughRate()}%</>}
            title={"View-through Rate"}
          />
          <AnalyticsCard
            count={getPeakTime(getTotalHourlyViews(logs)).time}
            title={"Peak Hours"}
          />
        </div>
        <div className=" bg-white p-4 w-full  flex flex-col gap-4 rounded shadow-md">
          <h1 className="font-bold">Hourly Watch Statistics</h1>
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
          {!getTotalHourlyViews(analytics).every((item) => item.views == 0) ? (
            <ResponsiveContainer
              width={"100%"}
              height={350}
              className="overflow-auto"
            >
              <LineChart data={getTotalHourlyViews(analytics)}>
                <XAxis
                  dataKey="time"
                  interval={0}
                  height={60}
                  angle={-45}
                  fontSize={12}
                  textAnchor="end"
                />
                <YAxis domain={[0, "dataMax"]} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="#119dd8"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <>No analytics found</>
          )}
        </div>
      </div>
    </>
  );
}

MediaAnalytics.propTypes = {
  logs: PropTypes.array,
  id: PropTypes.string,
};

AnalyticsCard.propTypes = {
  count: PropTypes.node,
  title: PropTypes.string,
};
export default MediaAnalytics;
