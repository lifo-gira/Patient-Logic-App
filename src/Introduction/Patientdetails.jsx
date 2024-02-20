import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";

import Healthyman from "../assets/healthyman.png";
import Patient from "../assets/patient.png";
import Male from "../assets/male.png";
import Female from "../assets/female.png";

const Patientdetails = ({ onNextClick, onPrevClick,onflag , onDataSubmit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currval, setCurrval] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const data = {
    sets: [
      {
        title: "Any accident / surgeries happended before",
        alt_title: "Accident",
        options: ["No", "Yes"],
        images: [Healthyman, Patient],
        colo: ["cyan", "red"],
      },
      {
        title: "Gender",
        alt_title: "Gender",
        options: ["Male", "Female"],
        images: [Male, Female],
        colo: ["gray", "gray"],
      },
    ],
  };
  const handleNext = () => {
    setCurrentIndex((prevIndex) => {
      let nextIndex = (prevIndex + 1) % data.sets.length;
  
      if (nextIndex === 0) {
        // If the next index is 0, it means we have reached the end
        if(onflag){
          onNextClick();
        }else{
          nextIndex=data.sets.length-1;
        }
        if (nextIndex === 0) {
        onDataSubmit(selectedOptions);
      }
        return nextIndex;
      }
  
      return nextIndex;
    });
  
    setCurrval(null);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex === 0 && onflag) {
        onPrevClick();
      }
  
      const nextIndex = prevIndex === 0 ? 0 : prevIndex - 1;
  
      return nextIndex;
    });
    setCurrval(null);
  };

  const handleCardClick = (index) => {
    setCurrval(index);
    setSelectedOptions((prevOptions) => {
      return {
        ...prevOptions,
        [currentSet.alt_title]: currentSet.options[index],
      };
    });

  };
  const currentSet = data.sets[currentIndex];

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
    <Card className="w-full h-full p-0 flex-col">
      <Typography variant="h4" color="blue-gray" className={`p-2 mr-auto  ${screenWidth<830?"w-full":"pl-12"}`}>
        {currentSet.title}
      </Typography>
      <CardBody >
        <div className={`${screenWidth<830?"flex flex-col gap-8 justify-center items-center w-full":"flex flex-row "}`}>
        <div className={`${screenWidth>830?"w-1/2":"w-full flex justify-center"}`}>
          <Card
            className={`h-80 w-80 flex items-center mx-auto border-black border-solid border-2 cursor-pointer ${currval === 0 ? "border-blue-500 border-4" : ""}`}
            onClick={() => handleCardClick(0)}
          >
            <div className="my-auto">
              <img src={currentSet.images[0]} className="h-36 w-36" />
            </div>
            <CardBody className="text-center">
              <Typography
                variant="h4"
                color={currentSet.colo[0]}
                className="mb-2"
              >
                {currentSet.options[0]}
              </Typography>
            </CardBody>
          </Card>
        </div>
        <div className={`${screenWidth>830?"w-1/2":"w-full flex justify-center"}`}>
          <Card
            className={`h-80 w-80 mx-auto flex items-center border-black border-solid border-2 cursor-pointer ${currval === 1 ? "border-blue-500 border-4" : ""}`}
            onClick={() => handleCardClick(1)}
          >
            <div className="my-auto">
              <img src={currentSet.images[1]} className="w-36 h-36" />
            </div>

            <CardBody className="text-center">
              <Typography
                variant="h4"
                color={currentSet.colo[1]}
                className="mb-2"
              >
                {currentSet.options[1]}
              </Typography>
            </CardBody>
          </Card>
        </div>
        </div>
      </CardBody>
      <div className="flex flex-row h-full my-6">
        <a className="mx-auto my-auto">
          <Button
            variant="text"
            className="flex items-center gap-2"
            onClick={handlePrev}
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
        <a className="mx-auto my-auto">
          <Button
            variant="text"
            className="flex items-center gap-2"
            onClick={handleNext}
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

export default Patientdetails;
