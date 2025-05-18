import React, { useState } from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import type { View } from "react-big-calendar";
// import { Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { motion } from "framer-motion";
import "../styles/Calendar.css";

// Set up the localizer
const localizer = momentLocalizer(moment);

const Calendar: React.FC = () => {
  // Use View type for the state
  const [view, setView] = useState<View>("month");
  const [date, setDate] = useState(new Date());

  // Sample events data
  const events = [
    {
      id: 1,
      title: "Team Meeting",
      start: new Date(2025, 4, 18, 10, 0), // May 18, 2025, 10:00 AM
      end: new Date(2025, 4, 18, 11, 30), // May 18, 2025, 11:30 AM
      desc: "Discuss project progress",
      allDay: false,
    },
    {
      id: 2,
      title: "Client Call",
      start: new Date(2025, 4, 19, 14, 0), // May 19, 2025, 2:00 PM
      end: new Date(2025, 4, 19, 15, 0), // May 19, 2025, 3:00 PM
      desc: "Quarterly review with client",
      allDay: false,
    },
    {
      id: 3,
      title: "Conference",
      start: new Date(2025, 4, 20, 9, 0), // May 20, 2025, 9:00 AM
      end: new Date(2025, 4, 22, 17, 0), // May 22, 2025, 5:00 PM
      desc: "Annual tech conference",
      allDay: false,
    },
  ];

  // Custom event component
  const EventComponent = ({ event }: { event: any }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="rbc-event"
      style={{
        backgroundColor: "#3b82f6", // blue-500
        borderColor: "#3b82f6",
        color: "white",
        borderRadius: "4px",
        padding: "2px 4px",
        fontSize: "12px",
      }}
    >
      <strong>{event.title}</strong>
      {event.desc && <div>{event.desc}</div>}
    </motion.div>
  );

  // Custom toolbar
  const CustomToolbar = (toolbar: any) => {
    const goToBack = () => {
      toolbar.date.setMonth(toolbar.date.getMonth() - 1);
      toolbar.onNavigate("PREV");
    };

    const goToNext = () => {
      toolbar.date.setMonth(toolbar.date.getMonth() + 1);
      toolbar.onNavigate("NEXT");
    };

    const goToToday = () => {
      toolbar.onNavigate("TODAY");
    };

    const label = () => {
      const date = toolbar.date;
      return (
        <span>
          {date.toLocaleString("default", { month: "long" })}{" "}
          {date.getFullYear()}
        </span>
      );
    };

    return (
      <div className="rbc-toolbar flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={goToBack}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <i className="fas fa-chevron-left text-gray-600"></i>
          </button>
          <button
            onClick={goToToday}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Today
          </button>
          <button
            onClick={goToNext}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <i className="fas fa-chevron-right text-gray-600"></i>
          </button>
        </div>

        <h2 className="text-2xl font-bold text-gray-800">{label()}</h2>

        <div className="flex space-x-2">
          <button
            onClick={() => toolbar.onView("month")}
            className={`px-4 py-2 rounded-lg ${
              view === "month"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            } transition-colors`}
          >
            Month
          </button>
          <button
            onClick={() => toolbar.onView("week")}
            className={`px-4 py-2 rounded-lg ${
              view === "week"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            } transition-colors`}
          >
            Week
          </button>
          <button
            onClick={() => toolbar.onView("day")}
            className={`px-4 py-2 rounded-lg ${
              view === "day"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            } transition-colors`}
          >
            Day
          </button>
          <button
            onClick={() => toolbar.onView("agenda")}
            className={`px-4 py-2 rounded-lg ${
              view === "agenda"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            } transition-colors`}
          >
            Agenda
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <header className="flex justify-between items-center mb-10">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl font-bold text-gray-800"
        >
          Calendar
        </motion.h2>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <div className="p-6">
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
              event: EventComponent,
              toolbar: CustomToolbar,
            }}
            style={{ height: "calc(100vh - 250px)" }}
            className="custom-calendar"
          />
        </div>
      </motion.div>
    </>
  );
};

export default Calendar;
