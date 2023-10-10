import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState } from "react";
// import { daysInWeek, format } from "date-fns";
import CustomToolbar from "../components/Planner/CustomToolbar";
import PageHeader from "../fragments/PageHeader";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useStorage } from "../context/StorageContext";
import { Button, Label, Modal, Select, TextInput } from "flowbite-react";
import {
  lightButton,
  mainButton,
  // modalTheme,
  selectTheme,
  textTheme,
} from "../context/CustomThemes";
import { useFunction } from "../context/Functions";
import { MdAdd } from "react-icons/md";
import { usePlanner } from "../context/PlannerContext";
import { format } from "date-fns";
// import { RRule, rrulestr } from "rrule";

function Planner() {
  const localizer = momentLocalizer(moment);
  const { setIsLoading, setAlert } = useAuth();
  const { capitalize } = useFunction();
  const { getPlaylist } = useStorage();
  const { getPlannerData, addSchedule } = usePlanner();
  const [refresh, doRefresh] = useState(false);

  const [modal, setModal] = useState({
    toggle: false,
    title: null,
  });
  const [schedule, setSchedule] = useState({
    title: "",
    start: new Date(),
    end: new Date(),
    backgroundColor: null,
  });
  const [playlists, setPlaylists] = useState([]);
  // const recurringRule = new RRule({
  //   freq: RRule.WEEKLY,
  //   byweekday: [RRule.MO], // Recurs on Mondays
  //   // Add more recurring rule options as needed
  // });

  // // Generate recurring dates based on the rule
  // const recurringDates = recurringRule.between(
  //   new Date(2023, 0, 1), // Start date
  //   new Date(2024, 11, 31) // End date
  // );

  // // Create event objects for each recurring date
  // const recurringEvents = recurringDates.map((date) => ({
  //   title: "Recurring Event",
  //   start: date, // Start time for this occurrence
  //   end: new Date(date.getTime() + 90 * 60 * 1000), // End time for this occurrence (90 minutes later)
  // }));

  const [schedules, setSchedules] = useState(null);
  const eventPropGetter = (event) => {
    const defaultbackground = "#119dd8";
    const style = {
      backgroundColor: event.backgroundColor
        ? event.backgroundColor
        : defaultbackground,
      color: "white",
    };
    return { style };
  };

  const onInputChange = (e) => {
    const key = e.target.id;
    let value = e.target.value;

    if (key === "start" || key === "end") {
      value = new Date(value);
    }

    setSchedule((current) => {
      return {
        ...current,
        [key]: value,
      };
    });
  };

  const handleSubmission = async (e) => {
    e.preventDefault();
    const scheduleData = { ...schedule };
    scheduleData.title = playlists.find(
      (item) =>
        scheduleData.title.toLowerCase() === item.playlist_name.toLowerCase()
    )._id;
    const response = await addSchedule(scheduleData);
    console.log(response);
    const alert = {
      isOn: true,
      type: "success",
      message: `You have successfully added new schedule`,
    };
    if (response.acknowledged) {
      setAlert(alert);
    } else {
      alert.type = "failure";
      alert.message = response;
      setAlert(alert);
    }
    doRefresh((current) => !current);
  };

  useEffect(() => {
    const setup = async () => {
      const playlistData = await getPlaylist();
      const plannerData = await getPlannerData();
      setPlaylists(playlistData);
      setSchedules(
        plannerData.map((item) => {
          return {
            title: playlistData.find((data) => data._id === item.playlist_id)
              .playlist_name,
            start: new Date(item.start_date),
            end: new Date(item.end_date),
            backgroundColor: item.backgroundColor || null,
          };
        })
      );
      setIsLoading(false);
    };
    setup();
    // const realtimeData = setInterval(setup, 3000);
    // return () => {
    //   clearInterval(realtimeData);
    // };
  }, [getPlaylist, setIsLoading, refresh]);

  return (
    <>
      <div className="transition-all w-full flex flex-col gap-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
          <PageHeader>Manage Schedules</PageHeader>
          {/* <Button
            className="focus:ring-0 w-fit bg-white"
            onClick={() =>
              setModal({
                toggle: true,
                title: "New Schedule",
              })
            }
            color="transparent"
            theme={lightButton}
          >
            <MdAdd />
            <p>New Schedule</p>
          </Button> */}
        </div>
        <div className="bg-white p-2 flex flex-col xl:flex-row gap-4 ">
          <section className="xl:w-1/3">
            <h1 className="font-bold text-lg">
              {schedule.edit ? "Edit Schedule" : "New Schedule"}
            </h1>
            <form
              onSubmit={handleSubmission}
              className="p-2 flex flex-col gap-2"
            >
              <div>
                <Label htmlFor="title" value="Playlist Name" />
                <Select
                  id="title"
                  onChange={(e) => onInputChange(e)}
                  required
                  theme={selectTheme}
                >
                  <option
                    selected={schedule.title === ""}
                    defaultChecked
                    disabled
                  >
                    --Select Playlist--
                  </option>
                  {playlists.map((opt) => {
                    return (
                      <option
                        key={opt._id}
                        value={opt.playlist_name}
                        selected={opt.playlist_name === schedule.title}
                      >
                        {capitalize(opt.playlist_name)}
                      </option>
                    );
                  })}
                </Select>
              </div>
              <div className="flex flex-col md:flex-row gap-2">
                <div className="w-full md:w-1/2">
                  <Label htmlFor="start" value="Start Date" />
                  <TextInput
                    id="start"
                    type="datetime-local"
                    onChange={(e) => onInputChange(e)}
                    value={format(schedule.start, "yyyy-MM-dd'T'HH:mm")}
                    required
                    theme={textTheme}
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <Label htmlFor="end" value="End Date" />
                  <TextInput
                    id="end"
                    type="datetime-local"
                    onChange={(e) => onInputChange(e)}
                    value={format(schedule.end, "yyyy-MM-dd'T'HH:mm")}
                    required
                    theme={textTheme}
                  />
                </div>
              </div>
              <div>
                <div className="w-full flex flex-row items-center gap-2">
                  <Label
                    htmlFor="backgroundColor"
                    value="Set Color (optional)"
                  />
                  <input
                    type="color"
                    id="backgroundColor"
                    className="bg-white"
                    onChange={(e) => onInputChange(e)}
                    value={
                      schedule.backgroundColor
                        ? schedule.backgroundColor
                        : "#119dd8"
                    }
                  />
                </div>
              </div>
              <div className="flex flex-row gap-2">
                {schedule.edit && (
                  <Button
                    className="mt-4 w-full disabled:bg-black"
                    type="submit"
                    color="transparent"
                    theme={lightButton}
                    onClick={() =>
                      setSchedule({
                        title: "",
                        start: new Date(),
                        end: new Date(),
                      })
                    }
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  className="mt-4 w-full disabled:bg-black"
                  type="submit"
                  color="transparent"
                  theme={mainButton}
                >
                  Save
                </Button>
              </div>
            </form>
          </section>
          <section className="w-full xl:w-2/3">
            <h1 className="font-bold text-lg">Calendar</h1>
            {schedules ? (
              <Calendar
                localizer={localizer}
                events={schedules}
                views={["month", "week", "day"]}
                startAccessor="start"
                endAccessor="end"
                eventPropGetter={eventPropGetter}
                onSelectEvent={(e) => setSchedule({ ...e, edit: true })}
                selectable
                onSelectSlot={(e) => console.log(e)}
                style={{ height: "600px" }}
                components={{
                  toolbar: CustomToolbar, // Use your custom toolbar component
                }}
              />
            ) : (
              <>Loading...</>
            )}
          </section>
        </div>
      </div>
      {/* {format(
                    new Date(
                      new Date().toLocaleString("en-PH", {
                        timeZone: "Asia/Manila",
                      })
                    ), "yyyy-MM-dd'T'hh:mm:ss.sSS'Z'"
                  )} */}
      {/* <div className="flex items-center justify-center gap-8">
                  {[
                    "Sunday",
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                  ].map((day, index) => {
                    return (
                      <div key={index} className="h-8 w-8">
                        <input
                          type="checkbox"
                          id={day}
                          className="hidden peer"
                        />
                        <label
                          className="transition-all peer-checked:bg-secondary-dark peer-checked:text-white flex  items-center justify-center select-none cursor-pointer h-8 w-8 rounded-full border-2 border-secondary-dark"
                          htmlFor={day}
                        >
                          {day.substring(0, 1)}
                        </label>
                      </div>
                    );
                  })}
                </div> */}
      {/* <Modal
        position="center"
        show={modal.toggle}
        dismissible
        onClose={() => {
          setModal({
            toggle: false,
            title: null,
          });
          setSchedule({
            title: "",
            start: "",
            end: "",
          });
        }}
        size="lg"
        theme={modalTheme}
      >
        <Modal.Header className="border-b-default-dark p-3 px-4">
          {modal.toggle && "Add New " + capitalize(modal.title)}
        </Modal.Header>
        <Modal.Body>
          <form className="flex flex-col gap-2" onSubmit={handleSubmission}>
            <div>
              <Label htmlFor="title" value="Playlist" />
              <Select
                id="title"
                onChange={(e) => onInputChange(e)}
                required
                theme={selectTheme}
              >
                <option
                  selected={schedule.title === ""}
                  defaultChecked
                  disabled
                >
                  --Select Playlist--
                </option>
                {playlists.map((opt) => {
                  return (
                    <option
                      key={opt._id}
                      value={opt._id}
                      selected={schedule.title === opt._id}
                    >
                      {capitalize(opt.playlist_name)}
                    </option>
                  );
                })}
              </Select>
            </div>
            <div className="flex flex-col md:flex-row gap-2">
              <div className="w-full">
                <Label htmlFor="start" value="Date" />
                <TextInput
                  id="start"
                  onChange={(e) => onInputChange(e)}
                  type="date"
                  value={schedule.start}
                  required
                  theme={textTheme}
                />
              </div>
              <div className="w-full">
                <Label htmlFor="start_time" value="Time" />
                <TextInput
                  id="star_timet"
                  onChange={(e) => onInputChange(e)}
                  type="date"
                  value={schedule.start}
                  required
                  theme={textTheme}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="end" value="End Date" />
              <TextInput
                id="end"
                onChange={(e) => onInputChange(e)}
                type="date"
                value={schedule.end}
                required
                theme={textTheme}
              />
            </div>
            <Button
              className="mt-4 w-full disabled:bg-black"
              type="submit"
              color="transparent"
              theme={mainButton}
            >
              Upload
            </Button>
          </form>
        </Modal.Body>
      </Modal> */}
    </>
  );
}

export default Planner;
