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
} from "@material-tailwind/react";
import {
  Cog6ToothIcon,
  PowerIcon,
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
} from "recharts";

const Finalreport = () => {
  const [patientInfo, setPatientInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  var storedData = localStorage.getItem("user");

  // Parse the stored data from JSON
  var parsedData = JSON.parse(storedData);

  // Access the user_id property
  var userId = parsedData._id;
  console.log(userId);
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
  console.log(finalData);
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
                {parsedData.user_id}
              </Typography>
            </div>
            <List
              className={` bg-white ${
                screenWidth < 1535 ? "" : " w-full pl-8 pr-4"
              }`}
            >
              <ListItem
                className={`${
                  screenWidth < 1535 ? "w-2/3 px-4" : " w-full p-3"
                }`}
                selected={open === 1}
                onClick={() => handleItemClick(1)}
                style={{ backgroundColor: open === 1 ? "cyan" : "transparent" }}
              >
                <Typography color="blue-gray" className="mr-auto font-normal">
                  Dashboard
                </Typography>
              </ListItem>

              <ListItem
                className={`${
                  screenWidth < 1535 ? "w-2/3 px-4" : " w-full p-3"
                }`}
                selected={open === 2}
                onClick={() => handleItemClick(2)}
                style={{ backgroundColor: open === 2 ? "cyan" : "transparent" }}
              >
                <Typography color="blue-gray" className="mr-auto font-normal">
                  Report
                </Typography>
              </ListItem>

              <ListItem
                className={`${
                  screenWidth < 1535 ? "w-2/3 px-4" : " w-full p-3"
                }`}
                selected={open === 3}
                onClick={() => handleItemClick(3)}
                style={{ backgroundColor: open === 3 ? "cyan" : "transparent" }}
              >
                Treatment
              </ListItem>
              <ListItem
                className={`${
                  screenWidth < 1535 ? "w-2/3 px-4" : " w-full p-3"
                }`}
                selected={open === 4}
                onClick={() => handleItemClick(4)}
                style={{ backgroundColor: open === 4 ? "cyan" : "transparent" }}
              >
                Suggestion
              </ListItem>
              <hr className="my-5 border-blue-gray-50 w-full" />
              <ListItem
                className={`${
                  screenWidth < 1535 ? "w-2/3 px-4" : " w-full p-3"
                }`}
              >
                <ListItemPrefix>
                  <Cog6ToothIcon className="h-5 w-5" />
                </ListItemPrefix>
                Settings
              </ListItem>
              <ListItem
                className={`${
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
                className={` bg-white ${
                  screenWidth < 1535 ? "" : " w-full pl-8 pr-4"
                }`}
              >
                <ListItem
                  className={`${
                    screenWidth < 1535 ? "w-2/3 px-4" : " w-full p-3"
                  }`}
                  selected={open === 1}
                >
                  <Typography color="blue-gray" className="mr-auto font-normal">
                    Dashboard
                  </Typography>
                </ListItem>

                <ListItem
                  className={`${
                    screenWidth < 1535 ? "w-2/3 px-4" : " w-full p-3"
                  }`}
                  selected={open === 2}
                >
                  <Typography color="blue-gray" className="mr-auto font-normal">
                    Report
                  </Typography>
                </ListItem>

                <ListItem
                  className={`${
                    screenWidth < 1535 ? "w-2/3 px-4" : " w-full p-3"
                  }`}
                >
                  Treatment
                </ListItem>
                <ListItem
                  className={`${
                    screenWidth < 1535 ? "w-2/3 px-4" : " w-full p-3"
                  }`}
                >
                  Suggestion
                </ListItem>
                <hr className="my-5 border-blue-gray-50 w-full" />
                <ListItem
                  className={`${
                    screenWidth < 1535 ? "w-2/3 px-4" : " w-full p-3"
                  }`}
                >
                  <ListItemPrefix>
                    <Cog6ToothIcon className="h-5 w-5" />
                  </ListItemPrefix>
                  Settings
                </ListItem>
                <ListItem
                  className={`${
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
        <div className="w-full h-20 bg-gradient-to-b from-gray-800 to-brown-500 flex flex-row items-center pl-12 gap-8">
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
                : "w-1/3 h-full px-4 flex flex-col gap-6 py-6"
            }`}
          >
            <div
              className={` w-full bg-transparent ${
                screenWidth < 700 ? "h-3/5" : "h-1/2"
              }`}
            >
              <Card className="bg-white w-full h-full flex flex-col p-4">
                <div className="h-1/4 flex flex-col gap-1.5">
                  <Typography variant="h5" color="black" className="text-start">
                    Left Leg
                  </Typography>
                  <Typography variant="h7" color="black" className="text-start">
                    ROM - 25
                  </Typography>
                </div>
                <div className="flex flex-row h-3/4 ">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                      cx="40%"
                      cy="50%"
                      innerRadius="10%"
                      outerRadius="120%"
                      barSize={10}
                      data={data}
                    >
                      <RadialBar
                        minAngle={15}
                        label={{ position: "insideStart", fill: "#fff" }}
                        background
                        clockWise
                        dataKey="uv"
                      />
                      <Legend
                        iconSize={10}
                        layout="vertical"
                        verticalAlign="middle"
                        wrapperStyle={style}
                      />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
            <div
              className={` w-full bg-transparent ${
                screenWidth < 700 ? "h-3/5" : "h-1/2"
              }`}
            >
              <Card className="bg-white w-full h-full flex flex-col p-4">
                <div className="h-1/4 flex flex-col gap-1.5">
                  <Typography variant="h5" color="black" className="text-start">
                    Right Leg
                  </Typography>
                  <Typography variant="h7" color="black" className="text-start">
                    ROM - 25
                  </Typography>
                </div>
                <div className="flex flex-row h-3/4">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                      cx="40%"
                      cy="50%"
                      innerRadius="10%"
                      outerRadius="120%"
                      barSize={10}
                      data={data}
                    >
                      <RadialBar
                        minAngle={15}
                        label={{ position: "insideStart", fill: "#fff" }}
                        background
                        clockWise
                        dataKey="uv"
                      />
                      <Legend
                        iconSize={10}
                        layout="vertical"
                        verticalAlign="middle"
                        wrapperStyle={style}
                      />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </div>
          <div
            className={` h-full bg-transparent py-6 flex flex-col gap-6 ${
              screenWidth < 1110 ? "w-full" : "w-2/3"
            }`}
          >
            <div
              className={` w-full bg-transparent px-4 ${
                screenWidth < 1110 ? "h-full" : "h-2/3"
              }`}
            >
              <Card className={`bg-white w-full h-full flex flex-col p-4`}>
                <div className="h-1/4 flex flex-col gap-2">
                  <Typography variant="h5" color="black" className="text-start">
                    Step Count
                  </Typography>
                  <Typography variant="h7" color="black" className="text-start">
                    User Daily Step Count
                  </Typography>
                </div>
                <div className="flex flex-row h-3/4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      width={500}
                      height={300}
                      data={finalData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="index" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      {/* Conditional rendering of Line components */}
                      {finalData.length > 0 &&
                        Object.keys(finalData[0])
                          .filter((key) => key !== "index") // Exclude the 'index' key
                          .map((exerciseName, index) => (
                            <Line
                              key={index}
                              type="monotone"
                              dataKey={exerciseName}
                              stroke={`#${Math.floor(
                                Math.random() * 16777215
                              ).toString(16)}`}
                            />
                          ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
            <div
              className={`h-1/3  bg-transparent  ${
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
                <Card className="bg-white w-full h-full flex flex-col p-4">
                  <div className="h-1/4 flex flex-row justify-between items-center">
                    <Typography
                      variant="h5"
                      color="black"
                      className="text-start"
                    >
                      Pain Score
                    </Typography>
                    <Typography
                      variant="h7"
                      color="black"
                      className="text-start"
                    >
                      Left Leg
                    </Typography>
                  </div>
                  <div className="flex flex-col justify-center items-center h-3/4">
                    <Typography
                      variant="h3"
                      color="black"
                      className="text-start mt-[-3rem] pb-4"
                    >
                      33
                    </Typography>
                  </div>
                </Card>
              </div>
              <div
                className={`h-full bg-transparent ${
                  screenWidth < 620 ? "w-full" : "w-1/2"
                }`}
              >
                <Card className="bg-white w-full h-full flex flex-col p-4">
                  <div className="h-1/4 flex flex-row justify-between items-center">
                    <Typography
                      variant="h5"
                      color="black"
                      className="text-start"
                    >
                      Pain Score
                    </Typography>
                    <Typography
                      variant="h7"
                      color="black"
                      className="text-start"
                    >
                      Right Leg
                    </Typography>
                  </div>
                  <div className="flex flex-col justify-center items-center h-3/4">
                    <Typography
                      variant="h3"
                      color="black"
                      className="text-start mt-[-3rem] pb-4"
                    >
                      75
                    </Typography>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Finalreport;
