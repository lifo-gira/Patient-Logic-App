import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";

import { CalendarDaysIcon } from "@heroicons/react/24/solid";

// import Calendar from "react-calendar";
import dayjs, { Dayjs } from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";

const Healthcheckup = ({ onNextClick, onPrevClick, onDataSubmit  }) => {
  const [selectedRange, setSelectedRange] = useState(null);
  const [isView,setIsview]=useState(false);

  const handleButtonClick = (range) => {
    setSelectedRange(range);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const formatDate = (date) => {
    return date.format("DD/MM/YYYY");
  };

  const handleViewCalenda=()=>{
    setIsview(!isView);
  }

  const [selectedDate, setSelectedDate] = useState(dayjs());

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      setScreenWidth(window.innerWidth);
    };

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Initial check
    handleResize();

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [height, setheight] = useState("");
  const [weight, setweight] = useState("");
  const [bmi, setbmi] = useState(null);

  const handleheight = (event) => {
    setheight(event.target.value);
    handlebmi();
  };
  const handleweight = (event) => {
    setweight(event.target.value);
    handlebmi();
  };
  const handlebmi = () => {
    const heightInMeters = height / 100;
    const bmiValue = weight / (heightInMeters * heightInMeters);
    if ((height === 0 || height === '') || (weight === '0' || weight === '')) {
      setbmi("NA");
    } else {
      setbmi(bmiValue.toFixed(2));
    }
  };

  const onNextClickHandler = () => {
    // Log the selected sugar level to the console
    // console.log("Selected Sugar Level:", selectedRange);
    // console.log("Selected Date of Report:", selectedDate.format("DD/MM/YYYY"));
    // Call the original onNextClick handler

    onDataSubmit({
      selectedRange,
      selectedDate: selectedDate.format("DD/MM/YYYY"),
    });

    onNextClick();
  };

  return (
    <Card className={`w-full  flex-col ${screenWidth<835?"h-full pb-4 mb-8":"h-[32rem] p-0"}`}>
      <Typography variant="h4" color="blue-gray" className={` py-2 ${screenWidth<970?"w-full ":"mr-auto pl-12 "}`}>
        Update your height and weight from your recent report
      </Typography>
      <CardBody className={`flex flex-row px-5 pt-2 pb-0 ${screenWidth<835?"flex-col w-full h-full justify-center":""}`}>
        <div className={`${screenWidth<835?"w-full":"w-1/2"}`}>
          <Typography
            color="blue-gray"
            className={`text-start text-lg font-medium mb-6 px-8 ${screenWidth<350?"w-full text-center":""}`}
          >
            Choose your height and weight
          </Typography>
          <div className={`flex flex-col w-full gap-6 ${screenWidth<350?"px-2":"px-8"}`}>
          <input
              type="number"
              placeholder="height in cm"
              className={`w-full py-2 px-5 rounded-md border border-black text-start text-lg text-black font-semibold`}
              value={height}
              onChange={handleheight}
            />

            <input
              type="number"
              placeholder="weight in Kg"
              className={`w-full py-2 px-5 rounded-md border border-black text-start text-lg text-black font-semibold`}
              value={weight}
              onChange={handleweight}
            />

            <div
              className={`w-full py-2 px-5 rounded-md border border-black text-start text-lg text-black font-semibold`}
            >
              Your BMI : {bmi}
            </div>
          </div>
          <div className={`flex flex-col w-full  gap-4 ${screenWidth<350?"px-2":"px-8"}`}>
            <Typography
              color="blue-gray"
              className={`text-start  mt-6 ${screenWidth<455?"font-medium text-base":"text-lg font-medium"}`}
            >
              Date of Report (select your report date)
            </Typography>
            <button
              className={`w-1/2 py-2 px-5 rounded-md border border-black text-start text-lg flex items-center justify-between ${screenWidth>=880?"w-3/4":screenWidth<880 && screenWidth>=835?"w-3/4":"w-full"}
            `}
              aria-placeholder="dd/mm/yyyy"
              onClick={handleViewCalenda}
            >
              {formatDate(selectedDate)}
              <CalendarDaysIcon className="w-7 h-7" />
            </button>
          </div>
        </div>
        <div className={`${screenWidth<835?"w-full mt-8":"w-1/2"}`}>
          {isView&&
          <div className="flex justify-center">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DateCalendar", "DateCalendar"]}>
                <DemoItem>
                  <DateCalendar
                    value={selectedDate}
                    onChange={handleDateChange}
                  />
                </DemoItem>
              </DemoContainer>
            </LocalizationProvider>
          </div>}
        </div>
      </CardBody>
      <div className="flex flex-row h-full w-full">
        <a className="mx-auto my-2">
          <Button variant="text" className="flex items-center gap-2" onClick={onPrevClick}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
              />
            </svg>
            Previous
          </Button>
        </a>
        <a className="mx-auto my-2">
          <Button variant="text" className="flex items-center gap-2" onClick={onNextClickHandler}>
            Next
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
              />
            </svg>
          </Button>
        </a>
      </div>
    </Card>
  );
};

export default Healthcheckup;
