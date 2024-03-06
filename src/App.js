import { Route, Routes } from "react-router-dom";
import Login from "./Login.js";
import Home from "./Home.js";
import Header from "./Componenets/Header.jsx";
import { useEffect, useState } from "react";
import Diagno from "./Componenets/Diagno.jsx";
import Live from "./Componenets/Live.jsx";
import Test from "./Componenets/Test.jsx";
import Profilebar from "./Introduction/Profilebar.jsx";
import Finalreport from "./Introduction/Finalreport.jsx";
import Profile from "./Componenets/patient/Profile.jsx";
import VideoCall from "./Componenets/patient/VideoCall.js";
import Flashscreen from "./additionals/Flashscreen.jsx";

import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";
import { motion } from "framer-motion";

import Chatbot from "../src/assets/chatbot.png";

function App() {
  const [status, setStatus] = useState(localStorage.getItem("isLoggedIn"));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [screenHeigh, setScreenHeight] = useState(window.innerHeight);
  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      setScreenWidth(window.innerWidth);
      setScreenHeight(window.innerHeight);
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
  const botvariant = {
    hidden: { x: "200%" }, // Initial position off-screen
    visible: {
      x: 0,
      transition: { type: "spring", duration: 1, delay: 0.7, bounce: 0.4 },
    }, // Sliding animation to the center
  };

  const botcontentvariant = {
    hidden: { opacity: 0 }, // Initial opacity set to 0
    visible: { opacity: 1, transition: { delay: 1.2, duration: 1 } }, // Opacity transition from 0 to 1 with delay
  };

  const [chatflag, setchatflag] = useState(false);
  const [chat1, setchat1] = useState(false);
  const [chat2, setchat2] = useState(false);
  const handlechatflag = () => {
    setchatflag(true);
  };
  const handlechat1 = () => {
    setchat1(true);
    setchat2(false);
  };
  const handlechat2 = () => {
    setchat1(false);
    setchat2(true);
  };
  const handledischat = () => {
    setchatflag(false);
    setchat1(false);
    setchat2(false);
  };

  return (
    <div className="overflow-hidden">
    <Routes >
      {/* <Route path="*" element={<App />} /> */}
      <Route path="/" element={<Header />} />
      <Route element={<Home />} path="/home" />
      <Route element={<Login />} path="/login" />
      <Route element={<Diagno />} path="/diagnostics" />
      <Route element={<Profile />} path="/profile" />
      <Route
        element={
          <Profilebar
            chatbot={handlechatflag}
            chatcont1={handlechat1}
            chatcont2={handlechat2}
            dischat={handledischat}
          />
        }
        path="/introduction"
      />
      <Route element={<Finalreport />} path="/finalreport" />
      <Route element={<VideoCall />} path="/videocall" />
      {/* <Route element={<Flashscreen />} path="/flashscreen" /> */}
      {/* <Route element={<Live />} path="/live" /> */}
      
    </Routes>
    {chatflag && chat1 && (
        <div
          className={` bottom-1 right-4  flex flex-row ${
            screenWidth === 1024 && screenHeigh === 600
              ? "w-3/4 items-center text-start mr-4 mt-4 ml-auto"
              : screenWidth < 1900 && screenWidth >= 900
              ? "w-2/3 items-center text-start z-50 fixed"
              : screenWidth < 900 && screenWidth >= 720
              ? "w-5/6 z-50 fixed items-center text-start"
              : screenWidth < 720
              ? "w-full pl-8 z-50 fixed items-center text-start"
              : "w-1/2 items-center text-start z-50 fixed"
          }`}
        >
          <motion.div
            initial="hidden" // Initial animation state
            animate="visible" // Animation to the center
            variants={botcontentvariant} // Animation variants
          >
            {chat1 && (
              <Typography className="font-poppins italic font-normal">
                Choose the correct Height and Weight to give a better service to
                you. Choose from the calender, to update the recent report date
              </Typography>
            )}
          </motion.div>
          <motion.div
            initial="hidden" // Initial animation state
            animate="visible" // Animation to the center
            variants={botvariant} // Animation variants
          >
            <button className="imganim cursor-default">
              <img src={Chatbot} alt="" className="w-32 h-32 object-cover" />
            </button>
          </motion.div>
        </div>
      )}
      {chatflag && chat2 && (
        <div
          className={` bottom-1 right-4 z-50 flex flex-row ${
            screenWidth === 1024 && screenHeigh === 600
              ? "w-5/6 items-center text-start mr-4 mt-4 ml-auto"
              : screenWidth < 1900 && screenWidth >= 900
              ? "w-2/3 items-center text-start z-50 fixed"
              : screenWidth < 900 && screenWidth >= 720
              ? "w-5/6 z-50 fixed items-center text-start"
              : screenWidth < 720
              ? "w-full pl-8 z-50 fixed items-center text-start"
              : "w-1/2 items-center text-start z-50 fixed"
          }`}
        >
          <motion.div
            initial="hidden" // Initial animation state
            animate="visible" // Animation to the center
            variants={botcontentvariant} // Animation variants
          >
            {chat2 && (
              <Typography className="font-poppins italic font-normal">
                <span className="font-medium">
                  Click On the Top Right Icon to watch the tutorial.
                </span>{" "}
                <br />
                Example If you are having pain at joints in leg, then click on
                the knee body part, you will get symptoms related to it
              </Typography>
            )}
          </motion.div>
          <motion.div
            initial="hidden" // Initial animation state
            animate="visible" // Animation to the center
            variants={botvariant} // Animation variants
          >
            <button className="imganim cursor-default">
              <img src={Chatbot} alt="" className="w-32 h-32 object-cover" />
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default App;
