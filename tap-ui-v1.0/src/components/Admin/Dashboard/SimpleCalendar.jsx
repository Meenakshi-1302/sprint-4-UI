import React, { useState } from 'react';
 
const SimpleCalendar = ({ events }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
 
  const handlePrevMonth = () => {
    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    setCurrentDate(prevMonth);
    setSelectedYear(prevMonth.getFullYear());
    setSelectedMonth(prevMonth.getMonth());
  };
 
  const handleNextMonth = () => {
    const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    setCurrentDate(nextMonth);
    setSelectedYear(nextMonth.getFullYear());
    setSelectedMonth(nextMonth.getMonth());
  };
 
  const handleMonthChange = (event) => {
    const month = parseInt(event.target.value, 10);
    const newDate = new Date(currentDate.getFullYear(), month, 1);
    setCurrentDate(newDate);
    setSelectedMonth(month);
  };
 
  const handleYearChange = (event) => {
    const year = parseInt(event.target.value, 10);
    const newDate = new Date(year, selectedMonth, 1);
    setCurrentDate(newDate);
    setSelectedYear(year);
  };
 
  const renderHeader = () => {
    return (
      <div className="flex flex-col items-center mb-1 p-2">
        <div className="flex items-center mb-1 p-2" style={{ fontSize: '0.7rem' }}>
          <button onClick={handlePrevMonth} className="text-sm px-1 py-0 mx-1 bg-blue-500 text-white rounded-md">
            &lt;
          </button>
 
          <select value={selectedMonth} onChange={handleMonthChange} className="border rounded-lg mx-1 text-sm">
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>
                {new Date(0, i).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
 
          <input
            type="number"
            value={selectedYear}
            onChange={handleYearChange}
            className="border rounded-lg mx-1 w-16 text-center text-sm"
            min="1900"
            max="2100"
          />
 
          <button onClick={handleNextMonth} className="text-sm px-1 py-0 mx-1 bg-blue-500 text-white rounded-md">
            &gt;
          </button>
        </div>
      </div>
    );
  };
 
  const renderDays = () => {
    const days = [...Array(7).keys()].map(i => (
      <div key={i} className="flex-1 text-center font-bold text-xs">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i]}</div>
    ));
    return <div className="grid grid-cols-7">{days}</div>;
  };
 
  const renderCells = () => {
    const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1);
    const lastDayOfMonth = new Date(selectedYear, selectedMonth + 1, 0);
    const totalDays = lastDayOfMonth.getDate();
    const startDay = firstDayOfMonth.getDay();
 
    const cells = [];
    // Empty cells for the days before the first day of the month
    for (let i = 0; i < startDay; i++) {
      cells.push(<div key={`empty-${i}`} className="flex-1 border h-8"></div>);
    }
 
    // Fill the calendar with days of the month
    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(selectedYear, selectedMonth, day);
      const isToday = date.toDateString() === new Date().toDateString();
 
      cells.push(
        <div
          key={`day-${day}`}
          className={`flex-1 border text-center h-8 ${isToday ? 'bg-yellow-300' : ''} cursor-pointer text-sm`}
          onClick={() => alert(`Date clicked: ${date.toLocaleDateString()}`)}
        >
          <span className="block">{day}</span>
        </div>
      );
    }
 
    return <div className="grid grid-cols-7">{cells}</div>;
  };
 
  return (
    <div className="bg-white p-1 shadow-md rounded-lg" style={{ height: 'calc(100% - 20px)', overflow: 'hidden' }}>
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};
 
export default SimpleCalendar;