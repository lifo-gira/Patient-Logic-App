import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";

export function Intro({ onNextClick }) {
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
  return (
    <Card className="w-full h-full p-2 flex-col">
      <div className={`flex flex-row ${screenWidth<720?"flex-wrap":""}`}>
      <div className="flex flex-col justify-between w-full">
        <CardBody>
          <Typography variant="h4" color="blue-gray" className={`mb-4`}>
            Introduction
          </Typography>
          <Typography color="gray" className={`font-normal text-justify ${screenWidth<720?"mb-0":"mb-8"}`}>
            Like so many organizations these days, Autodesk is a company in
            transition. It was until recently a traditional boxed software company
            selling licenses. Yet its own business model disruption is only part
            of the story. Like so many organizations these days, Autodesk is a
            company in transition. It was until recently a traditional boxed
            software company selling licenses. Yet its own business model disruption
            is only part of the story. Like so many organizations these days,
            Autodesk is a company in transition.
          </Typography>
          
        </CardBody>
      </div>
      <CardHeader shadow={false} floated={false} className={`m-0 w-full md:w-2/5 shrink-0 ${screenWidth<720?"w-full h-full shrink":"w-full"}`}>
        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80"
          alt="card-image"
          className={`object-cover p-2 ${screenWidth<720?"w-full h-full p-5":"h-full w-full"}`}
        />
      </CardHeader>
      </div>
      <a href="#" className={`flex justify-center items-center py-4 ${screenWidth<720?"w-full h-full shrink":"w-3/5"}`}>
            <Button
              variant="text"
              className="flex items-center gap-2"
              onClick={onNextClick}
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
    </Card>
  );
}
