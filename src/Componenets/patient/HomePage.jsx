import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  CardHeader,
  CardBody,
  Avatar,
  Drawer,
} from "@material-tailwind/react";
import {
  Cog6ToothIcon,
  PowerIcon,
  Squares2X2Icon,
  ChartBarSquareIcon,
  ClipboardDocumentIcon,
  UserGroupIcon,
  ChartBarIcon,
  BellIcon,
  ChevronRightIcon,
  ArrowUpRightIcon,
  UserCircleIcon,
  AdjustmentsHorizontalIcon,
  DocumentIcon,
  ChatBubbleLeftRightIcon,
  StopCircleIcon,
} from "@heroicons/react/24/solid";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
} from "recharts";

const CustomBar = (props) => {
  const { x, y, width, height, fill } = props;
  const radius = 5; // Set the radius for the rounded corner
  return (
    <g>
      <path d={`M${x},${y} L${x + width - radius},${y} Q${x + width},${y} ${x + width},${y + radius} L${x + width},${y + height - radius} Q${x + width},${y + height} ${x + width - radius},${y + height} L${x},${y + height} L${x},${y}`} fill={fill} />
    </g>
  );
}

const HomePage = () => {
  var storedData = localStorage.getItem("user");

  // Parse the stored data from JSON
  var parsedData = JSON.parse(storedData);

  // Access the user_id property
  var userId = parsedData._id;
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

  const data2 = [
    {
      name: "JAN",
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "FEB",
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "MAR",
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: "APR",
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: "MAY",
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "JUN",
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: "JUL",
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

  const data4 = [
    {
      name: "Page A",
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "Page B",
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "Page C",
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: "Page D",
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: "Page E",
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "Page F",
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: "Page G",
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

  const data = [
    { name: "Category 1", value: 10 },
    { name: "Category 2", value: 20 },
    { name: "Category 3", value: 30 },
    { name: "Category 4", value: 40 },
    { name: "Category 5", value: 50 },
  ];

  const [exerciseData, setExerciseData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  const bardata = [
    {
      name: "18-24",
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "25-34",
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "35-44",
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: "45-64",
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
  ];

  const [selected, setSelected] = useState(null);

  const handleClick = (index) => {
    setSelected(index);
  };


  return (
    <div
      className={`w-full h-full bg-gray-200 ${
        screenWidth < 1000 ? "flex flex-col gap-4 py-4" : "flex flex-col gap-4"
      }`}
    >
      <div
        className={`w-full ${
          screenWidth < 1000
            ? "flex flex-col h-full gap-4"
            : "flex flex-row h-2/5"
        }`}
      >
        <div
          className={` px-4 ${screenWidth < 1000 ? "w-full h-72" : "w-1/2"}`}
        >
          <Card
            color="transparent"
            shadow={true}
            className="w-full h-full bg-white flex flex-col gap-2 pt-2"
          >
            <div className={`w-full flex flex-row`}>
              <div className="w-1/2 flex flex-col">
                <Typography
                  variant="h7"
                  color="gray"
                  className="flex text-start px-5 font-normal font-poppins"
                >
                  Sugar Level
                </Typography>
                <Typography
                  variant="h5"
                  color="black"
                  className="flex text-start px-5 font-poppins"
                >
                  220 mg/dl
                </Typography>
              </div>
              <div className="w-1/2 flex flex-col items-end">
                <Typography
                  variant="h6"
                  color="black"
                  className="flex text-start px-5 font-semibold font-poppins"
                >
                  25%
                </Typography>
                <Typography
                  variant="h6"
                  color="gray"
                  className="flex text-start px-5 font-poppins"
                >
                  VS LAST MONTH
                </Typography>
              </div>
            </div>
            <div className="w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  width={500}
                  height={400}
                  data={data2}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="red" stopOpacity={0.5} />
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
                    dataKey="uv"
                    stroke="red"
                    strokeWidth={2}
                    fill="url(#colorUv)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
        <div
          className={` px-4 ${screenWidth < 1000 ? "w-full h-72" : "w-1/2"}`}
        >
          <Card
            color="transparent"
            shadow={true}
            className="w-full h-full bg-white flex flex-col pt-2"
          >
            <div className={`w-full h-12 flex flex-row`}>
              <div className={`w-1/2 h-12`}>
                <Typography
                  variant="h6"
                  color="gray"
                  className="flex text-start px-5 font-poppins"
                >
                  Sugar Level
                </Typography>
                <Typography
                  variant="h6"
                  color="black"
                  className="flex text-start px-5 font-poppins font-semibold"
                >
                  Age and Gender
                </Typography>
              </div>
              <div className={`w-1/2 h-12 flex flex-row items-center`}>
                <Typography
                  variant="h6"
                  color="black"
                  className="flex flex-row justify-center items-center text-start px-5 font-poppins gap-2"
                >
                  <div className={`w-3 h-3 bg-cyan-700 rounded-full`}></div>Male
                </Typography>
                <Typography
                  variant="h6"
                  color="black"
                  className="flex flex-row justify-center items-center text-start px-5 font-poppins font-semibold gap-2"
                >
                  <div className={`w-3 h-3 bg-cyan-200 rounded-full`}></div> Female
                </Typography>
              </div>
            </div>
            <div className="w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={bardata}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                
                >
                 <XAxis type="number"/>
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Bar dataKey="uv" stackId="a" fill="#00ced1" />
                  <Bar dataKey="pv" stackId="a" fill="#00ffff" shape={<CustomBar />}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
      <div
        className={`w-full  px-4 pb-4 ${
          screenWidth < 1000 ? "h-72" : "h-3/5"
        }`}
      >
        <Card
          color="transparent"
          shadow={true}
          className="w-full h-full bg-white flex flex-col pt-2"
        >
          <div className={`w-full flex flex-row`}>
            <div className={`w-1/5`}>
              <Typography
            variant="h5"
            color="black"
            className="flex text-start px-5 font-poppins"
          >
            Levels Report
          </Typography>
          </div>
            <div className={`w-2/5 flex flex-row justify-center`}>
            <Typography
                  variant="h6"
                  color="black"
                  className="flex flex-row justify-center items-center text-start px-5 font-poppins gap-2 text-sm"
                >
                  <div className={`w-2 h-2 bg-cyan-400 rounded-full`}></div>BP Levels
                </Typography>
                <Typography
                  variant="h6"
                  color="black"
                  className="flex flex-row justify-center items-center text-start px-5 font-poppins gap-2 text-sm"
                >
                  <div className={`w-2 h-2 bg-blue-700 rounded-full`}></div>Sugar Levels
                </Typography>
                <Typography
                  variant="h6"
                  color="black"
                  className="flex flex-row justify-center items-center text-start px-5 font-poppins gap-2 text-sm"
                >
                  <div className={`w-2 h-2 bg-purple-700 rounded-full`}></div>Others
                </Typography>
            </div>
            <div className={`w-2/5 flex justify-center`}>
              <div className={`w-3/5 h-full flex flex-row bg-gray-300 rounded-lg p-1`}>
                <div 
                className={`w-1/3 font-poppins text-gray-400 text-center text-sm flex items-center justify-center cursor-pointer ${selected === 0 ? 'bg-black text-white rounded-lg p-1' : ''}`}
                onClick={() => handleClick(0)}>
                  7 Days
                </div>
                <div className={`w-1/3 font-poppins text-gray-400 text-center text-sm flex items-center justify-center cursor-pointer ${selected === 1 ? 'bg-black text-white rounded-lg p-1' : ''}`}
                onClick={() => handleClick(1)}>
                  30 Days
                </div>
                <div className={`w-1/3 font-poppins text-gray-400 text-center text-sm flex items-center justify-center cursor-pointer ${selected === 2 ? 'bg-black text-white rounded-lg p-1' : ''}`}
                onClick={() => handleClick(2)}>
                  12 months
                </div>
              </div>
            </div>
          
          </div>
          <div className="w-full h-full">
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
    </div>
  );
};

export default HomePage;
