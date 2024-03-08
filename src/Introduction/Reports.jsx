import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";

import { InformationCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

import { motion } from "framer-motion";

const predefinedKeywords = ["Right Knee Pain", "Left Knee Pain", "Hip Pain"];

const Reports = ({ onNextClick, onPrevClick, onDataSubmit }) => {
  const [initialKeywords] = useState(predefinedKeywords);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const handleAddKeyword = (e) => {
    const selectedKeyword = e.target ? e.target.value : e;
    setInputValue(selectedKeyword);
    if (
      initialKeywords.includes(selectedKeyword) &&
      !selectedKeywords.includes(selectedKeyword)
    ) {
      setSelectedKeywords((prevKeywords) => [...prevKeywords, selectedKeyword]);
      setInputValue("");
    }
  };

  const handleRemoveKeyword = (keyword) => {
    const updatedKeywords = selectedKeywords.filter((kw) => kw !== keyword);
    setSelectedKeywords(updatedKeywords);
  };

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

  const onNextClickHandler = () => {
    onDataSubmit(selectedKeywords);
    onNextClick();
  };

  const textVariants = {
    hidden: { x: "-150%" }, // Initial position off-screen
    visible: {
      x: 0,
      transition: { type: "spring", duration: 0.7, delay: 0, bounce: 0.3 },
    }, // Sliding animation to the center
  };

  return (
    <motion.div
      className={`w-full h-full flex-col `}
      initial="hidden" // Initial animation state
      animate="visible" // Animation to the center
      variants={textVariants} // Animation variants
    >
      <Card
        className={`w-full px-0 pt-0 pb-4 flex-col ${
          screenWidth >= 1350 ? "h-[31.5rem]" : "h-full"
        }`}
      >
        <CardBody
          className={` ${
            screenWidth < 900
              ? "flex flex-col w-full p-5"
              : "flex flex-row p-5 h-[30rem]"
          }`}
        >
          <div className={`${screenWidth < 900 ? "w-full" : "w-1/2"}`}>
            <Typography
              variant="h4"
              color="blue-gray"
              className={` font-poppins py-2 ${
                screenWidth < 600 ? "text-center" : "px-8 text-start"
              }`}
            >
              Having any pain?
            </Typography>

            <div
              className={`container  mt-8  ${
                screenWidth < 900 ? "px-0 mx-auto" : "px-8 mx-auto"
              }`}
            >
              <div className="mb-4 relative text-start">
                <input
                  type="text"
                  className="border p-2 pl-4 w-full rounded-lg border-black focus:outline-none focus:shadow-outline font-poppins"
                  placeholder="Search, Ex:Knee Pain..."
                  onChange={handleAddKeyword}
                  list="keywordsList"
                  value={inputValue}
                />
                <datalist id="keywordsList">
                  {predefinedKeywords.map((keyword, index) => (
                    <option
                      key={index}
                      value={keyword}
                      className="font-poppins"
                    />
                  ))}
                </datalist>
              </div>

              <div className="flex flex-wrap gap-6">
                {selectedKeywords.map((keyword, index) => (
                  <div
                    key={index}
                    className={`py-1 px-4 rounded-md bg-cyan-300 text-start text-lg text-white font- flex items-center justify-between gap-3 font-poppins
            `}
                  >
                    {keyword}
                    <button
                      className="ml-2 text-red-500"
                      onClick={() => handleRemoveKeyword(keyword)}
                    >
                      <XCircleIcon color="white" className="w-6 h-6" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className={`${screenWidth < 900 ? "w-full mt-8" : "w-1/2"}`}>
            <div
              className={`w-full flex justify-end items-center text-black gap-2`}
            >
              <Typography className={`font-poppins font-medium`}>
                Selection Steps
              </Typography>
              <InformationCircleIcon className={`w-8 h-8 cursor-pointer`} />
            </div>
            
          </div>
        </CardBody>
        <div
          className={`flex flex-row ${screenWidth < 900 ? "h-full" : "h-12"}`}
        >
          <a className="mx-auto my-auto">
            <Button
              variant="text"
              className="flex items-center gap-2 bg-cyan-100"
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
          <a className="mx-auto my-auto">
            <Button
              variant="text"
              className="flex items-center gap-2 bg-cyan-100"
              onClick={onNextClickHandler }
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
    </motion.div>
  );
};

export default Reports;
