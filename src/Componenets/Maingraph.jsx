import React, { useState, useEffect } from "react";
import {
  PlayIcon,
  PauseIcon,
  ArrowDownTrayIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/solid";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from "recharts";
import { capitalize } from "@mui/material";

const Maingraph = () => {
  const [isChecked, setIsChecked] = useState(true);
  const [isLegChecked, setIsLegChecked] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [key, setKey] = useState(0);
  const [selectedMinute, setSelectedMinute] = useState("");
  const [selectedSecond, setSelectedSecond] = useState("");
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [isrenderscreen, setIsrenderscreen] = useState(true);

  const timeIntervals = ["1", "1.5", "2"];

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
      // if(screenWidth>=595){
      //   setIsrenderscreen(true);
      // }else{
      //   setIsrenderscreen(false);
      // }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };
  const handleLegCheckboxChange = () => {
    setIsLegChecked(!isLegChecked);
  };
  const handleDeviceStatus = () => {
    setIsConnected(!isConnected);
  };
  const handlePlayPauseClick = () => {
    setIsPlaying(!isPlaying);
  };
  const handleTimerStop = () => {
    setIsPlaying(false);
    // setIsRunning(false); // Restart the timer
    setKey((prevKey) => prevKey + 1);
  };
  const handleMinuteChange = (event) => {
    setSelectedMinute(
      parseInt(event.target.value) > 0 ? parseInt(event.target.value) || 0 : ""
    );
  };
  const handleSecondChange = (event) => {
    setSelectedSecond(
      parseInt(event.target.value) > 0 ? parseInt(event.target.value) || 0 : ""
    );
  };

  const datasets = [
    [
      { name: "Jan", UV: 400, PV: 2400, amt: 2400 },
      { name: "Feb", UV: 300, PV: 4567, amt: 2400 },
      { name: "Mar", UV: 200, PV: 1398, amt: 2400 },
      { name: "Apr", UV: 278, PV: 3908, amt: 2400 },
      { name: "May", UV: 189, PV: 4800, amt: 2400 },
      { name: "Jan", UV: 400, PV: 2400, amt: 2400 },
      { name: "Feb", UV: 300, PV: 4567, amt: 2400 },
      { name: "Mar", UV: 200, PV: 1398, amt: 2400 },
      { name: "Apr", UV: 278, PV: 3908, amt: 2400 },
      { name: "May", UV: 189, PV: 4800, amt: 2400 },
    ],
  ];

  return (
    <div>
      {(screenWidth >= 595 ? isrenderscreen : !isrenderscreen) && (
        <div
          className={
            "w-full"
          }
        >
          <div className="flex justify-center items-center flex-col sm:flex-row">
            <div className="w-full sm:w-1/3 pl-7 mb-2 sm:mb-0 ">
              <div className="flex justify-start items-center">
                <label className="themeSwitcherTwo relative inline-flex cursor-pointer select-none items-center">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                    className="sr-only"
                  />
                  <span className="label flex items-center text-xs font-semibold text-black">
                    PASSIVE
                  </span>
                  <span
                    className={`slider mx-3 flex h-5 w-[40px] items-center rounded-full p-1 duration-200 ${
                      isChecked ? "bg-[#d74848]" : "bg-[#CCCCCE]"
                    }`}
                  >
                    <span
                      className={`dot h-3 w-3 rounded-full bg-white duration-200 ${
                        isChecked ? "translate-x-[20px]" : ""
                      }`}
                    ></span>
                  </span>
                  <span className="label flex items-center text-xs font-semibold text-black">
                    ACTIVE
                  </span>
                </label>
              </div>
            </div>

            <div className="w-full sm:w-1/3 p-2 mb-2 sm:mb-0 justify-center items-center">
              <div className="flex justify-center items-center">
                <label className="themeSwitcherTwo relative inline-flex cursor-pointer select-none items-center">
                  <input
                    type="checkbox"
                    checked={isLegChecked}
                    onChange={handleLegCheckboxChange}
                    className="sr-only"
                  />
                  <span className="label flex items-center text-xs font-semibold text-black">
                    LEFT LEG
                  </span>
                  <span
                    className={`slider mx-3 flex  h-5 w-[40px] items-center rounded-full p-1 duration-200 ${
                      isLegChecked ? "bg-[#212b36]" : "bg-[#47d547]"
                    }`}
                  >
                    <span
                      className={`dot h-3 w-3 rounded-full bg-white duration-200 ${
                        isLegChecked ? "translate-x-[20px]" : ""
                      }`}
                    ></span>
                  </span>
                  <span className="label flex items-center text-xs font-semibold text-black">
                    RIGHT LEG
                  </span>
                </label>
              </div>
            </div>

            <div className="w-full sm:w-1/3 pr-3">
              <div className="flex justify-end items-center">
                <button
                  style={{
                    width: "120px",
                    height: "24px",
                    borderRadius: "20px",
                    cursor: "pointer",
                    position: "relative",
                    overflow: "hidden",
                    transition: "background-color 1s ease-in",
                  }}
                  className={`${
                    isConnected ? "bg-green-500 animate-flash" : "bg-gray-400"
                  } text-black text-xs font-semibold rounded-full justify-center `}
                  onClick={handleDeviceStatus}
                >
                  {isConnected ? "CONNECTED" : "DISCONNECTED"}
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-center items-center">
            <div className="w-1/3 pl-5 flex justify-start items-end">
              <button
                className=" text-black font-bold py-2 px-3 rounded-full transition-all duration-300 ease-in-out"
                onClick={handlePlayPauseClick}
              >
                {isPlaying ? (
                  <PauseIcon className="h-7 w-7" />
                ) : (
                  <PlayIcon className="h-7 w-7" />
                )}
              </button>
            </div>

            <div className="w-1/3 ">
              <div className="flex justify-center items-center">
                {!isPlaying && (
                  <div className="w-full flex justify-center items-center gap-1">
                    <div className="flex flex-col items-center">
                      <input
                        type="number"
                        value={selectedMinute}
                        onChange={handleMinuteChange}
                        className=" text-black text-sm font-bold border rounded-md  w-12 h-6 text-center"
                        placeholder="00"
                      />
                      <span className="w-full text-center text-black font-bold text-[10px]">
                        minutes
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <input
                        type="number"
                        value={selectedSecond}
                        onChange={handleSecondChange}
                        className=" text-black text-sm font-bold border rounded-md w-12 h-6 text-center"
                        placeholder="00"
                      />
                      <span className="w-full text-center text-black font-bold text-[10px]">
                        seconds
                      </span>
                    </div>
                  </div>
                )}

                {isPlaying && (
                  <CountdownCircleTimer
                    key={key}
                    isPlaying={isPlaying}
                    duration={selectedMinute * 60 + selectedSecond} // 2 minutes
                    colors={[["#3c005a"]]}
                    size={60}
                    strokeWidth={3}
                    onComplete={() => {
                      setIsPlaying(false);
                      handleTimerStop();
                      return [false, 0]; // Stop the timer and reset to 0
                    }}
                  >
                    {({ remainingTime }) => (
                      <div className="font-semibold text-base">
                        {`${Math.floor(remainingTime / 60)
                          .toString()
                          .padStart(2, "0")}:${(remainingTime % 60)
                          .toString()
                          .padStart(2, "0")}`}
                      </div>
                    )}
                  </CountdownCircleTimer>
                )}
              </div>
            </div>

            <div className="w-1/3 pr-3 flex justify-end gap-12">
              <button
                className=" text-black font-bold  rounded-full"
                onClick={() => {
                  // Add logic for reset action here
                  setSelectedMinute("");
                  setSelectedSecond("");
                  setKey((prevKey) => prevKey + 1);
                }}
              >
                <ArrowPathIcon className="h-6 w-6  inline" />
              </button>

              <button
                className=" text-black font-bold  rounded-full"
                onClick={() => {
                  console.log("Download button clicked");
                }}
              >
                <ArrowDownTrayIcon className="h-6 w-6  inline" />
              </button>
            </div>
          </div>

          <div className="flex mt-2 border-dashed border-gray-300 border-4 rounded-3xl">
            {/* <div className="w-full pt-3 pb-0 left-0 rounded-3xl ">
          {datasets.map((data) => (
            <LineChart
              width={900}
              height={400}
              data={data}
              margin={{ top: 60, right: 25, left: 0, bottom: 0 }}
            >
              <text
                x="90"
                y="25"
                textAnchor="middle"
                fontSize="24"
                fill="#333333"
                fontWeight="bold"
              >
                Levels Report
              </text>
              <Legend
                wrapperStyle={{ top: 20, left: 20 }}
                iconType="circle"
                iconSize={6}
              />
              <Line
                type="monotone"
                dataKey="UV"
                strokeDasharray="25 10"
                stroke="#8884d8"
                strokeWidth={2.5}
              />
              <Line
                type="monotone"
                dataKey="PV"
                strokeDasharray="25 10"
                stroke="#82ca9d"
                strokeWidth={2.5}
              />
              <XAxis dataKey="name" axisLine={false} />
              <YAxis axisLine={false} />
              <CartesianGrid strokearray="1" horizontal="true" vertical="" />
              <Tooltip />
            </LineChart>
          ))}
        </div> */}
            <div className="flex flex-col justify-center items-center w-full pt-4">
              <div className="w-full pl-6 font-bold text-2xl">
                Levels Report
              </div>

              <div className="w-full">
                <div className="flex flex-col items-center justify-start rounded w-full h-[400px]">
                  {datasets.map((data) => (
                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                      className={"pr-4"}
                    >
                      <LineChart data={data}>
                        <Tooltip
                          cursor={false}
                          wrapperStyle={{
                            backgroundColor: "transparent",
                            padding: "5px",
                            borderRadius: 4,
                            overflow: "hidden",
                            fill: "black",
                            boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                          }}
                          LabelStyle={{ color: "black" }}
                          itemStyle={{ color: "black" }}
                        />
                        <Legend
                          wrapperStyle={{
                            top: -30,
                            left: 20,
                            position: "absolute",
                          }}
                          iconType="circle"
                          iconSize={6}
                        />
                        <Line
                          type="monotone"
                          dataKey="UV"
                          strokeDasharray="25 10"
                          stroke="#8884d8"
                          strokeWidth={2.5}
                        />
                        <Line
                          type="monotone"
                          dataKey="PV"
                          strokeDasharray="25 10"
                          stroke="#82ca9d"
                          strokeWidth={2.5}
                        />
                        <XAxis dataKey="name" axisLine={false} />
                        <YAxis axisLine={false} />
                        <CartesianGrid
                          strokearray="1"
                          horizontal="true"
                          vertical=""
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {(screenWidth < 595 ? isrenderscreen : !isrenderscreen) && (
        <div className="grid grid-rows-6 w-full">
          <div className="flex justify-center">
            <label className="themeSwitcherTwo relative inline-flex cursor-pointer select-none items-center w-40 justify-start">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={handleCheckboxChange}
                className="sr-only"
              />
              <span className="label flex items-center text-xs font-semibold text-black">
                PASSIVE
              </span>
              <span
                className={`slider mx-3 flex h-5 w-[40px] items-center rounded-full p-1 duration-200 ${
                  isChecked ? "bg-[#d74848]" : "bg-[#CCCCCE]"
                }`}
              >
                <span
                  className={`dot h-3 w-3 rounded-full bg-white duration-200 ${
                    isChecked ? "translate-x-[20px]" : ""
                  }`}
                ></span>
              </span>
              <span className="label flex items-center text-xs font-semibold text-black">
                ACTIVE
              </span>
            </label>
          </div>

          <div className="flex justify-center">
            <label className="themeSwitcherTwo relative inline-flex cursor-pointer select-none items-center w-full justify-center">
              <input
                type="checkbox"
                checked={isLegChecked}
                onChange={handleLegCheckboxChange}
                className="sr-only"
              />
              <span className="label flex items-center text-xs font-semibold text-black">
                LEFT LEG
              </span>
              <span
                className={`slider mx-3 flex  h-5 w-[40px] items-center rounded-full p-1 duration-200 ${
                  isLegChecked ? "bg-[#212b36]" : "bg-[#47d547]"
                }`}
              >
                <span
                  className={`dot h-3 w-3 rounded-full bg-white duration-200 ${
                    isLegChecked ? "translate-x-[20px]" : ""
                  }`}
                ></span>
              </span>
              <span className="label flex items-center text-xs font-semibold text-black">
                RIGHT LEG
              </span>
            </label>
          </div>

          <div className="flex justify-center items-center">
            <button
              style={{
                width: "120px",
                height: "24px",
                borderRadius: "20px",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
                transition: "background-color 1s ease-in",
              }}
              className={`${
                isConnected ? "bg-green-500 animate-flash" : "bg-gray-400"
              } text-black text-xs font-semibold rounded-full justify-center `}
              onClick={handleDeviceStatus}
            >
              {isConnected ? "CONNECTED" : "DISCONNECTED"}
            </button>
          </div>

          <div className="flex justify-center gap-12 py-1">
            <button
              className=" text-black font-bold py-2 px-3 rounded-full transition-all duration-300 ease-in-out"
              onClick={handlePlayPauseClick}
            >
              {isPlaying ? (
                <PauseIcon className="h-7 w-7" />
              ) : (
                <PlayIcon className="h-7 w-7" />
              )}
            </button>
            <button
              className=" text-black font-bold  rounded-full"
              onClick={() => {
                setSelectedMinute("");
                setSelectedSecond("");
                setKey((prevKey) => prevKey + 1);
              }}
            >
              <ArrowPathIcon className="h-6 w-7  inline" />
            </button>

            <button
              className=" text-black font-bold  rounded-full"
              onClick={() => {
                console.log("Download button clicked");
              }}
            >
              <ArrowDownTrayIcon className="h-6 w-7  inline" />
            </button>
          </div>

          <div>
            <div className="flex justify-center items-center">
              {!isPlaying && (
                <div className="w-full flex justify-center items-center gap-1 py-1">
                  <div className="flex flex-col items-center">
                    <input
                      type="number"
                      value={selectedMinute}
                      onChange={handleMinuteChange}
                      className=" text-black text-sm font-bold border rounded-md  w-12 h-6 text-center"
                      placeholder="00"
                    />
                    <span className="w-full text-center text-black font-bold text-[10px]">
                      minutes
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <input
                      type="number"
                      value={selectedSecond}
                      onChange={handleSecondChange}
                      className=" text-black text-sm font-bold border rounded-md w-12 h-6 text-center"
                      placeholder="00"
                    />
                    <span className="w-full text-center text-black font-bold text-[10px]">
                      seconds
                    </span>
                  </div>
                </div>
              )}

              {isPlaying && (
                <CountdownCircleTimer
                  key={key}
                  isPlaying={isPlaying}
                  duration={selectedMinute * 60 + selectedSecond} // 2 minutes
                  colors={[["#3c005a"]]}
                  size={60}
                  strokeWidth={3}
                  onComplete={() => {
                    setIsPlaying(false);
                    handleTimerStop();
                    return [false, 0]; // Stop the timer and reset to 0
                  }}
                >
                  {({ remainingTime }) => (
                    <div className="font-semibold text-base">
                      {`${Math.floor(remainingTime / 60)
                        .toString()
                        .padStart(2, "0")}:${(remainingTime % 60)
                        .toString()
                        .padStart(2, "0")}`}
                    </div>
                  )}
                </CountdownCircleTimer>
              )}
            </div>
          </div>

          {/* <div>
          <div className="flex justify-center gap-12 py-1">
            <button
              className=" text-black font-bold  rounded-full"
              onClick={() => {
                setSelectedMinute("");
                setSelectedSecond("");
                setKey((prevKey) => prevKey + 1);
              }}
            >
              <ArrowPathIcon className="h-6 w-6  inline" />
            </button>
  
            <button
              className=" text-black font-bold  rounded-full"
              onClick={() => {
                console.log("Download button clicked");
              }}
            >
              <ArrowDownTrayIcon className="h-6 w-6  inline" />
            </button>
          </div>
        </div> */}

          {/* <div>
          {datasets.map((data, index) => (
            <LineChart
              key={index}
              width={screenWidth < 969 ? screenWidth : 900}
              height={400}
              data={data}
              margin={{ top: 60, right: 25, left: 0, bottom: 0 }}
            >
              <text
                x="90"
                y="25"
                textAnchor="middle"
                fontSize="24"
                fill="#333333"
                fontWeight="bold"
              >
                Levels Report
              </text>
              <Legend
                wrapperStyle={{ top: 20, left: 20 }}
                iconType="circle"
                iconSize={6}
              />
              <Line
                type="monotone"
                dataKey="UV"
                strokeDasharray="25 10"
                stroke="#8884d8"
                strokeWidth={2.5}
              />
              <Line
                type="monotone"
                dataKey="PV"
                strokeDasharray="25 10"
                stroke="#82ca9d"
                strokeWidth={2.5}
              />
              <XAxis dataKey="name" axisLine={false} />
              <YAxis axisLine={false} />
              <CartesianGrid strokearray="1" horizontal="true" vertical="" />
              <Tooltip />
            </LineChart>
          ))}
        </div> */}
        </div>
      )}
    </div>
  );
};

export default Maingraph;
