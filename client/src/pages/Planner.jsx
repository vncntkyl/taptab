import moment from "moment";
import { format } from "date-fns";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { Button, Label, Select, TextInput } from "flowbite-react";
import PageHeader from "../fragments/PageHeader";
import { useAuth } from "../context/AuthContext";
import { useFunction } from "../context/Functions";
import { useStorage } from "../context/StorageContext";
import { usePlanner } from "../context/PlannerContext";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CustomToolbar from "../components/Planner/CustomToolbar";
import {
  lightButton,
  mainButton,
  selectTheme,
  textTheme,
} from "../context/CustomThemes";

function Planner() {
  const localizer = momentLocalizer(moment);
  const { setIsLoading, setAlert } = useAuth();
  const { capitalize } = useFunction();
  const { getPlaylistNames } = useStorage();
  const { getPlannerData, addSchedule } = usePlanner();

  const [refresh, doRefresh] = useState(false);
  const [schedule, setSchedule] = useState({
    title: "",
    start: new Date(),
    end: new Date(),
    occurence: {
      repeat: "everyday", //everyday or custom
      timeslot: {
        //everyday = object of timeslot; custom = array of timeslots with day
        //day: "monday",
        start: new Date(),
        end: new Date(),
      },
    },
    backgroundColor: generateRandomHexColor(),
  });
  const [playlists, setPlaylists] = useState([]);
  const [schedules, setSchedules] = useState(null);
  const [selectedDays, setDays] = useState([]);
  const weekdays = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
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

  const onOccurenceChange = (e) => {
    setSchedule((prev) => {
      let timeslot;
      if (e.target.value === "custom") {
        timeslot = [];
      } else {
        timeslot = {
          start: new Date(),
          end: new Date(),
        };
      }
      return {
        ...prev,
        occurence: {
          repeat: e.target.value,
          timeslot: timeslot,
        },
      };
    });
  };
  const onWeekdayChange = (e) => {
    const { target } = e;
    const { value, id, checked } = target;

    let temp = [...selectedDays];
    if (checked) {
      if (temp.indexOf(id) === -1) {
        temp.push({
          day: value,
          start: new Date(),
          end: new Date(),
        });
      }
    } else {
      const index = temp.findIndex((day) => day.day === value);
      if (index !== -1) {
        temp.splice(index, 1);
      }
    }

    setDays(temp);
  };

  const handleSubmission = async (e) => {
    e.preventDefault();
    const scheduleData = { ...schedule };
    const occurences = [...selectedDays];
    if (scheduleData.occurence.repeat === "custom" && occurences.length !== 0) {
      scheduleData.occurence.timeslot = occurences;
    }

    scheduleData.playlist_id = playlists.find(
      (item) =>
        scheduleData.title.toLowerCase() === item.playlist_name.toLowerCase()
    )._id;

    schedule.start.setHours(0);
    schedule.start.setMinutes(0);
    schedule.start.setMilliseconds(0);
    schedule.end.setMinutes(0);
    schedule.end.setMinutes(0);
    schedule.end.setMilliseconds(0);

    delete scheduleData.title;
    console.log(scheduleData);
    const response = await addSchedule(scheduleData);
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
  function generateRandomHexColor() {
    const light = "89ABCDEF"; // Adjusted to include lighter shades
    const literals = "0123456789ABCDEF";
    let color = "#";
    for (var i = 0; i < 6; i++) {
      if (i % 2 === 0) {
        color += light[Math.floor(Math.random() * light.length)];
      } else {
        color += literals[Math.floor(Math.random() * literals.length)];
      }
    }
    return color;
  }

  useEffect(() => {
    const setup = async () => {
      const playlistData = await getPlaylistNames();
      const plannerData = await getPlannerData();
      setPlaylists(playlistData);
      setSchedules(
        plannerData.map((item) => {
          return {
            ...item,
            title: playlistData.find((data) => data._id === item.playlist_id)
              .playlist_name,
            start: new Date(item.start),
            end: new Date(item.end),
          };
        })
      );
      console.log(
        plannerData.map((item) => {
          return {
            ...item,
            title: playlistData.find((data) => data._id === item.playlist_id)
              .playlist_name,
            start: new Date(item.start),
            end: new Date(item.end),
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
  }, [setIsLoading, refresh, getPlaylistNames, getPlannerData]);

  return (
    <>
      <div className="transition-all w-full flex flex-col gap-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
          <PageHeader>Manage Schedules</PageHeader>
        </div>
        <div className="bg-white p-2 flex flex-col xl:flex-row gap-4 ">
          <section className="xl:w-1/3">
            <h1 className="font-bold text-lg">
              {schedule.edit ? "Edit Schedule" : "New Schedule"}
            </h1>
            <form
              onSubmit={handleSubmission}
              className="p-2 flex flex-col gap-4"
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
              <p className="font-semibold">Runtime Details</p>
              <div className="flex flex-col md:flex-row items-center gap-2">
                <Label className="w-1/5" value="Date" />
                <TextInput
                  id="start"
                  type="date"
                  className="w-full md:w-2/5"
                  disabled={schedule.title === ""}
                  onChange={(e) => onInputChange(e)}
                  value={format(schedule.start, "yyyy-MM-dd")}
                  min={format(new Date(), "yyyy-MM-dd")}
                  required
                  theme={textTheme}
                />
                <span>-</span>
                <TextInput
                  id="end"
                  type="date"
                  className="w-full md:w-2/5"
                  disabled={schedule.title === ""}
                  onChange={(e) => onInputChange(e)}
                  value={format(schedule.end, "yyyy-MM-dd")}
                  required
                  min={
                    format(schedule.start, "yyyy-MM-dd") ||
                    format(new Date(), "yyyy-MM-dd")
                  }
                  theme={textTheme}
                />
              </div>
              <hr />
              <div className="flex flex-row items-center justify-between">
                <Label htmlFor="repeat" value="Repeat" className="w-1/5" />
                <Select
                  id="repeat"
                  required
                  disabled={schedule.title === ""}
                  theme={selectTheme}
                  onChange={onOccurenceChange}
                  className="w-4/5"
                >
                  {["everyday", "custom"].map((day) => {
                    return (
                      <option
                        key={day}
                        value={day}
                        selected={schedule.occurence.repeat === day}
                      >
                        {capitalize(day)}
                      </option>
                    );
                  })}
                </Select>
              </div>
              {schedule.occurence.repeat === "everyday" && (
                <TimeSelector
                  schedule={schedule}
                  setSchedule={setSchedule}
                  isEveryday
                />
              )}
              {schedule.occurence.repeat === "custom" && (
                <>
                  <hr />
                  <div>
                    <Label value="Select Days" />
                    <div className="flex justify-evenly items-center box-border my-3">
                      {weekdays.map((day) => {
                        const letter =
                          day !== "thursday"
                            ? day.substring(0, 1)
                            : day.substring(0, 2);
                        return (
                          <div key={day} className="w-10 h-10">
                            <input
                              type="checkbox"
                              name="weekdays"
                              id={day}
                              value={day}
                              className="hidden peer"
                              onChange={onWeekdayChange}
                              checked={selectedDays.find(
                                (item) => item.day === day
                              )}
                            />
                            <label
                              htmlFor={day}
                              className="w-full h-full flex items-center justify-center font-bold text-main select-none cursor-pointer rounded-full border-4 border-lighter transition-all peer-checked:bg-lighter peer-checked:text-white"
                            >
                              {letter.toUpperCase()}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    {selectedDays.map(({ day }) => {
                      return (
                        <>
                          <TimeSelector
                            id={day}
                            schedule={selectedDays}
                            setSchedule={setDays}
                          />
                        </>
                      );
                    })}
                  </div>
                </>
              )}
              {/* {JSON.stringify(selectedDays)} */}
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
                    disabled={schedule.title === ""}
                    onChange={(e) => onInputChange(e)}
                    value={
                      schedule.backgroundColor
                        ? schedule.backgroundColor
                        : generateRandomHexColor()
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
                  disabled={schedule.title === ""}
                >
                  Save
                </Button>
              </div>
            </form>
          </section>
          <section className="w-full xl:w-2/3">
            {/* {console.log(schedules)} */}
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
    </>
  );
}

function TimeSelector({ id, schedule, setSchedule, isEveryday = false }) {
  const { capitalize } = useFunction();
  const startID = isEveryday ? "start" : `${id}-start`;
  const endID = isEveryday ? "end" : `${id}-end`;
  let timeslot;

  if (isEveryday) {
    timeslot = schedule.occurence.timeslot;
  } else {
    const occurence_day = schedule.find((slot) => slot.day === id);
    timeslot = occurence_day;
  }
  const onInputChange = (e) => {
    const today = new Date();
    let id = e.target.id;
    let value = e.target.value;
    value = value.split(":");
    today.setHours(value[0]);
    today.setMinutes(value[1]);
    today.setSeconds(0);
    // console.log(today);
    if (isEveryday) {
      setSchedule((prev) => {
        return {
          ...prev,
          occurence: {
            ...prev.occurence,
            timeslot: {
              ...prev.occurence.timeslot,
              [id]: today,
            },
          },
        };
      });
    } else {
      id = id.split("-");
      setSchedule((prev) => {
        const index = prev.findIndex((slot) => slot.day === id[0]);

        if (index === -1) return prev;

        const temp = [...prev];

        const slot = temp[index];

        slot[id[1]] = today;
        return temp;
      });
    }
  };
  // console.log(today);
  return (
    <div className="flex flex-col md:flex-row items-center gap-2">
      <Label className="w-1/5" value={isEveryday ? "Time" : capitalize(id)} />
      <TextInput
        id={startID}
        type="time"
        disabled={schedule.title === ""}
        className="w-full md:w-2/5"
        onChange={(e) => onInputChange(e)}
        value={format(timeslot.start, "HH:mm")}
        required
        theme={textTheme}
      />
      <span>-</span>
      <TextInput
        id={endID}
        type="time"
        disabled={schedule.title === ""}
        className="w-full md:w-2/5"
        onChange={(e) => onInputChange(e)}
        value={format(timeslot.end, "HH:mm")}
        required
        theme={textTheme}
      />
    </div>
  );
}

TimeSelector.propTypes = {
  id: PropTypes.string,
  schedule: PropTypes.object,
  setSchedule: PropTypes.func,
  isEveryday: PropTypes.bool,
};
export default Planner;
