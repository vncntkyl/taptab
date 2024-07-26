import { format } from "date-fns";

const retrieveTotalDuration = (logs) => {
  return logs.reduce((total, log) => (total += log.duration), 0) / 3600 || 0;
};
const retrieveAverageDuration = (logs) => {
  return (
    logs.reduce((sum, session) => sum + session.duration, 0) /
      logs.length /
      3600 || 0
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

const showHours = (count, module) => {
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
};
const calculateDailyWatchHours = (analytics) => {
  const flatData = analytics.flat();

  const groupedByDate = {};
  const today = format(new Date(), "yyyy-MM-dd");
  const monthBefore = format(
    new Date(new Date().setDate(new Date().getDate() - 28)),
    "yyyy-MM-dd"
  );

  const dates = getDatesBetween(monthBefore, today);

  dates.forEach((date) => {
    groupedByDate[date] = [];
  });
  for (const data of flatData) {
    const date = data.log_date.split("T")[0];

    if (!groupedByDate[date]) {
      groupedByDate[date] = [];
    }

    // Push the item into the corresponding date array
    groupedByDate[date].push(data);
  }
  const result = Object.keys(groupedByDate).map((date) => {
    const entries = groupedByDate[date];
    const finishRate = calculateHasFinishedData(entries);
    return {
      date,
      total_runtime: (retrieveTotalDuration(entries) * 60).toFixed(2) || 0,
      average_runtime:
        (retrieveAverageWatchHoursBeforeSkipping(entries) / 60).toFixed(2) || 0,
      finish_rate:
        ((finishRate.true - finishRate.false) / entries.length) * 100 || 0,
      finish_count:
        Math.round(
          ((finishRate.true - finishRate.false) / entries.length) *
            retrieveTotalDuration(entries) *
            60
        ) || 0,
    };
  });

  // Step 3: Sort the array by date
  result.sort((a, b) => new Date(a.date) - new Date(b.date));

  return result;
};

function getDatesBetween(startDate, endDate) {
  // Parse the start and end dates
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Create an array to hold the dates
  const dates = [];

  // Iterate from the start date to the end date
  for (
    let date = new Date(start);
    date <= end;
    date.setDate(date.getDate() + 1)
  ) {
    dates.push(new Date(date).toISOString().split("T")[0]); // Format the date as YYYY-MM-DD
  }

  return dates;
}

export const functions = {
  retrieveAverageDuration,
  retrieveAverageWatchHoursBeforeSkipping,
  retrieveTotalDuration,
  calculateFinishRate,
  calculateHasFinishedData,
  calculateTotalWatchHours,
  calculateDailyWatchHours,
  showHours,
};
