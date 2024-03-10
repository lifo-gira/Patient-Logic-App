import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";

import {
  InformationCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

import { motion } from "framer-motion";
import Human from "../../src/assets/humanbg.png";
import { ToastContainer, toast } from "react-toastify";

const predefinedKeywords = ["Right Knee Pain", "Left Knee Pain", "Right Arm Pain", "Left Arm Pain"];

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
    console.log("Remove Input", keyword);
    const updatedKeywords = selectedKeywords.filter((kw) => kw !== keyword);
    console.log("Update", updatedKeywords);
    setSelectedKeywords(updatedKeywords);
  
    console.log("Removed", selectedKeywords);
    if (selectedKeywords.length === 1) {
      setSelectedKeywords([]);
    }
  
    // Adding a setTimeout to log the final state after a delay
    setTimeout(() => {
      console.log("Final", selectedKeywords);
    }, 5000); // Adjust the delay time (in milliseconds) as needed
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

  const [clickedRegion, setClickedRegion] = useState(null);

  const handleRegionClick = (regionName) => {
    if (selectedKeywords.includes(regionName)) {
      console.warn(`Region ${regionName} is already selected.`);
      toast.warning(`${regionName} is already selected.`, {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
    setClickedRegion(regionName);
    selectedKeywords.push(regionName);
    console.log("SelectedKeywords",selectedKeywords)
  };
  

  const rightarm =
    "21.5% 21%, 22% 24%, 21% 26%, 20% 28%, 22% 29%, 25% 30%, 27.8% 30.5%, 27.4% 29%, 27.8% 30%, 32.5% 25%, 32.5% 25%, 32% 21%, 30% 21%, 25% 21%";
  const leftarm =
    "70% 21%, 70% 21%, 70% 21%, 76% 21%, 79% 21%, 78.5% 24%, 80% 26%, 80% 27%, 79% 29.5%, 75% 24%, 81.5% 29%, 77% 29.5%, 75.5% 29.8%, 73% 30%, 72% 30%, 69.5% 27%, 68% 25%, 68% 25%, 67% 23%, 67% 21%";
  const rightKnee =
    "32% 60%, 31.5% 61%, 32% 63%, 31% 65%, 31% 67%, 35% 67%, 38% 67%, 40% 67%, 44% 67%, 44% 64%, 45% 62%, 45.8% 55.8%, 45% 60%, 37% 60%, 37% 60%";
  const leftKnee =
    "55% 60%, 55% 62%, 56.5% 64%, 56.5% 67%, 59% 67%, 60% 67%, 64% 67%, 66% 67%, 69.3% 67%, 68.2% 64%, 68% 63%, 68% 61%, 68% 60%, 64% 60%, 62% 60%, 58% 60%";

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
              : "flex flex-row p-5 h-[29rem]"
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
                  placeholder="Search, Ex:Arm Pain..."
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
          <div className={`${screenWidth < 900 ? "w-full mt-8" : "w-1/2 h-full"}`}>
            <div
              className={`w-full h-12 flex justify-end items-center text-black gap-2`}
            >
              <Typography className={`font-poppins font-medium`}>
                Selection Steps
              </Typography>
              <InformationCircleIcon className={`w-8 h-8 cursor-pointer`} />
            </div>
            <div className={`w-full h-full flex justify-center items-center`}>
              <div className="relative w-1/2 h-full ">
                <img
                  src={Human}
                  alt="Highlighted Image"
                  className="w-full h-full"
                />
                <div className="absolute inset-0">
                  <div
                    className="absolute inset-0"
                    style={{ clipPath: `polygon(${rightarm})` }}
                    // onClick={() => handleRegionClick("Right Arm Pain")}
                  >
                    {(clickedRegion === "Right Arm Pain" || (selectedKeywords.includes("Right Arm Pain") && selectedKeywords != "")) && (
                      <div className="absolute inset-0 bg-cyan-700"></div>
                    )}
                  </div>
                  <div
                    className="absolute inset-0"
                    style={{ clipPath: `polygon(${leftarm})` }}
                    // onClick={() => handleRegionClick("Left Arm Pain")}
                  >
                    {(clickedRegion === "Left Arm Pain" || (selectedKeywords.includes("Left Arm Pain") && selectedKeywords != "")) && (
                      <div className="absolute inset-0 bg-cyan-700"></div>
                    )}
                  </div>
                  <div
                    className="absolute inset-0"
                    style={{ clipPath: `polygon(${rightKnee})` }}
                    // onClick={() => handleRegionClick("Right Knee Pain")}
                  >
                    {(clickedRegion === "Right Knee Pain" || (selectedKeywords.includes("Right Knee Pain") && selectedKeywords != "")) && (
                      <div className="absolute inset-0 bg-cyan-700"></div>
                    )}
                  </div>
                  <div
                    className="absolute inset-0"
                    style={{ clipPath: `polygon(${leftKnee})` }}
                    // onClick={() => handleRegionClick("Left Knee Pain")}
                  >
                    {(clickedRegion === "Left Knee Pain" || (selectedKeywords.includes("Left Knee Pain") && selectedKeywords != "") )&& (
                      <div className="absolute inset-0 bg-cyan-700"></div>
                    )}
                  </div>
                </div>
                
              </div>
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
      <ToastContainer />
    </motion.div>
  );
};

export default Reports;