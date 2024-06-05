import React, { useCallback, useEffect, useState, useRef } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { differenceInCalendarDays } from "date-fns";

export default function CalendarComponent({
  calendarValue,
  setCalendarValue,
  projectDatas,
  setFilteredProjects,
}) {
  const [datesToAddClassTo, setDatesToAddClassTo] = useState([]);
  const firstRenderRef = useRef(true);

  useEffect(() => {
    if (!projectDatas) return;
    const datesToAddClassTo = projectDatas.map(
      (projectData) => new Date(projectData.date)
    );
    setDatesToAddClassTo(datesToAddClassTo);
  }, [projectDatas]);

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }
    const filteredProjects = projectDatas?.filter((project) => {
      const projectDate = new Date(project.date);
      return isSameDay(projectDate, calendarValue);
    });
    console.log("filteredProjects:", filteredProjects);
    setFilteredProjects(filteredProjects);
  }, [calendarValue]);

  const tileClassName = useCallback(
    ({ date, view }) => {
      // Add class to tiles in month view only
      if (view === "month") {
        // Check if a date React-Calendar wants to check is on the list of dates to add class to
        if (datesToAddClassTo.find((dDate) => isSameDay(dDate, date))) {
          return "planedDates";
        }
      }
    },
    [datesToAddClassTo]
  );

  const isSameDay = useCallback(
    (a, b) => {
      return differenceInCalendarDays(a, b) === 0;
    },
    [projectDatas]
  );
  return (
    <Calendar
      onChange={(e) => setCalendarValue(e)}
      tileClassName={tileClassName}
      locale="en-US"
    />
  );
}
