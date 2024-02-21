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

const RoundedBar = (props) => {
  const { fill, x, y, width, height } = props;
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={fill} rx={14} />
    </g>
  );
};

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

  const [patientInfo, setPatientInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [runningData, setRunningData] = useState([]);
  const [squatsData, setsquatsData] = useState([]);
  const [pushupsData, setpushupsData] = useState([]);
  const [pullupsData, setpullupsData] = useState([]);
  const [leghipData, setleghipData] = useState([]);

  useEffect(() => {
    const fetchPatientInfo = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/patient-info/${userId}`
        );
        const data = await response.json();

        if (response.ok) {
          setPatientInfo(data);
          console.log(data)
          // Extract only the "Running" data
          const runningExerciseData = data?.Exercises?.running.values || [];
          const squatsExerciseData = data?.Exercises?.squats.values || [];
          const pushupsExerciseData = data?.Exercises?.pushups.values || [];
          const pullupsExerciseData = data?.Exercises?.pullups.values || [];
          const leghipExerciseData = data?.Exercises?.LegHipRotation.values || [];
          setRunningData(runningExerciseData.map((value) => parseFloat(value)));
          setsquatsData(squatsExerciseData.map((value) => parseFloat(value)));
          setpushupsData(pushupsExerciseData.map((value) => parseFloat(value)));
          setpullupsData(pullupsExerciseData.map((value) => parseFloat(value)));
          setleghipData(leghipExerciseData.map((value) => parseFloat(value)));
        } else {
          setError(data.detail || "Failed to fetch patient information");
        }
      } catch (error) {
        setError("Error fetching patient information");
      } finally {
        setLoading(false);
      }
    };

    fetchPatientInfo();
  }, [userId]);

  useEffect(() => {
    console.log(patientInfo);
  }, [patientInfo]);

  const combinedChartData = runningData.map((value, index) => ({
    name: ` ${index + 1}`,
    Running: value,
    Squats: squatsData[index],
    Pushups: pushupsData[index],
    Pullups: pullupsData[index],
    LegHipRotation: leghipData[index],
  }));


  return (
    <div
      className={`w-full h-full bg-gray-200 ${
        screenWidth < 1000 ? "flex flex-col gap-4 py-4" : "flex flex-col gap-4"
      }`}
    >
      <div className={`w-full ${screenWidth<1000?"flex flex-col h-full gap-4":"flex flex-row h-1/2"}`}>
        <div className={` px-4 ${screenWidth<1000?"w-full h-72":"w-1/2"}`}>
          <Card
            color="transparent"
            shadow={true}
            className="w-full h-full bg-white flex flex-col gap-2 pt-2"
          >
            <div className="w-full flex flex-col">
              <Typography
                variant="h6"
                color="black"
                className="flex text-start px-5"
              >
                Sugar Level
              </Typography>
              <Typography
                variant="h7"
                color="black"
                className="flex text-start px-5"
              >
                220 mg/dl
              </Typography>
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
                  <CartesianGrid  />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="uv"
                    stroke="#8884d8"
                    fill="#8884d8"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
        <div className={` px-4 ${screenWidth<1000?"w-full h-72":"w-1/2"}`}>
          <Card
            color="transparent"
            shadow={true}
            className="w-full h-full bg-white flex flex-col pt-2"
          >
            <Typography
              variant="h6"
              color="black"
              className="flex text-start px-5"
            >
              Patient Analytics
            </Typography>
            <div className="w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#4F46E5" shape={<RoundedBar />} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
      <div className={`w-full  px-4 pb-2 ${screenWidth<1000?"h-72":"h-1/2 h-"}`}>
        <Card
          color="transparent"
          shadow={true}
          className="w-full h-full bg-white flex flex-col pt-2"
        >
          <Typography
            variant="h6"
            color="black"
            className="flex text-start px-5"
          >
            Patient Analytics
          </Typography>
          <div className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                width={500}
                height={300}
                data={combinedChartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <CartesianGrid strokeDasharray="3 3" />
                <Legend />
                      <Line
                        type="monotone"
                        dataKey="Running"
                        stroke="#82ca9d"
                      />
                      <Line type="monotone" dataKey="Squats" stroke="#8884d8" />
                      <Line
                        type="monotone"
                        dataKey="Pushups"
                        stroke="#ff7300"
                      />
                      <Line
                        type="monotone"
                        dataKey="Pullups"
                        stroke="#0088aa"
                      />
                      <Line
                        type="monotone"
                        dataKey="LegHipRotation"
                        stroke="#FF0000"
                      />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;