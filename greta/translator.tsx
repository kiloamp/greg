import { render } from "react-dom";
import { renderToStaticMarkup } from "react-dom/server";
import { addMonths, format } from "date-fns";
import { startOfMonth } from "date-fns";
import { addDays } from "date-fns";
import { startOfYear } from "date-fns";
import * as prettier from "prettier";
import { startOfToday } from "date-fns/esm";
import * as fs from "fs";
import { startOfWeek } from "date-fns";
import { differenceInCalendarDays } from "date-fns";
import { fi } from "date-fns/locale";
import { Thing } from "./greta";
import { parse } from "date-fns";
import { isBefore } from "date-fns";

interface MonthProps {
  date: Date;
  things: Thing[];
}

interface DayProps {
  date: Date;
  things: Thing[];
}

interface YearProps {
  date: Date;
  things: Thing[];
}

interface ThingProps {
  thing: Thing;
}

function Year(props: YearProps) {
  var yearNumber = format(props.date, "Y"); // 1942
  var yearArray = [];
  var recurringMonth = startOfYear(props.date);
  while (recurringMonth.getFullYear() == props.date.getFullYear()) {
    yearArray.push(<Month date={recurringMonth} things={props.things}></Month>);
    recurringMonth = addMonths(recurringMonth, 1);
  }

  return (
    <>
      <h1>{yearNumber}</h1>
      {yearArray}
    </>
  );
}

function Month(props: MonthProps) {
  var recurringDay = startOfMonth(props.date);
  var monthArray = [];
  var dayName = format(props.date, "E"); // Mon
  var startMonth = startOfMonth(props.date);
  var startWeek = startOfWeek(startMonth, { weekStartsOn: 1 });
  var fillerDay = differenceInCalendarDays(startMonth, startWeek);
  console.log(fillerDay);

  for (var fucks = 0; fucks < fillerDay; fucks++) {
    // this for loop fucks
    monthArray.push(<div className="filler_day"></div>);
  }

  while (recurringDay.getMonth() == props.date.getMonth()) {
    monthArray.push(<Day date={recurringDay} things={props.things}></Day>);
    recurringDay = addDays(recurringDay, 1);
  }

  var monthName = format(props.date, "MMMM"); // июня blyat
  return (
    <>
      <div className="month">
        <h2 id={monthName}>{monthName}</h2>
        <div className="days">
         	<h3 className="header">Mon</h3>
          	<h3 className="header">Tue</h3>
          	<h3 className="header">Wed</h3>
          	<h3 className="header">Thr</h3>
          	<h3 className="header">Fri</h3>
          	<h3 className="header">Sat</h3>
          	<h3 className="header">Sun</h3>
          {monthArray}
        </div>
      </div>
    </>
  );
}

function Thing(props: ThingProps) {
  // this will turn an event into HTML
  if (props.thing.type == "event") {
    return <p className="event">{props.thing.description}</p>;
  } else {
    return <p className="note">{props.thing.description}</p>;
  }
}

function Day(props: DayProps) {
  var dayNumber = format(props.date, "d"); // 12
  var dayOfYear = differenceInCalendarDays(props.date, startOfYear(props.date)) + 1; // Adding 1 because it's 1-based index
  var thingsToday = props.things
    .filter(
      (thing) =>
        differenceInCalendarDays(
          parse(thing.date.from, "d/L/yyyy", new Date()),
          props.date
        ) <= 0
    )
    .filter(
      (thing) =>
        differenceInCalendarDays(
          parse(thing.date.to, "d/L/yyyy", new Date()),
          props.date
        ) >= 0
    );
  return (
    <>
      <div className="day">
        <h3 id={`${dayOfYear}`}>{dayNumber}</h3>
        {thingsToday.map((thing) => (
          <Thing thing={thing}></Thing>
        ))}
      </div>
    </>
  );
}

async function main() {
  const html = renderToStaticMarkup(
    <html>
      <head>
	<title>Calendar CL</title>
        <link rel="stylesheet" href="style.css" />
      </head>
      <body>
        <div className="calendar">
          <Year
            date={new Date()}
            things={[
              {
                description: "3pm fuck",
                type: "event",
                date: {
                  from: "5/1/2023",
                  to: "5/1/2023",
                },
              },
              {
                description: "LAX",
                type: "note",
                date: {
                  from: "18/1/2023",
                  to: "31/1/2023",
                },
              },
            ]}
          ></Year>
        </div>
      </body>
    </html>
  );
  fs.writeFileSync("index.html", html);
  console.log(await prettier.format(html, { parser: "html" }));
}


export function refresh(command: Thing[]): string {
  const html = renderToStaticMarkup(
    <html>
      <head>
        <link rel="stylesheet" href="style.css" />
	<title>Calendar :)</title>
	<link rel="icon" type="image/x-icon" href="favicon.ico" />
	<script src="script.js"></script>
      </head>
      <body>
        <div className="calendar">
          <Year
            date={new Date()}
            things={command}
          ></Year>
        </div>
      </body>
    </html>
  );
  return html;
}


main();
