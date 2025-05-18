import React, { useEffect, useState } from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { getTasks } from "../api/taskApi";
import type { Task } from "../api/types";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../styles/Calendar.css";

// Localizer setup
const localizer = momentLocalizer(moment);

// Task marker component
const CustomDay = ({ date, events }: { date: Date; events: any[] }) => {
  const hasEvents = events?.some((event) =>
    moment(event.start).isSame(date, "day")
  );

  return (
    <div className="rbc-day-bg">
      <span className="rbc-day-number">{date.getDate()}</span>
      {hasEvents && (
        <div className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-blue-500"></div>
      )}
    </div>
  );
};

const Calendar: React.FC = () => {
  const [view, setView] = useState("month");
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState<any[]>([]); // BigCalendar events

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasks: Task[] = await getTasks();

        // Transform into BigCalendar-compatible events
        const formatted = tasks.map((task) => ({
          id: task.id,
          title: task.title,
          start: new Date(task.dueDateTime),
          end: new Date(task.dueDateTime),
          desc: task.description,
          allDay: false,
        }));

        setEvents(formatted);
      } catch (err) {
        console.error("Error loading tasks", err);
      }
    };

    fetchTasks();
  }, []);

  return (
    <BigCalendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      view={view}
      date={date}
      onView={setView}
      onNavigate={setDate}
      components={{
        month: {
          dateHeader: (props) => (
            <CustomDay date={props.date} events={events} />
          ),
        },
      }}
      style={{ height: "calc(100vh - 250px)" }}
    />
  );
};

export default Calendar;
