import React, { useState, useEffect } from "react";
import { FiCalendar } from "react-icons/fi";
import ClicksVsDayChart from "./ClicksVsDayChart";

// Helper: month names for dropdown & display
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Utility to get filtered chart data for given month/year
function getClicksPerDay(clicks, selectedYear, selectedMonth) {
  const counts = {};

  clicks.forEach(({ time }) => {
    const dateObj = new Date(time);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1; // 1-based month
    const day = dateObj.getDate();

    if (year === selectedYear && month === selectedMonth) {
      // Format day for X axis: "DD"
      const dayStr = day.toString().padStart(2, "0");
      counts[dayStr] = (counts[dayStr] || 0) + 1;
    }
  });

  // Build array for all days of month (fill zero if no clicks)
  const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
  const data = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const dayStr = day.toString().padStart(2, "0");
    data.push({
      date: dayStr,
      clicks: counts[dayStr] || 0,
    });
  }

  return data;
}

export default function ClicksOverTimeContainer({ clicks }) {
  // Extract all years from clicks for dropdown
  const allYears = Array.from(
    new Set(clicks.map(({ time }) => new Date(time).getFullYear()))
  ).sort((a, b) => a - b);

  // Default to latest year & current month if exists in data, else fallback
  const latestClickDate = clicks.length
    ? new Date(clicks[clicks.length - 1].time)
    : new Date();

  const defaultYear = latestClickDate.getFullYear();
  const defaultMonth = latestClickDate.getMonth() + 1; // 1-based month

  const [selectedYear, setSelectedYear] = useState(defaultYear);
  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);
  const [chartData, setChartData] = useState([]);

  // Update chart data when clicks or selection change
  useEffect(() => {
    const filteredData = getClicksPerDay(clicks, selectedYear, selectedMonth);
    setChartData(filteredData);
  }, [clicks, selectedYear, selectedMonth]);

  // Handlers for dropdown changes
  function handleYearChange(e) {
    const year = parseInt(e.target.value);
    setSelectedYear(year);
    // Optionally reset month to January or keep same month
  }

  function handleMonthChange(e) {
    const month = parseInt(e.target.value);
    setSelectedMonth(month);
  }

  // Handlers for next/prev month buttons
  function goPrevMonth() {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear(prev => prev - 1);
    } else {
      setSelectedMonth(prev => prev - 1);
    }
  }

  function goNextMonth() {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear(prev => prev + 1);
    } else {
      setSelectedMonth(prev => prev + 1);
    }
  }

  return (
    <div className="bg-gray-800 rounded-xl shadow-md p-6">
      <div className="flex items-center gap-2 text-gray-300 mb-4">
        <FiCalendar />
        <h2 className="text-xl font-semibold">Clicks Over Time</h2>
      </div>

      {/* Dropdowns */}
      <div className="flex gap-4 mb-4">
        {/* Month Dropdown */}
        <select
          className="border rounded px-3 py-1 bg-gray-700 text-gray-200"
          value={selectedMonth}
          onChange={handleMonthChange}
        >
          {MONTH_NAMES.map((name, i) => (
            <option key={i} value={i + 1} >
              {name}
            </option>
          ))}
        </select>

        {/* Year Dropdown */}
        <select
          className="border rounded px-3 py-1 bg-gray-700 text-gray-200"
          value={selectedYear}
          onChange={handleYearChange}
        >
          {allYears.map(year => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Chart */}
      <ClicksVsDayChart data={chartData} />

      {/* Nav Buttons */}
      <div className="flex justify-center gap-4 mt-4">
        <button
          className="px-4 py-2 bg-gray-400 text-gray-200 rounded hover:bg-gray-600"
          onClick={goPrevMonth}
        >
          ← Prev Month
        </button>
        <button
          className="px-4 py-2 bg-gray-400 text-gray-200 rounded hover:bg-gray-600"
          onClick={goNextMonth}
        >
          Next Month →
        </button>
      </div>
    </div>
  );
}
