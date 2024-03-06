import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Checkbox,
} from "@material-tailwind/react";
import { AnimatePresence, motion } from "framer-motion";
import Robo from "../assets/mainrobo.svg";
import "./intro.css";

import Tab from "../assets/tablets.png";
import Heart from "../assets/heart.png";
import Injection from "../assets/injection.png";

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

  const welcomeText = "WELCOME";

  const textVariants = {
    hidden: { x: "120%" }, // Initial position off-screen
    visible: { x: 0, transition: { type: "tween", duration: 0.3, delay: 1 } }, // Sliding animation to the center
  };

  const [showWelcomeText, setShowWelcomeText] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcomeText(true);
    }, 1500); // Delay start of AnimatePresence animation by 2 seconds

    return () => clearTimeout(timer);
  }, []);

  const tabvariant = {
    hidden: { x: "500%", opacity: 0 }, // Initial position off-screen to the right
    visible: {
      x: 0, // Slide to the center
      opacity: 1, // Transition opacity from 0 to 1
      transition: { type: "spring", duration: 1, delay: 2.7, bounce: 0.4 },
    },
  };

  const heartvariant = {
    hidden: { x: "400%", opacity: 0 }, // Initial position off-screen
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", duration: 1, delay: 4, bounce: 0.4 },
    }, // Sliding animation to the center
  };

  const injectionvariant = {
    hidden: { y: "-200%", opacity: 0 }, // Initial position off-screen
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", duration: 1, delay: 4.8, bounce: 0.4 },
    }, // Sliding animation to the center
  };

  const checkboxvariant = {
    hidden: { opacity: 0 }, // Initial opacity set to 0
    visible: { opacity: 1, transition: { delay: 5.7, duration: 1.2 } }, // Opacity transition from 0 to 1 with delay
  };

  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    onNextClick();
  };

  const [checkcondition, setcheckcondition]= useState(false);
  const handlecheckcondition = () =>{
    setcheckcondition(!checkcondition);
  }

  return (
    <motion.div
      initial={{ opacity: 0, rotateY: 0 }}
      animate={{ opacity: 1, rotateY: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full "
    >
      <div className="w-full h-full ">
        <motion.div
          initial="hidden" // Initial animation state
          animate="visible" // Animation to the center
          variants={textVariants} // Animation variants
        >
          <Card className="w-full h-full p-2 flex-col shadow-lg">
            <div
              className={`flex flex-row w-full h-full ${
                screenWidth < 900 ? "flex-wrap" : ""
              }`}
            >
              <div className="flex flex-col justify-between w-full">
                <CardBody>
                  <Typography
                    variant="h4"
                    color="blue-gray"
                    className="mb-4 font-poppins flex justify-start"
                  >
                    {showWelcomeText && (
                      <AnimatePresence>
                        {welcomeText.split("").map((letter, index) => (
                          <motion.span
                            key={index}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            {letter}
                          </motion.span>
                        ))}
                      </AnimatePresence>
                    )}
                  </Typography>
                  <Typography
                    color="gray"
                    className={`font-poppins text-justify text-[14px] ${
                      screenWidth < 720 ? "mb-0" : "mb-8"
                    }`}
                  >
                    Welcome to our patient information collection bot! Our bot
                    is designed to efficiently gather and manage essential
                    details and information from patients. <br />
                    <br />
                    From basic demographic information to medical history and
                    specific health concerns, our bot ensures that all necessary
                    details are captured accurately and securely. With built-in
                    data encryption and privacy measures, patients can trust
                    that their information is handled with the utmost
                    confidentiality and care. <br />
                    <br />
                    Our bot's intuitive interface makes it easy for patients to
                    provide the necessary information without hassle or
                    confusion. By automating the data collection process,
                    healthcare professionals can focus more on delivering
                    quality care and making informed decisions based on
                    comprehensive patient profiles.
                  </Typography>
                  <div className={`w-full flex justify-start`}>
                    <motion.div
                      initial="hidden" // Initial animation state
                      animate="visible" // Animation to the center
                      variants={checkboxvariant} // Animation variants
                    >
                      <Checkbox
                        className={`w-4 h-4 rounded-none border-2 `}
                        onClick={handlecheckcondition}
                        label={
                          <Typography
                            color="blue-gray"
                            className="flex font-poppins font-medium"
                          >
                            I Agree to all the instructions
                          </Typography>
                        }
                      />
                    </motion.div>
                  </div>
                </CardBody>
              </div>
              <CardHeader
                shadow={false}
                floated={false}
                className={`m-0 w-full md:w-2/5 shrink-0 bg-transparent  ${
                  screenWidth < 900
                    ? "w-full h-full shrink flex items-center justify-center mx-auto"
                    : "w-full flex items-center"
                }`}
              >
                <img
                  src={Robo}
                  alt="card-image"
                  className={`object-contain bg-transparent imganim ${
                    screenWidth < 900 ? "w-full h-full p-5" : "w-full h-96"
                  }`}
                />
              </CardHeader>
            </div>
            <a
              href="#"
              className={`flex justify-end items-center pr-10 py-4 cursor-default ${
                screenWidth < 900 ? "w-full h-full shrink" : "full"
              }`}
            >
              <Button
                variant="text"
                className={`flex items-center gap-2 font-poppins bg-cyan-100 ${checkcondition?"cursor-pointer":"cursor-default"}`}
                onClick={handleFlip}
                disabled={checkcondition?false:true}
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
        </motion.div>
        <div className={`flex flex-row justify-between`}>
          <motion.div
            initial="hidden" // Initial animation state
            animate="visible" // Animation to the center
            variants={tabvariant} // Animation variants
          >
            <img
              src={Tab}
              alt="card-image"
              className={`w-15 h-28 `}
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
              className={`w-24 h-24`}
              style={{ transform: "translateY(-50%)" }}
            />
          </motion.div>
          <motion.div
            initial="hidden" // Initial animation state
            animate="visible" // Animation to the center
            variants={injectionvariant} // Animation variants
          >
            <img
              src={Injection}
              alt="card-image"
              className={`w-28 h-28`}
              style={{ transform: "translateX(45%)" }}
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
