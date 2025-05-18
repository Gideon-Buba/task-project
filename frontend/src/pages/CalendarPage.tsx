import React from "react";

const Calendar: React.FC = () => {
  return (
    <>
      <header className="flex justify-between items-center mb-10">
        <h2 className="text-4xl font-bold text-gray-800">Calendar</h2>
      </header>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <p>Calendar content goes here</p>
      </div>
    </>
  );
};

export default Calendar;
