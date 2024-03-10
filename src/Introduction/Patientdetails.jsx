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

import Acci1 from "../assets/acci1.png";
import Acci2 from "../assets/acci2.png";
import Health1 from "../assets/health1.png";
import Health2 from "../assets/health2.png";

import { motion } from "framer-motion";

import Tab from "../assets/tablets.png";
import Tab1 from "../assets/tablets1.png";
import Heart from "../assets/heart.png";
import Injection from "../assets/injection.png";

const Patientdetails = ({ onNextClick, onPrevClick, onflag, onDataSubmit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currval, setCurrval] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [acci, setacci] = useState(0);
  const [healt, sethealt] = useState(1);
  const [health, sethealth] = useState(null);
  const [gender, setgender] = useState(null);
  const [isRotatedm, setIsRotatedm] = useState(false);
  const [isRotatedf, setIsRotatedf] = useState(false);

  const data = {
    sets: [
      {
        title: "Any accident / surgeries happended before",
        alt_title: "Accident",
        options: ["Yes", "No"],
        images: [Acci1, Health1, Acci2, Health2],
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
        if (onflag) {
          onNextClick();
        } else {
          nextIndex = data.sets.length - 1;
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
    if (index === 0) {
      setacci(2);
      sethealt(1);
    } else {
      sethealt(3);
      setacci(0);
    }
    if (currentIndex === 0) {
      sethealth(index);
    } else {
      if (index === 0) {
        setIsRotatedm(!isRotatedm);
      } else {
        setIsRotatedf(!isRotatedf);
      }
      setgender(index);
    }
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

  const tabvariant = {
    hidden: { y: "100%" }, // Initial position off-screen
    visible: {
      y: 0,
      transition: { type: "spring", duration: 1, delay: 1.4, bounce: 0.5 },
    }, // Sliding animation to the center
  };

  const heartvariant = {
    hidden: { y: "200%" }, // Initial position off-screen
    visible: {
      y: 0,
      transition: { type: "spring", duration: 1, delay: 1.4, bounce: 0.4 },
    }, // Sliding animation to the center
  };

  const injectionvariant = {
    hidden: { y: "100%" }, // Initial position off-screen
    visible: {
      y: 0,
      transition: { type: "spring", duration: 1, delay: 1.4, bounce: 0.4 },
    }, // Sliding animation to the center
  };

  const cardvariant = {
    hidden: { y: "500%" }, // Initial position off-screen
    visible: {
      y: 0,
      transition: { type: "spring", duration: 1, delay: 1.4, bounce: 0.2 },
    }, // Sliding animation to the center
  };

  return (
    <motion.div
      initial={{ opacity: 0, rotateY: -180 }}
      animate={{ opacity: 1, rotateY: 0 }}
      transition={{ duration: 0.7 }}
      className={`w-full h-full`}
    >
      <div>
        <Card className={`w-full h-full p-0 flex-col  font-poppins rounded-none`}>
          <Typography
            variant="h4"
            color="blue-gray"
            className={`p-2 mr-auto font-poppins  ${
              screenWidth < 1355 ? "w-full" : "pl-12"
            }`}
          >
            {currentSet.title}
          </Typography>
          {currentIndex === 0 && (
            <CardBody>
              <div
                className={`${
                  screenWidth < 1355 && screenWidth >=930
                    ? "flex flex-row gap-8 justify-center items-center w-full":screenWidth<930?"flex flex-col gap-8 justify-center items-center w-full"
                    : "flex flex-row "
                }`}
              >
                <div
                  className={`${
                    screenWidth > 830 ? "w-1/2" : "w-full flex justify-center"
                  }`}
                >
                  <motion.div
                    initial="hidden" // Initial animation state
                    animate="visible" // Animation to the center
                    variants={cardvariant} // Animation variants
                  >
                    <Card
                      className={`h-80 w-80 flex items-center mx-auto shadow-none border-black border-2  cursor-pointer hover:transform hover:scale-105 hover:transition-transform duration-300 ease-in-out ${
                        health === 0 ? " bg-red-100" : ""
                      }`}
                      onClick={() => handleCardClick(0)}
                    >
                      <div className="my-auto">
                        <img
                          src={currentSet.images[acci]}
                          className="h-40 w-40"
                        />
                      </div>
                      <CardBody className="text-center">
                        <Typography
                          variant="h4"
                          color={currentSet.colo[0]}
                          className="mb-2 font-poppins"
                        >
                          {currentSet.options[0]}
                        </Typography>
                      </CardBody>
                    </Card>
                  </motion.div>
                </div>
                <div
                  className={`${
                    screenWidth > 830 ? "w-1/2" : "w-full flex justify-center"
                  }`}
                >
                  <Card
                    className={`h-80 w-80 mx-auto flex items-center shadow-none border-black border-2 hover:transform hover:scale-105 hover:transition-transform duration-300 ease-in-out cursor-pointer ${
                      health === 1 ? "  bg-cyan-50" : ""
                    }`}
                    onClick={() => handleCardClick(1)}
                  >
                    <div className="my-auto">
                      <img
                        src={currentSet.images[healt]}
                        className="w-48 h-40"
                      />
                    </div>

                    <CardBody className="text-center">
                      <Typography
                        variant="h4"
                        color={currentSet.colo[1]}
                        className="mb-2 font-poppins"
                      >
                        {currentSet.options[1]}
                      </Typography>
                    </CardBody>
                  </Card>
                </div>
              </div>
            </CardBody>
          )}
          {currentIndex === 1 && (
            <motion.div
              className="cardBody"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 3 }}
            >
              <CardBody>
                <div
                  className={`${
                    screenWidth < 830
                      ? "flex flex-col gap-8 justify-center items-center w-full"
                      : "flex flex-row "
                  }`}
                >
                  <div
                    className={`${
                      screenWidth > 830 ? "w-1/2" : "w-full flex justify-center"
                    }`}
                  >
                    <Card
                      className={`h-80 w-80 flex items-center mx-auto border-2 border-black   cursor-pointer ${
                        gender === 0 ? "bg-blue-100" : ""
                      }`}
                      onClick={() => handleCardClick(0)}
                    >
                      <div className="my-auto">
                        <motion.div
                          animate={{ rotate: isRotatedm ? 360 : 0 }}
                          transition={{
                            duration: 0.7,
                            type: "tween",
                            ease: "linear",
                          }}
                          // onAnimationComplete={() => setIsRotated(false)}
                        >
                          <img
                            src={currentSet.images[0]}
                            className="h-36 w-36"
                          />
                        </motion.div>
                      </div>
                      <CardBody className="text-center">
                        <Typography
                          variant="h4"
                          color={currentSet.colo[0]}
                          className="mb-2 font-poppins"
                        >
                          {currentSet.options[0]}
                        </Typography>
                      </CardBody>
                    </Card>
                  </div>
                  <div
                    className={`${
                      screenWidth > 830 ? "w-1/2" : "w-full flex justify-center"
                    }`}
                  >
                    <Card
                      className={`h-80 w-80 mx-auto flex items-center border-2 border-black  cursor-pointer ${
                        gender === 1 ? "bg-red-100" : ""
                      }`}
                      onClick={() => handleCardClick(1)}
                    >
                      <div className="my-auto">
                        <motion.div
                          animate={{ rotate: isRotatedf ? 360 : 0 }}
                          transition={{
                            duration: 0.7,
                            type: "tween",
                            ease: "linear",
                          }}
                          // onAnimationComplete={() => setIsRotated(false)}
                        >
                          <img
                            src={currentSet.images[1]}
                            className="w-36 h-36"
                          />
                        </motion.div>
                      </div>

                      <CardBody className="text-center">
                        <Typography
                          variant="h4"
                          color={currentSet.colo[1]}
                          className="mb-2 font-poppins"
                        >
                          {currentSet.options[1]}
                        </Typography>
                      </CardBody>
                    </Card>
                  </div>
                </div>
              </CardBody>
            </motion.div>
          )}
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
        {currentIndex === 0 &&(
        <div className={`flex flex-row justify-between`}>
          <motion.div
            initial="hidden" // Initial animation state
            animate="visible" // Animation to the center
            variants={injectionvariant} // Animation variants
          >
            <img
              src={Injection}
              alt="card-image"
              className={`w-28 h-28 `}
              style={{ transform: "translateX(-35%)" }}
            />
          </motion.div>

          <motion.div
            initial="hidden" // Initial animation state
            animate="visible" // Animation to the center
            variants={heartvariant} // Animation variants
          >
            <img
              src={Heart}
              alt="card-image"
              className={`w-24 h-24 `}
              style={{ transform: "translateY(-50%)" }}
            />
          </motion.div>

          <motion.div
            initial="hidden" // Initial animation state
            animate="visible" // Animation to the center
            variants={tabvariant} // Animation variants
          >
            <img
              src={Tab}
              alt="card-image"
              className={`w-15 h-28 `}
              style={{ transform: "translateX(45%)" }}
            />
          </motion.div>
        </div>
        )}
        {currentIndex === 1 &&(
        <div className={`flex flex-row justify-between`}>
          <img
            src={Heart}
            alt="card-image"
            className={`w-24 h-24 `}
            style={{ transform: "translate(-50% , -50%)" }}
          />

          <img
            src={Tab1}
            alt="card-image"
            className={`w-15 h-28 `}
            style={{ transform: "translateY(0%)" }}
          />

          <img
            src={Injection}
            alt="card-image"
            className={`w-32 h-28`}
            style={{ transform: "translate(60% , -40%)" }}
          />
        </div>
        )}
      </div>
    </motion.div>
  );
};

export default Patientdetails;
