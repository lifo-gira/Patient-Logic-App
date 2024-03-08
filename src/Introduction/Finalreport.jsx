import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Chip,
  Accordion,
  AccordionHeader,
  AccordionBody,
  Alert,
  Button,
  Avatar,
  Drawer,
  Select,
  Option,
} from "@material-tailwind/react";
import {
  ArrowDownIcon,
  ArrowDownTrayIcon,
  ArrowUpIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Cog6ToothIcon,
  PowerIcon,
  ShareIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/solid";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
} from "recharts";
import { PieChart, Pie, Sector, Cell } from "recharts";

import {
  CircularProgressbar,
  buildStyles,
  CircularProgressbarWithChildren,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowDropDownIcon } from "@mui/x-date-pickers";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const Finalreport = () => {
  const [patientInfo, setPatientInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  var storedData = localStorage.getItem("user");

  // Parse the stored data from JSON
  var parsedData = JSON.parse(storedData);

  // Access the user_id property
  var userId = parsedData._id;
  // console.log(userId);
  const data = [
    {
      name: "18-24",
      uv: 31.47,
      pv: 2400,
      fill: "#8884d8",
    },
    {
      name: "25-29",
      uv: 26.69,
      pv: 4567,
      fill: "#83a6ed",
    },
    {
      name: "30-34",
      uv: 15.69,
      pv: 1398,
      fill: "#8dd1e1",
    },
    {
      name: "35-39",
      uv: 8.22,
      pv: 9800,
      fill: "#82ca9d",
    },
  ];

  // const data1 = [
  //   {
  //     name: "Page A",
  //     uv: 4000,
  //     pv: 2400,
  //     rv: 4000,
  //     amt: 2400,
  //   },
  //   {
  //     name: "Page B",
  //     uv: 3000,
  //     pv: 1398,
  //     rv: 5000,
  //     amt: 2210,
  //   },
  //   {
  //     name: "Page C",
  //     uv: 2000,
  //     pv: 9800,
  //     rv: 6000,
  //     amt: 2290,
  //   },
  //   {
  //     name: "Page D",
  //     uv: 2780,
  //     pv: 3908,
  //     rv: 7000,
  //     amt: 2000,
  //   },
  //   {
  //     name: "Page E",
  //     uv: 1890,
  //     pv: 4800,
  //     rv: 1000,
  //     amt: 2181,
  //   },
  //   {
  //     name: "Page F",
  //     uv: 2390,
  //     pv: 3800,
  //     rv: 2000,
  //     amt: 2500,
  //   },
  //   {
  //     name: "Page G",
  //     uv: 3490,
  //     pv: 4300,
  //     rv: 3000,
  //     amt: 2100,
  //   },
  // ];

  const style = {
    top: "50%",
    right: 0,
    transform: "translate(0, -50%)",
    lineHeight: "30px",
  };

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [screenheight, setScreenHeight] = useState(window.innerHeight);
  const [isside, setisside] = useState(true);
  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      setScreenWidth(window.innerWidth);
      setScreenHeight(window.innerHeight);
      setisside(windowWidth < 1535);
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

  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const openDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(!isClicked);
  };

  const [open, setOpen] = useState(1); // Track the selected item
  const handleItemClick = (itemNumber) => {
    setOpen(itemNumber);
  };

  const [exerciseData, setExerciseData] = useState({});
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
  // const [userId, setUserId] = useState(""); // Assuming you have userId state variable

  useEffect(() => {
    const fetchPatientInfo = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/patient-info/${userId}`
        );
        const data = await response.json();

        if (response.ok) {
          console.log("Fetched patient information:", data.Exercises);

          // Extract exercise names and values
          const parsedExerciseData = data.Exercises.data.map((exercise) => ({
            name: exercise.name,
            values: exercise.values.map((value) => parseFloat(value)),
          }));

          console.log("Parsed exercise data:", parsedExerciseData);
          setExerciseData(parsedExerciseData);
        } else {
          setError(data?.detail || "Failed to fetch patient information");
        }
      } catch (error) {
        setError("Error fetching patient information");
      } finally {
        setLoading(false);
      }
    };

    fetchPatientInfo();
  }, [userId]);

  // Generate formatted data with each index containing an object of exercise values
  const formattedData = Object.values(exerciseData).flatMap((exercise) =>
    exercise.values.map((value, index) => ({
      index: index,
      [exercise.name]: value,
    }))
  );

  // Group the points by index
  const groupedData = formattedData.reduce((grouped, item) => {
    const { index, ...rest } = item;
    if (!grouped[index]) {
      grouped[index] = {};
    }
    Object.assign(grouped[index], rest);
    return grouped;
  }, {});

  // Convert grouped data back to an array of objects
  const finalData = Object.entries(groupedData).map(([index, values]) => ({
    index: parseInt(index), // Convert index back to integer if needed
    ...values,
  }));
  // console.log(finalData);

  const topbar = {
    hidden: { y: "-200%", opacity: 0 }, // Initial position off-screen
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", duration: 1, delay: 0.5, bounce: 0.4 },
    }, // Sliding animation to the center
  };

  const iconanime = {
    hidden: { y: "500%", opacity: 0 }, // Initial position off-screen
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", duration: 1.5, delay: 2, bounce: 0.4 },
    }, // Sliding animation to the center
  };
  const iconanime1 = {
    hidden: { y: "500%", opacity: 0 }, // Initial position off-screen
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", duration: 1.5, delay: 2.2, bounce: 0.4 },
    }, // Sliding animation to the center
  };

  const textVariants = {
    hidden: { x: "120%" }, // Initial position off-screen
    visible: { x: 0, transition: { type: "tween", duration: 0.3, delay: 1.5 } }, // Sliding animation to the center
  };

  const piedata = [
    { name: "Max Angle", value: 400 },
    { name: "Min Angle", value: 300 },
    { name: "Flexion", value: 300 },
    { name: "Extension", value: 200 },
  ];

  const areadata = [
    { name: "0", uv: null, pv: 2400, amt: 2400 },
    { name: "30", uv: null, pv: 1398, amt: 2210 },
    { name: "60", uv: null, pv: 9800, amt: 2290 },
    { name: "90", uv: null, pv: 3908, amt: 2000 },
    { name: "120", uv: null, pv: 4800, amt: 2181 },
    { name: "150", uv: null, pv: 3800, amt: 2500 },
    { name: "180", uv: null, pv: 4300, amt: 2100 },
  ];

  const originalUVValues = [
    4000, // Original uv value for name: "0"
    3000, // Original uv value for name: "30"
    2000, // Original uv value for name: "60"
    2780, // Original uv value for name: "90"
    1890, // Original uv value for name: "120"
    2390, // Original uv value for name: "150"
    3490, // Original uv value for name: "180"
  ];

  const gradientOffset = () => {
    const dataMax = Math.max(...data.map((i) => i.uv));
    const dataMin = Math.min(...data.map((i) => i.uv));

    if (dataMax <= 0) {
      return 0;
    }
    if (dataMin >= 0) {
      return 1;
    }

    return dataMax / (dataMax - dataMin);
  };

  const off = gradientOffset();

  const [data1, setData1] = useState(areadata);
  const [sliderValue, setSliderValue] = useState(0);

  // Separate variable to store original UV values

  // Handle slider change
  const handleSliderChange = (event) => {
    const value = parseInt(event.target.value);
    setSliderValue(value);

    // Update data with original UV values up to the current index
    const updatedData = areadata.map((item, index) => {
      if (index <= value && item.uv === null) {
        return { ...item, uv: originalUVValues[index] };
      } else if (index > value && item.uv !== null) {
        return { ...item, uv: null };
      }
      return item;
    });

    // Set the updated data
    setData1(updatedData);
  };

  const [arrowup1, setarrowup1] = useState(true);
  const [arrowdown1, setarrowdown1] = useState(false);
  const [drop1, setdrop1] = useState(false);

  const showDropdownOptions = () => {
    setarrowdown1(!arrowdown1);
    setarrowup1(!arrowup1);
    setdrop1(!drop1);
  };

  const [selectedExercise, setSelectedExercise] = useState(null);

  const handleExerciseSelect = (exercise) => {
    setSelectedExercise(exercise);
  };

  return (
    <div
      className={`w-full flex flex-row ${
        screenWidth < 1110 ? "h-full" : "h-screen"
      }`}
    >
      {!isside && (
        <div
          className={`w-full md:w-1/6 lg:w-1/5 xl:w-1/6 bg-black h-screen overflow-y-auto `}
        >
          <Card className="h-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5 rounded-none">
            <div className="mb-2 flex flex-col items-center gap-4 p-4 font-poppins">
              <div className="flex items-center gap-1 rounded-full">
                <Avatar
                  variant="circular"
                  size="xxl"
                  alt="tania andrew"
                  className="border-[3px] border-white-900"
                  src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
                />
              </div>
              <Typography
                variant="h5"
                color="blue-gray"
                className="font-poppins"
              >
                {parsedData.user_id}
              </Typography>
            </div>
            <List
              className={` bg-white font-poppins ${
                screenWidth < 1535 ? "" : " w-full pl-8 pr-0"
              }`}
            >
              <ListItem
                className={` rounded-none ${
                  screenWidth < 1535 ? "w-2/3 px-4" : " w-full p-3"
                }  ${
                  open === 1
                    ? "bg-gradient-to-r from-cyan-50 to-cyan-300"
                    : "bg-transparent"
                }`}
                selected={open === 1}
                onClick={() => handleItemClick(1)}
              >
                <Typography color="blue-gray" className="mr-auto font-normal">
                  Dashboard
                </Typography>
              </ListItem>

              <ListItem
                className={` rounded-none ${
                  screenWidth < 1535 ? "w-2/3 px-4" : " w-full p-3"
                } ${
                  open === 2
                    ? "bg-gradient-to-r from-cyan-50 to-cyan-300"
                    : "bg-transparent"
                }`}
                selected={open === 2}
                onClick={() => handleItemClick(2)}
              >
                <Typography color="blue-gray" className="mr-auto font-normal">
                  Report
                </Typography>
              </ListItem>

              <ListItem
                className={` rounded-none ${
                  screenWidth < 1535 ? "w-2/3 px-4" : " w-full p-3"
                } ${
                  open === 3
                    ? "bg-gradient-to-r from-cyan-50 to-cyan-300"
                    : "bg-transparent"
                }`}
                selected={open === 3}
                onClick={() => handleItemClick(3)}
              >
                Treatment
              </ListItem>
              <ListItem
                className={` rounded-none ${
                  screenWidth < 1535 ? "w-2/3 px-4" : " w-full p-3"
                } ${
                  open === 4
                    ? "bg-gradient-to-r from-cyan-50 to-cyan-300"
                    : "bg-transparent"
                }`}
                selected={open === 4}
                onClick={() => handleItemClick(4)}
              >
                Suggestion
              </ListItem>
              <hr className="my-5 border-blue-gray-50 w-full" />
              <ListItem
                className={` rounded-none ${
                  screenWidth < 1535 ? "w-2/3 px-4" : " w-full p-3"
                }`}
              >
                <ListItemPrefix>
                  <Cog6ToothIcon className="h-5 w-5" />
                </ListItemPrefix>
                Settings
              </ListItem>
              <ListItem
                className={` rounded-none ${
                  screenWidth < 1535 ? "w-2/3 px-4" : " w-full p-3"
                }`}
              >
                <ListItemPrefix>
                  <PowerIcon className="h-5 w-5" />
                </ListItemPrefix>
                Log Out
              </ListItem>
            </List>
          </Card>
        </div>
      )}
      {isside && (
        <div>
          <Drawer
            open={isDrawerOpen}
            overlay={false}
            className={`
            ${screenheight > 670 ? "mt-20" : "mt-20"}`}
          >
            <Card className="h-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5 rounded-none">
              <div className="mb-2 flex flex-col items-center gap-4 p-4">
                <div className="flex items-center gap-1 rounded-full">
                  <Avatar
                    variant="circular"
                    size="xxl"
                    alt="tania andrew"
                    className="border-[3px] border-white-900"
                    src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
                  />
                </div>
                <Typography variant="h5" color="blue-gray">
                  Anirudh P Menon
                </Typography>
              </div>
              <List
                className={` bg-white font-poppins ${
                  screenWidth < 1535 ? "" : " w-full pl-8 pr-0"
                }`}
              >
                <ListItem
                  className={` rounded-none ${
                    screenWidth < 1535 ? "w-2/3 px-4" : " w-full p-3"
                  }  ${
                    open === 1
                      ? "bg-gradient-to-r from-cyan-50 to-cyan-300"
                      : "bg-transparent"
                  }`}
                  selected={open === 1}
                  onClick={() => handleItemClick(1)}
                >
                  <Typography color="blue-gray" className="mr-auto font-normal">
                    Dashboard
                  </Typography>
                </ListItem>

                <ListItem
                  className={` rounded-none ${
                    screenWidth < 1535 ? "w-2/3 px-4" : " w-full p-3"
                  } ${
                    open === 2
                      ? "bg-gradient-to-r from-cyan-50 to-cyan-300"
                      : "bg-transparent"
                  }`}
                  selected={open === 2}
                  onClick={() => handleItemClick(2)}
                >
                  <Typography color="blue-gray" className="mr-auto font-normal">
                    Report
                  </Typography>
                </ListItem>

                <ListItem
                  className={` rounded-none ${
                    screenWidth < 1535 ? "w-2/3 px-4" : " w-full p-3"
                  } ${
                    open === 3
                      ? "bg-gradient-to-r from-cyan-50 to-cyan-300"
                      : "bg-transparent"
                  }`}
                  selected={open === 3}
                  onClick={() => handleItemClick(3)}
                >
                  Treatment
                </ListItem>
                <ListItem
                  className={` rounded-none ${
                    screenWidth < 1535 ? "w-2/3 px-4" : " w-full p-3"
                  } ${
                    open === 4
                      ? "bg-gradient-to-r from-cyan-50 to-cyan-300"
                      : "bg-transparent"
                  }`}
                  selected={open === 4}
                  onClick={() => handleItemClick(4)}
                >
                  Suggestion
                </ListItem>
                <hr className="my-5 border-blue-gray-50 w-full" />
                <ListItem
                  className={` rounded-none ${
                    screenWidth < 1535 ? "w-2/3 px-4" : " w-full p-3"
                  }`}
                >
                  <ListItemPrefix>
                    <Cog6ToothIcon className="h-5 w-5" />
                  </ListItemPrefix>
                  Settings
                </ListItem>
                <ListItem
                  className={` rounded-none ${
                    screenWidth < 1535 ? "w-2/3 px-4" : " w-full p-3"
                  }`}
                >
                  <ListItemPrefix>
                    <PowerIcon className="h-5 w-5" />
                  </ListItemPrefix>
                  Log Out
                </ListItem>
              </List>
            </Card>
          </Drawer>
        </div>
      )}
      <div
        className={` bg-gray-200 h-full flex flex-col ${
          screenWidth < 1535 ? "w-full" : "w-5/6"
        }`}
      >
        <motion.div
          initial="hidden" // Initial animation state
          animate="visible" // Animation to the center
          variants={topbar} // Animation variants
        >
          <div className="w-full h-20 bg-gradient-to-b from-gray-700 via-gray-600 to-gray-600 flex flex-row items-center pl-12 gap-8">
            {screenWidth < 1535 && (
              <div>
                <button class="relative group rounded-full">
                  <div
                    className={`relative flex items-center justify-center rounded-full w-[50px] h-[50px] transform transition-all bg-slate-700 ring-0 ring-gray-300 hover:ring-8 focus:ring-4 ring-opacity-30 duration-200 shadow-md ${
                      isClicked ? "rotate-[45deg]" : ""
                    }`}
                    onClick={() => {
                      handleClick();
                      openDrawer();
                    }}
                  >
                    <div class="flex flex-col justify-between w-[20px] h-[20px] transform transition-all duration-300 ">
                      <div
                        className={`bg-white h-[2px] w-1/2 rounded ${
                          isClicked
                            ? "rotate-90 h-[1px] origin-right delay-75 translate-y-[1px]"
                            : ""
                        }`}
                      ></div>
                      <div class="bg-white h-[1px] rounded"></div>
                      <div
                        className={`bg-white h-[2px] w-1/2 rounded self-end ${
                          isClicked
                            ? "rotate-90 h-[1px] origin-left delay-75 translate-y-[1px]"
                            : ""
                        }`}
                      ></div>
                    </div>
                  </div>
                </button>
              </div>
            )}
            <div
              className={`flex flex-row items-center  ${
                screenWidth < 390 ? "w-full gap-2" : "gap-4"
              }`}
            >
              <Squares2X2Icon
                className={` ${screenWidth < 390 ? "h-5 w-5" : "h-10 w-10"}`}
                color="white"
              />
              <Typography
                color="white"
                className={`text-start ${
                  screenWidth < 390
                    ? "text-xl font-semibold"
                    : "text-3xl font-bold"
                }`}
              >
                Dashboard
              </Typography>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial="hidden" // Initial animation state
          animate="visible" // Animation to the center
          variants={textVariants}
          className="w-full h-full"
        >
          <div
            className={`w-full mt-auto h-5/6  ${
              screenWidth < 1110 ? "flex flex-col" : "flex flex-row"
            }`}
          >
            <div
              className={`bg-transparent  ${
                screenWidth < 1110 && screenWidth >= 700
                  ? "w-full h-full flex flex-row px-6 gap-6 py-4"
                  : screenWidth < 700
                  ? "w-full h-full flex flex-col px-6 gap-6 py-4"
                  : "w-2/6 h-full px-4 flex flex-col gap-6 py-6"
              }`}
            >
              <div
                className={` w-full bg-transparent ${
                  screenWidth < 700 ? "h-3/5" : "w-full h-72"
                }`}
              >
                <Card className="bg-white w-full h-full flex flex-col p-4">
                  <div className="h-full flex flex-col">
                    <Typography
                      variant="h5"
                      color="black"
                      className="text-start font-poppins"
                    >
                      RIGHT LEG
                    </Typography>
                  </div>
                  <div className="flex flex-row h-full ">
                    <ResponsiveContainer width="100%" height="110%">
                      <PieChart width={400} height={400}>
                        <Pie
                          data={piedata}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={renderCustomizedLabel}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {data.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Legend
                          verticalAlign="bottom"
                          height={100}
                          align="center"
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>
              <div
                className={` w-full bg-transparent ${
                  screenWidth < 700 ? "h-3/5" : "h-72"
                }`}
              >
                <Card className="bg-white w-full h-full flex flex-col p-4">
                  <div className="h-full flex flex-col gap-1.5">
                    <Typography
                      variant="h5"
                      color="black"
                      className="text-start font-poppins"
                    >
                      LEFT LEG
                    </Typography>
                  </div>
                  <div className="flex flex-row h-full">
                    <ResponsiveContainer width="100%" height="110%">
                      <PieChart width={400} height={400}>
                        <Pie
                          data={piedata}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={renderCustomizedLabel}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {data.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Legend
                          verticalAlign="bottom"
                          height={100}
                          align="center"
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>
            </div>
            <div
              className={` bg-transparent pt-6 flex flex-col gap-6 ${
                screenWidth < 1110 ? "w-full h-full " : "w-4/6 h-screen"
              }`}
            >
              <div
                className={` w-full bg-transparent px-4 ${
                  screenWidth < 1110 ? "h-full " : "h-[22rem]"
                }`}
              >
                <Card
                  className={`bg-white w-full h-full flex flex-col px-4 pt-2 pb-4`}
                >
                  <div className="h-14 flex flex-row justify-between gap-2">
                    <div className={`w-1/3`}>
                      <div
                        className="flex flex-row justify-center "
                        onClick={showDropdownOptions}
                      >
                        <div className="flex flex-col">
                          <button className="flex flex-row justify-between w-48 px-2 py-2 text-gray-700 bg-white font-poppins">
                            <span className="select-none">
                              Select an Exercise
                            </span>
                            {!arrowdown1 && (
                              <ChevronDownIcon className="w-5 h-5" />
                            )}
                            {!arrowup1 && <ChevronUpIcon className="w-5 h-5" />}
                          </button>
                          {drop1 && (
                            <div className=" w-48  bg-white rounded-lg shadow-xl z-50">
                              <List className={`p-0`}>
                                {exerciseData.map((exercise, index) => (
                                  <ListItem
                                    className={`px-4 py-0`}
                                    key={index}
                                    onClick={() =>
                                      handleExerciseSelect(exercise)
                                    }
                                  >
                                    <Typography className="text-center">
                                      {exercise.name}
                                    </Typography>
                                  </ListItem>
                                ))}
                              </List>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`w-1/3 flex flex-row justify-end items-center gap-5 pr-8`}
                    >
                      <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={iconanime}
                      >
                        <ShareIcon className={`w-6 h-6`} />
                      </motion.div>
                      <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={iconanime1}
                      >
                        <ArrowDownTrayIcon className={`w-6 h-6`} />
                      </motion.div>
                    </div>
                  </div>
                  <div className="flex flex-row h-[22rem]">
                    {selectedExercise && (
                      <ResponsiveContainer width="100%" height={250}>
                        <AreaChart
                          width={500}
                          height={300}
                          data={selectedExercise.values
                            .map((value, index) => ({ name: index, uv: value }))
                            .slice(0, sliderValue + 1)}
                          margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0,
                          }}
                        >
                          <defs>
                            <linearGradient
                              id="colorUv"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="red"
                                stopOpacity={0.5}
                              />
                              <stop
                                offset="95%"
                                stopColor="transparent"
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>

                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Area
                            type="monotone"
                            dataKey="uv"
                            stroke="red"
                            strokeWidth={2}
                            fill="url(#colorUv)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                  </div>

                  <div
                    className={`w-full h-24 flex flex-row bg-gray-200 rounded-lg`}
                  >
                    <div
                      className={`w-2/6 flex justify-center items-center gap-10`}
                    >
                      <Typography
                        className={`font-poppins text-sm font-medium`}
                      >
                        Play/Seek
                      </Typography>
                      <hr className="w-0.5 h-5 bg-gray-400 round" />
                    </div>
                    <div className={`w-5/6 justify-center flex`}>
                      {selectedExercise && (
                        <input
                          value={sliderValue}
                          onChange={handleSliderChange}
                          aria-labelledby="continuous-slider"
                          max={selectedExercise.values.length - 1}
                          className="w-5/6 h-2 appearance-none bg-gray-400 rounded-full outline-none cursor-pointer"
                          style={{ marginTop: "10px" }}
                          type="range"
                        />
                      )}
                    </div>
                  </div>
                </Card>
              </div>
              <div
                className={`bg-transparent h-[14rem]  ${
                  screenWidth < 620
                    ? "flex flex-col justify-center items-center gap-6 px-4 w-full"
                    : "flex flex-row gap-6 px-4 w-full"
                }`}
              >
                <div
                  className={`h-full bg-transparent ${
                    screenWidth < 620 ? "w-full" : "w-1/2"
                  }`}
                >
                  <Card className="bg-white w-full h-full flex flex-col px-4 pt-2 pb-2">
                    <div className="h-1/4 flex flex-row justify-between items-center">
                      <Typography
                        variant="h5"
                        color="black"
                        className="text-start font-poppins"
                      >
                        Pain Score
                      </Typography>
                      <Typography
                        variant="h5"
                        color="black"
                        className="text-start font-poppins font-semibold"
                      >
                        Left Leg
                      </Typography>
                    </div>
                    <hr className="w-full h-0.5 bg-gray-100" />
                    <div className="flex flex-col justify-end items-end h-3/4 pt-2">
                      <CircularProgressbar
                        value={75}
                        text={75}
                        circleRatio={0.75}
                        styles={buildStyles({
                          rotation: 1 / 2 + 1 / 8,
                          trailColor: "#eee",
                          pathColor: "red",
                          textColor: "black",
                          textSize: "22px",
                        })}
                      />
                    </div>
                  </Card>
                </div>
                <div
                  className={`h-full bg-transparent ${
                    screenWidth < 620 ? "w-full" : "w-1/2"
                  }`}
                >
                  <Card className="bg-white w-full h-full flex flex-col px-4 pt-2 pb-2">
                    <div className="h-1/4 flex flex-row justify-between items-center">
                      <Typography
                        variant="h5"
                        color="black"
                        className="text-start font-poppins"
                      >
                        Pain Score
                      </Typography>
                      <Typography
                        variant="h5"
                        color="black"
                        className="text-start font-poppins font-semibold"
                      >
                        Right Leg
                      </Typography>
                    </div>
                    <hr className="w-full h-0.5 bg-gray-100" />
                    <div className="flex flex-col justify-center items-center h-3/4 pt-2">
                      <CircularProgressbar
                        value={64}
                        text={64}
                        circleRatio={0.75}
                        styles={buildStyles({
                          rotation: 1 / 2 + 1 / 8,
                          trailColor: "#eee",
                          pathColor: "cyan",
                          textColor: "black",
                          textSize: "22px",
                        })}
                      />
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Finalreport;
