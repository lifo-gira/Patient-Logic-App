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

import { motion } from "framer-motion";

const Healthcheckup = ({ onNextClick, onPrevClick, onDataSubmit }) => {
  const [isView, setIsview] = useState(false);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const formatDate = (date) => {
    return date.format("DD/MM/YYYY");
  };

  const handleViewCalenda = () => {
    setIsview(!isView);
  };

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

  const handleHeightChange = (e) => {
    const newHeight = e.target.value;
    setheight(newHeight);
    calculateBMI(newHeight, weight);
    console.log("Height:", newHeight);
  };

  const handleWeightChange = (e) => {
    const newWeight = e.target.value;
    setweight(newWeight);
    calculateBMI(height, newWeight);
    console.log("Weight:", newWeight);
  };

  const calculateBMI = (height, weight) => {
    const heightInMeters = height / 100;
    const bmiValue = weight / (heightInMeters * heightInMeters);
    if (height === 0 || height === "" || weight === "0" || weight === "") {
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
      selectedDate: selectedDate.format("DD/MM/YYYY"),
      height: height,
      weight: weight,
      bmi: bmi,
    });

    onNextClick();
  };

  const textVariants = {
    hidden: { x: "10%" }, // Initial position off-screen
    visible: { x: 0, transition: { type: "tween", duration: 0.3 } }, // Sliding animation to the center
  };

  const botvariant = {
    hidden: { x: "120%" }, // Initial position off-screen
    visible: {
      x: 0,
      transition: { type: "spring", duration: 1, delay: 0.7, bounce: 0.4 },
    }, // Sliding animation to the center
  };

  const botcontentvariant = {
    hidden: { opacity: 0 }, // Initial opacity set to 0
    visible: { opacity: 1, transition: { delay: 1.2, duration: 1 } }, // Opacity transition from 0 to 1 with delay
  };
  return (
    <Card
      className={`w-full  flex-col ${
        screenWidth < 835 ? "h-full pb-4 mb-8" : "p-0 pb-4 h-[31.5rem]"
      } `}
    >
      <Typography
        variant="h4"
        color="blue-gray"
        className={` py-2 font-poppins ${
          screenWidth < 970 ? "w-full " : "mr-auto pl-12 pt-4"
        }`}
      >
        Update your height and weight from your recent report
      </Typography>
      <CardBody
        className={`flex flex-row px-5 ${
          screenWidth < 835 ? "flex-col w-full h-full justify-center" : "h-[30rem] pb-4"
        }`}
      >
        <div className={`${screenWidth < 835 ? "w-full" : "w-1/2"}`}>
          <Typography
            color="blue-gray"
            className={`text-start text-lg font-medium font-poppins mb-6 px-8 ${
              screenWidth < 350 ? "w-full text-center" : "text-center"
            }`}
          >
            Choose your height and weight
          </Typography>
          <div
            className={`flex flex-col w-full gap-6 ${
              screenWidth < 350 ? "px-2" : "px-8"
            }`}
          >
           <div className={`w-full flex flex-row gap-4`}>
              <div className={`w-full`}>
                <input
                  type="number"
                  placeholder="00"
                  className={`w-1/2 h-16 py-2 px-5 rounded-md border-2 border-black  text-start text-lg text-black font-semibold font-poppins`}
                  value={height}
                  onChange={handleHeightChange}
                />
                <Typography color="blue-gray" className={`font-poppins`}>
                  Height in cm
                </Typography>
              </div>

              <div className={`w-full`}>
                <input
                  type="number"
                  placeholder="00"
                  className={`w-1/2 h-16 py-2 px-5 rounded-md border-2 border-black  text-start text-lg text-black font-semibold font-poppins`}
                  value={weight}
                  onChange={handleWeightChange}
                />
                <Typography color="blue-gray" className={`font-poppins`}>
                  Weight in Kg
                </Typography>
              </div>
            </div>
            
              <div
                className={`w-full px-5 rounded-md  text-center text-lg text-black font-semibold font-poppins `}
              >
                {bmi != "NA" && bmi != null && (
                <div className="w-full h-full">
                Your BMI : {bmi}
                </div>
                )}
              </div>
          </div>
          <div
            className={`flex flex-col w-full  gap-4 ${
              screenWidth < 350 ? "px-2" : "px-8"
            }`}
          >
            <Typography
              color="blue-gray"
              className={`text-start  mt-6 font-poppins ${
                screenWidth < 455
                  ? "font-medium text-base"
                  : "text-lg font-medium"
              }`}
            >
              Date of Report (select your report date)
            </Typography>
            <motion.div
              initial="hidden" // Initial animation state
              animate="visible" // Animation to the center
              variants={textVariants} // Animation variants
            >
              <button
                className={`w-1/2 py-2 px-5 rounded-md border border-black text-start text-lg flex items-center justify-between font-poppins ${
                  screenWidth >= 880
                    ? "w-3/4"
                    : screenWidth < 880 && screenWidth >= 835
                    ? "w-3/4"
                    : "w-full"
                }
            `}
                aria-placeholder="dd/mm/yyyy"
                onClick={handleViewCalenda}
              >
                {formatDate(selectedDate)}
                <CalendarDaysIcon className="w-7 h-7" />
              </button>
            </motion.div>
          </div>
        </div>
        <div className={`${screenWidth < 835 ? "w-full mt-8" : "w-1/2"}`}>
          {isView && (
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
            </div>
          )}
        </div>
      </CardBody>
      <div className={`flex flex-row w-full justify-center items-center ${screenWidth<835?"h-full":"h-12"}`}>
        <a className="mx-auto my-2">
          <Button
            variant="text"
            className="flex items-center gap-2"
            onClick={onPrevClick}
          >
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
          <Button
            variant="text"
            className="flex items-center gap-2"
            onClick={onNextClickHandler}
          >
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
