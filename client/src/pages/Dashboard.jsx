import PageHeader from "../fragments/PageHeader";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import QuickLinks from "../components/Dashboard/QuickLinks";
import Analytics from "../components/Dashboard/Analytics";
function Dashboard() {
  return (
    <div className="flex flex-col gap-4 p-4 h-full">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <PageHeader>Dashboard Overview</PageHeader>
        <Today />
      </div>
      <div className="flex flex-col gap-4">
        <QuickLinks />
        <Analytics />
      </div>
    </div>
  );
}
function Today() {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const getCurrentDate = () => {
      const now = new Date();
      setDate(now);
    };

    const hourly = setInterval(getCurrentDate, 360000);

    return () => clearInterval(hourly);
  }, []);
  return (
    <span className="text-sm font-semibold">
      As of {format(date, "h:mm a 'of' MMMM dd, yyyy")}
    </span>
  );
}
export default Dashboard;
