import React, { useState, useEffect, useRef, Suspense } from "react";
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
  Select,
  Option,
  CardFooter,
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
  PlayCircleIcon,
  ArrowLeftIcon,
  PauseIcon,
  PlayIcon,
  ArrowPathIcon,
  ArrowDownTrayIcon,
  PaperAirplaneIcon,
  ChevronDownIcon,
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
  ScatterChart,
  Scatter,
  Label,
} from "recharts";
import RightLegBend from "../../assets/Right-Leg-Bend.mp4";
import exerbg from "../../assets/exerbg.svg";
import glass from "../../assets/glass.svg";
import { toast } from "react-toastify";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import html2canvas from "html2canvas";
import html2pdf from "html2pdf.js";
import RecordRTC from "recordrtc";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import AWS from "./awsConfig";
import { useNavigate } from "react-router-dom";
import { MathUtils } from "three";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { ClockIcon } from "@mui/x-date-pickers";
import ModelRender from "./ModelRender";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import {
  CircularProgressbar,
  buildStyles,
  CircularProgressbarWithChildren,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const Exercise = ({ onBack }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [screenheight, setScreenHeight] = useState(window.innerHeight);
  const [isside, setisside] = useState(true);
  const userId = user.user_id;
  const patient_id = user._id;
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

  const [exer, setExer] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatientInfo = async () => {
      try {
        const response = await fetch(
          `https://api-backup-vap2.onrender.com/patient-info/${patient_id}`
        );
        if (!response.ok) {
          if (response.status === 404) {
            setError("Patient not found.");
          } else {
            throw new Error("Error fetching patient information.");
          }
        } else {
          const datas = await response.json();
          // Extracting exercise names from the given data
          const exercises = datas.exercises_given;
          const updatedExer = exercises.data;
          console.log(updatedExer);
          setExer(updatedExer);
        }
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchPatientInfo();

    // Cleanup function to handle component unmounting or patientId changes
    return () => {
      // Perform cleanup tasks, if necessary
    };
  }, [patient_id]);

  // console.log(exer)

  // const exer = [
  //   { name: "Push Up", set: 3, img: null },
  //   { name: "Pull Up", set: 2, img: null },
  //   { name: "Planks", set: 4, img: null },
  //   { name: "Crunches", set: 5, img: null },
  //   { name: "Leg Lift", set: 2, img: null },
  //   { name: "Squats", set: 3, img: null },
  // ];

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };
  const [isdisplay, setisdisplay] = useState(false);
  const [rep, setrep] = useState(0);
  const [exerc, setexerc] = useState("Exercise");

  const exercise = Array.from(
    { length: rep },
    (_, index) => `Milestone ${index}`
  );

  const [selectedOption, setSelectedOption] = useState(null);

  const handleSelectChange = (value) => {
    setSelectedOption(value);
  };

  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const openDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  const [isClicked, setIsClicked] = useState(false);

  // const handleClick = () => {
  //   setIsClicked(!isClicked);
  // };

  const temp = [1, 2, 3];
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBluetoothConnected, setIsBluetoothConnected] = useState(false);
  const [isLeg, setisLeg] = useState(false);
  const [socket, setSocket] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [timer, setTimer] = useState(120); // 2 minutes in seconds
  const [downloadEnabled, setDownloadEnabled] = useState(false);
  const [status, setStatus] = useState(localStorage.getItem("isLoggedIn"));
  const [metrics, setMetrics] = useState([]);
  const messagesEndRef = useRef(null);
  const [autoScroll, setAutoScroll] = useState(false);
  const [selectedTime, setSelectedTime] = useState(""); // State to store the selected time interval
  const [fromDate, setFromDate] = useState(new Date());
  const [fromTime, setFromTime] = useState("12:00");
  const [toDate, setToDate] = useState(new Date());
  const [toTime, setToTime] = useState("12:00");
  const [metricArray, setmetricArray] = useState([]);
  const [isChartButtonClicked, setIsChartButtonClicked] = useState(false);
  const dotAppearance = isPlaying ? { fill: "yellow", r: 5 } : { fill: "none" };
  const [chartData, setChartData] = useState(
    Array.from({ length: 120 }, (_, i) => ({ index: i + 1, val: 0 }))
  );
  var [elapsedTime, setElapsedTime] = useState(-1);
  const [isStartButtonDisabled, setIsStartButtonDisabled] = useState(false);
  // const [isRunning, setIsRunning] = useState(false);
  const [key, setKey] = useState(0);
  const [minAngles, setMinAnglse] = useState(180);
  const [maxAngles, setMaxAngles] = useState(0);
  const [prevAngle, setPrevAngle] = useState(null);
  const [currentAngle, setCurrentAngle] = useState(null);
  const [minAnglePoint, setMinAnglePoint] = useState(null);
  const [maxAnglePoint, setMaxAnglePoint] = useState(null);
  const [mediaStream, setMediaStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  var flag = 0;
  localStorage.setItem("lastCount", metricArray.length);
  const [data, setData] = useState([]);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  var [counter, setCounter] = useState(-1);
  const timerRef = useRef();
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [stackedMetricsArray, setStackedMetricsArray] = useState([]);
  const timeIntervals = ["1", "1.5", "2"];
  const [staticFragment, setstaticFragment] = useState([]);
  const [stackedIndex, setstackedIndex] = useState([]);
  const [isStopButtonClicked, setIsStopButtonClicked] = useState(false);
  const handleFromDateTimeChange = (date, time) => {
    setFromDate(date);
    setFromTime(time);
  };
  let RunTimer = 0;
  const [highlightCount, sethighlightCount] = useState(0);
  let highlightcounter = 0;
  const [metricArrayLength, setmetricArrayLength] = useState();

  const handleToDateTimeChange = (date, time) => {
    setToDate(date);
    setToTime(time);
  };
  const handleTimeChange = (event) => {
    setSelectedTime(event.target.value);
  };

  function showToastMessage() {
    toast.error("No more datas to be found", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 1500,
    });
  }

  function handleClick() {
    // Call the first function
    if (selectedTime) {
      // Toggle the isPlaying state
      setIsPlaying(!isPlaying);
      togglePlay();
      toggleChart();
    } else {
      // If no time interval is selected, you can choose to handle it accordingly
      // For example, show a message to the user or disable the button
      toast.error("Please select a time interval!");
    }

    // Call the second function
  }
  const [legValue, setlegValue] = useState([]);
  const [rotationX, setRotationX] = useState(0);
  const [shouldAutoplay, setShouldAutoplay] = useState(false);
  const generateNewDataPoint = () => {
    const newIndex = elapsedTime + 1;

    if (counter >= -1 && counter < metricArray.length) {
      // console.log(metricArray,"metric")
      const metricItem = metricArray[counter - 1];
      // const legvalue = parseFloat(metricItem.val);
      // // const rotation = legvalue;
      // console.log("legvalue",legvalue)
      if (metricItem && typeof metricItem === "object" && "val" in metricItem) {
        console.log(typeof(metricItem.val))
        setRotationX(metricItem.val);
        if(metricItem.val<10){
          setShouldAutoplay(true)
        }else{
          setShouldAutoplay(false)
        }
        return {
          index: newIndex,
          val: metricItem.val,
          ...dotAppearance,
        };
      }
    } else if (counter === metricArray.length) {
      // Display the last value when counter equals the length of metricArray
      const lastMetricItem = metricArray[metricArray.length - 1];
      if (
        lastMetricItem &&
        typeof lastMetricItem === "object" &&
        "val" in lastMetricItem
      ) {
        setRotationX(lastMetricItem.val);
        if(lastMetricItem.val<10){
          setShouldAutoplay(true)
        }else{
          setShouldAutoplay(false)
        }
        return {
          index: newIndex,
          val: lastMetricItem.val,
          ...dotAppearance,
        };
      }
    }
    return null;
  };

  const updateChart = () => {
    if (counter >= metricArray.length) {
      if (flag < 1) {
        // showToastMessage();
        flag += 1;
      }

      setCounter(counter - 1);
      return;
    }

    if (!isPlaying) {
      // Only update the chart data if data is available
      if (counter <= metricArray.length) counter = counter + 1;
      const newDataPoint = generateNewDataPoint();
      if (newDataPoint) {
        const newAngle = newDataPoint.val;
        // console.log(newAngle,counter)
        processNewAngle(newDataPoint.val, newDataPoint.index);
        setPrevAngle(currentAngle); // Store the current angle as the previous angle
        setCurrentAngle(newAngle); // Update the current angle
        setCounter((prevCounter) => prevCounter + 1);
        setData((prevData) => [...prevData, newDataPoint]);
        elapsedTime += 1;
        setChartData((prevData) => [...prevData, newDataPoint]);
        setElapsedTime((prevElapsedTime) => prevElapsedTime + 1);
      }
    }
  };

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(updateChart, 1000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [isPlaying]);

  // const toggleChart = () => {
  //   if (isRunning) {
  //     stopTimer();
  //   } else {
  //     startTimer();
  //   }
  // };

  const toggleChart = () => {
    if (!isPlaying) {
      startTimer();
    } else {
      stopTimer();
    }
  };

  useEffect(() => {
    // Clean up the WebSocket connection when the component unmounts
    return () => {
      if (socket) {
        socket.close(1000, "Goodbye, WebSocket!");
        setSocket(null);
        // Remove any other event listeners or cleanup here
      }
    };
  }, [socket]);

  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible((prevVisible) => !prevVisible);
  };

  useEffect(() => {
    if (status) {
      // console.log(user);
    }
  }, [status]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (autoScroll) {
      scrollToBottom();
    }
  }, [metrics]);

  const chartRef = useRef(null);
  const cardRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [CardImage, setCardImage] = useState(null);
  const [ComponentImage, setComponentImage] = useState(null);

  const downloadAsPdf = async () => {
    try {
      const chartContainer = chartRef.current;
      const cardContainer = cardRef.current;
      const componentContainer = componentRef.current;

      const canvas = await html2canvas(chartContainer, {
        scale: 2,
      });

      const Cardcanvas = await html2canvas(cardContainer, {
        scale: 2,
      });

      const componentcanvas = await html2canvas(componentContainer, {
        scale: 2,
      });
      const imgData = canvas.toDataURL("image/jpeg");
      const imgCard = Cardcanvas.toDataURL("image/jpeg");
      const imgComponent = componentcanvas.toDataURL("image/jpeg");
      setImageSrc(imgData);
      setCardImage(imgCard);
      setComponentImage(imgComponent);
      // const pdf = new jsPDF();
      // const imgProps = pdf.getImageProperties(imgData);
      // const pdfWidth = pdf.internal.pageSize.getWidth();
      // const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      // pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
      // pdf.save("chart.pdf");
    } catch (error) {
      // console.error("Error generating PDF:", error);
    }
  };

  // useEffect(() => {
  //   // Trigger PDF generation when imageSrc is updated
  //   if (imageSrc !== null) {
  //     handleDownload();
  //   }
  // }, [imageSrc]);

  // new pdf generation
  const [showNames, setShowNames] = useState(false);

  const details = {
    companyTitle: "Your Company",
    patientName: "John Doe",
    hospitalName: "Hospital XYZ",
    date: "2023-11-30",
    time: "10:00 AM",
    loginId: "12345",
    sensorId: "67890",
    doctorName: "Dr. Smith",
    assistantName: "Jane Doe",
    graphImage: "path/to/graph.png",
    cardImage: "path/to/card.png",
  };

  const handleShowNames = () => {
    setShowNames(!showNames);
  };

  const [isActive, setIsActive] = useState(false);

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  const styles = StyleSheet.create({
    page: { flexDirection: "row", padding: 20 },
    graphContainer: {
      flex: 1,
      marginBottom: 15,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    graphView: { border: "1px dashed #000", padding: 15 },
    graphTitle: {
      fontSize: 16,
      marginBottom: 5,
      textAlign: "center",
      marginTop: 5,
    },
  });

  const componentRef = useRef();

  const handleDownload = async () => {
    try {
      const chartContainer = chartRef.current;
      const componentContainer = componentRef.current;

      console.log(chartContainer);
      const canvas = await html2canvas(chartContainer, {
        scale: 2,
      });
      const componentcanvas = await html2canvas(componentContainer, {
        scale: 2,
      });
      const imgData = canvas.toDataURL("image/jpeg");
      const imgComponent = componentcanvas.toDataURL("image/jpeg");
      setImageSrc(imgData);
      setComponentImage(imgComponent);

      const commonDetails = `
        <h1>${details.companyTitle}</h1>
        <p>Patient Name: ${details.patientName}</p>
        <p>Hospital Name: ${details.hospitalName}</p>
        <p>Date: ${details.date}</p>
        <p>Time: ${details.time}</p>
        <p>Login ID: ${details.loginId}</p>
        <p>Sensor ID: ${details.sensorId}</p>
      `;
      const totalGraphdetails = `
        <h1>OverAll Details</h1>
        <p>Maximum Angle: ${maxAngles}°</p>
        <p>Minimum Angle: ${minAngles}°</p>
        <p>Flexion Cycle: ${flexionCycles}</p>
        <p>Extension Cycle: ${extensionCycles}</p>
        <p>Velocity: ${(maxAngles + minAngles) / 2}</p>
        <p>ROM: ${maxAngles - minAngles}</p>
      `;
      const doctorAssistantDetails = `
        <p>Doctor Name: ${details.doctorName}</p>
        <p>Assistant Name: ${details.assistantName}</p>
      `;

      const template = `
        <div>
          ${commonDetails}
          ${isActive ? doctorAssistantDetails : ""}
          <br></br>
          <img src="${imgData}" alt="Graph Image" style="width: 600px; height: 400px;" />
          ${totalGraphdetails}
        </div>
      `;
      const content = componentRef.current;

      if (!content) {
        console.error("Content not found for PDF generation");
        return;
      }

      const combinedContent = document.createElement("div");

      const offDetails = document.createElement("div");
      offDetails.innerHTML = template;
      combinedContent.appendChild(offDetails.cloneNode(true));
      combinedContent.appendChild(content.cloneNode(true));

      html2pdf(combinedContent, {
        margin: 10,
        filename: "combined.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      // You might want to notify the user about the error
    }
  };
  // const generatePdf = () => {
  //   const offScreenDiv = document.createElement("div");
  //   setShowRedLine(false);
  //   downloadAsPdf();

  //   const commonDetails = `
  //   <h1>${details.companyTitle}</h1>
  //   <p>Patient Name: ${details.patientName}</p>
  //   <p>Hospital Name: ${details.hospitalName}</p>
  //   <p>Date: ${details.date}</p>
  //   <p>Time: ${details.time}</p>
  //   <p>Login ID: ${details.loginId}</p>
  //   <p>Sensor ID: ${details.sensorId}</p>
  // `;
  //   const doctorAssistantDetails = `
  //   <p>Doctor Name: ${details.doctorName}</p>
  //   <p>Assistant Name: ${details.assistantName}</p>
  // `;

  //   const template = `
  //   <div>
  //     ${commonDetails}
  //     ${isActive ? doctorAssistantDetails : ""}
  //     <br></br>
  //     <img src="${imageSrc}" alt="Graph Image" style="width: 600px; height: 400px;" />
  //     <img src="${CardImage}" alt="Card Image" style="width: 600px; height: 400px;" />

  //   </div>
  // `;
  //   handleDownload();
  //   offScreenDiv.innerHTML = template;

  //   html2pdf(offScreenDiv, {
  //     margin: 10,
  //     filename: "details.pdf",
  //     image: { type: "jpeg", quality: 0.98 },
  //     html2canvas: { scale: 2 },
  //     jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  //   });
  // };

  const generateContentforPdf = (index) => {
    const indices = [];
    const values = [];

    highlightArray[index + 1].forEach((entry) => {
      indices.push(entry.index);
      values.push(entry.val);
    });
    const minandmaxangle = findMinMaxAngles(values);

    return (
      <div>
        <p>Minimum Angle : {minandmaxangle.minAngle}</p>
        <br></br>
        <p>Maximum Angle : {minandmaxangle.maxAngle}</p>
        <br></br>
        <p>
          Flexion Velocity :{" "}
          {Math.abs(
            (minandmaxangle.maxAngle - minandmaxangle.minAngle) /
              indices[indices.length - 1] -
              indices[0]
          ).toFixed(2)}
        </p>
        <br></br>
        <p>
          Extension Velocity :{" "}
          {Math.abs(
            (minandmaxangle.maxAngle + minandmaxangle.minAngle) /
              indices[indices.length - 1] -
              indices[0]
          ).toFixed(2)}
        </p>
        <br></br>
        <p>
          Velocity :{" "}
          {parseInt(
            Math.abs(
              (minandmaxangle.maxAngle - minandmaxangle.minAngle) /
                indices[indices.length - 1] -
                indices[0]
            ).toFixed(2)
          ) +
            parseInt(
              Math.abs(
                (minandmaxangle.maxAngle + minandmaxangle.minAngle) /
                  indices[indices.length - 1] -
                  indices[0]
              ).toFixed(2)
            )}
        </p>
        <br></br>
        <p>ROM : {minandmaxangle.maxAngle - minandmaxangle.minAngle}</p>
        <br></br>
      </div>
    );
  };

  useEffect(() => {
    let interval;

    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prevProgress) => prevProgress + 100 / timer);
        // console.log("Progress",progress);
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isPlaying, timer]);

  useEffect(() => {
    if (timer <= 0) {
      setDownloadEnabled(true);
    }
  }, [timer]);

  const downloadGraph = () => {
    // Replace this with actual logic to download the graph image
    alert("Download the graph image here");
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);

    // Toggle Bluetooth connection status
    if (isPlaying) {
      setIsBluetoothConnected(false); // Disconnected when pausing
    } else {
      setIsBluetoothConnected(true); // Connected when playing
    }
  };
  // console.log(data,"DATA")

  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  const startTimer = () => {
    pain.length = 0;
    setStackedMetricsArray([]);
    sethighlightCount([]);
    cycleCount = 1;
    resetCards();
    tempRow.length = 0;
    sethighlightArray([]);
    setRedLineGraphData([]);
    // startRecording();
    setIsStopButtonClicked(false);
    setIsPlaying(true);
    setKey((prevKey) => prevKey + 1);
    setCounter(-1);
    elapsedTime = -1;
    setElapsedTime(-1);
    updateChart();
    // Create a new WebSocket connection when starting the chart
    const newSocket = new WebSocket(
      `wss://api-backup-vap2.onrender.com/ws/${userId}`
    );
    const startDateTime = new Date();
    setStartDate(startDateTime.toLocaleDateString()); // Update startDate
    setStartTime(formatTime(startDateTime)); // Update startTime

    console.log("WebSocket started at:", startDateTime);
    console.log("Start Date:", startDateTime.toLocaleDateString());
    console.log("Start Time:", formatTime(startDateTime));
    newSocket.onmessage = (event) => {
      // console.log(event, "event");
      const newData = JSON.parse(event.data);
      const seriesCount = newData.series;
      // console.log(seriesCount, "seriesCount");
      // seriesCount = Updated_data.length
      for (let i = 0; i < seriesCount.length; i += 20) {
        const slice = seriesCount.slice(i, i + seriesCount.length);
        setmetricArrayLength(slice);
        stackedMetricsArray.push(...slice);
        // console.log(stackedMetricsArray, "STACKED");
        const mappedSlice = slice.map((val, index) => ({
          index: i + index,
          val: parseFloat(val),
        }));

        // console.log(mappedSlice)
        metricArray.push(...mappedSlice);
        console.log(metricArrayLength, "metrics");
        // setmetricArray(mappedSlice)
      }

      // console.log(metricArray);
      return metricArray;
    };
    newSocket.onopen = () => {
      console.log("Socket open");
    };
    newSocket.onclose = (event) => {
      if (event.wasClean) {
        setTargetRotation([0, 0, 0]);
        const newData = stackedMetricsArray[stackedMetricsArray.length - 1];
        setStackedMetricsArray([...stackedMetricsArray, newData]);
        staticvalue.push(...stackedMetricsArray);
        // console.log(staticvalue, "VALUE");
        console.log(
          `WebSocket connection closed cleanly, code=${event.code}, reason=${event.reason}`
        );
        const endDate = new Date();
        console.log("WebSocket closed at:", endDate);
      } else {
        console.error("WebSocket connection abruptly closed");
      }
    };

    setSocket(newSocket); // Set the socket state to the new WebSocket instance

    if (!timerRef.current) {
      timerRef.current = setInterval(updateChart, 1000);
    }

    // setTimeout(() => {
    //   setIsPlaying(false)
    //   setIsTimerRunning(false);
    //   clearInterval(timerRef.current);
    //   timerRef.current = undefined;
    //   setProgress(0);
    //   if (newSocket) {
    //     newSocket.close(1000, "Goodbye, WebSocket!");
    //     setSocket(null);
    //     setCounter(-1);
    //     setmetricArray([]);
    //   }
    //   setIsStartButtonDisabled(false);
    // }, 120000); // 120000 milliseconds = 2 minutes
    flag = 0;
    setData([]);
  };

  const [jointExtensionVelocity, setjointExtensionVelocity] = useState([]);
  const [jointFlexionVelocity, setjointFlexionVelocity] = useState([]);
  const [jointExtensionVelocityValue, setjointExtensionVelocityValue] =
    useState([]);
  const [jointFlexionVelocityValue, setjointFlexionVelocityValue] = useState(
    []
  );

  let [RedLineGraphData, setRedLineGraphData] = useState([]);

  const stopTimer = () => {
    const overllangles = findMinMaxAngles(angles);
    setMinAnglse(overllangles.minAngle);
    setMaxAngles(overllangles.maxAngle);
    setShowRedLine(false);
    const jointAnalysisData = analyzeJointData(angles, elapsedTime + 1);
    handleNumDropdownsChange(totalCycles);
    jointExtensionVelocity.push(jointAnalysisData.extensionVelocities[0]);
    jointFlexionVelocity.push(jointAnalysisData.flexionVelocities[0]);
    setjointExtensionVelocityValue(jointExtensionVelocity[0]);
    setjointFlexionVelocityValue(jointFlexionVelocity[0]);
    handleExerciseSelection(useExercise, angles);
    // console.log(jointExtensionVelocityValue, "jointExtensionVelocityValue");
    // console.log(jointFlexionVelocityValue, "jointFlexionVelocityValue");

    setRotationX(0);
    const endDateTime = new Date();
    setEndDate(endDateTime.toLocaleDateString()); // Update endDate
    setEndTime(formatTime(endDateTime)); // Update endTime

    console.log("WebSocket closed at:", endDateTime);
    console.log("Close Date:", endDateTime.toLocaleDateString());
    console.log("Close Time:", formatTime(endDateTime));
    stopRecording();
    setIsPlaying(false);
    setIsStopButtonClicked(true);
    setKey((prevKey) => prevKey + 1);
    handleTimerStop();
    flag = 0;
    setProgress(0); // Reset the progress bar

    setIsTimerRunning(false);
    clearInterval(timerRef.current);
    timerRef.current = undefined;
    setProgress(0);
    if (socket) {
      socket.close(1000, "Goodbye, WebSocket!");
      setSocket(null);
      setCounter(-1);
      setmetricArray([]);
      setangles([]);
    }
  };

  const handleTimerStop = () => {
    setIsPlaying(false);
    setIsStopButtonClicked(true);
    // setIsRunning(false); // Restart the timer
    setKey((prevKey) => prevKey + 1);
    setIsTimerRunning(false);
    clearInterval(timerRef.current);
    timerRef.current = undefined;
    setProgress(0);
    if (socket) {
      socket.close(1000, "Goodbye, WebSocket!");
      setSocket(null);
      setCounter(-1);
      setmetricArray([]);
      setShowRedLine(false);
      // const jointAnalysisData = analyzeJointData(angles, times);
      // handleNumDropdownsChange(totalCycles);
      // jointExtensionVelocity.push(jointAnalysisData.extensionVelocities[0]);
      // jointFlexionVelocity.push(jointAnalysisData.flexionVelocities[0]);
      // setjointExtensionVelocityValue(jointExtensionVelocity[0]);
      // setjointFlexionVelocityValue(jointFlexionVelocity[0]);
    }
    // Your custom code to run when the timer stops or completes
    // console.log("Timer stopped or completed");
  };

  const startRecording = () => {
    // setIsPlaying(true); // Start playing the chart
    navigator.mediaDevices
      .getDisplayMedia({ video: true, audio: false })
      .then((stream) => {
        const recorder = new RecordRTC(stream, {
          type: "video",
        });

        recorder.startRecording();

        setMediaStream(stream);
        setMediaRecorder(recorder);
        setIsRecording(true);
      })
      .catch((error) => {
        console.error("Error accessing media devices:", error);
      });
  };

  const stopRecording = () => {
    setIsPlaying(false); // Stop playing the chart

    if (mediaRecorder) {
      mediaRecorder.stopRecording(() => {
        const recordedBlobs = mediaRecorder.getBlob();
        const blobs =
          recordedBlobs instanceof Blob ? [recordedBlobs] : recordedBlobs;
        setRecordedChunks(blobs);
        setIsRecording(false);
        mediaStream.getTracks().forEach((track) => track.stop());

        // Automatically trigger the download
        const blob = new Blob(blobs, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "recorded-video.webm";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      });
    }
  };

  const downloadVideo = () => {
    const blob = new Blob(recordedChunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "recorded-video.webm";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Date and Time For deletion
  const [staticvalue, setstaticvalue] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState(new Date());
  const [startTime, setStartTime] = useState("12:00:00");
  const [endTime, setEndTime] = useState("13:00:00");

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const handleStartTimeChange = (event) => {
    setStartTime(event.target.value);
  };

  const handleEndTimeChange = (event) => {
    setEndTime(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Convert date and time to ISO format
    const startDateTime = new Date(`${startDate} ${startTime}`);
    const endDateTime = new Date(`${endDate} ${endTime}`);

    // Create payload for the delete API
    const deletePayload = {
      device_id: "device1", // Add the device_id here
      start_date: startDateTime.toISOString().split("T")[0],
      start_time: startTime,
      end_date: endDateTime.toISOString().split("T")[0],
      end_time: endTime,
    };
    console.log(deletePayload);
    try {
      // Send an HTTP request to your delete API endpoint
      const response = await fetch(
        "https://api-backup-vap2.onrender.com/delete-data",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(deletePayload),
        }
      );
      const responseData = await response.text();
      console.log(responseData);
      if (response.ok) {
        // Handle success (e.g., show a success message)
        toast.success("Data deleted successfully");
      } else {
        // Handle error (e.g., show an error message)
        const errorData = await response.json();
        toast.error(`Failed to delete data: ${errorData.error}`);
      }
    } catch (error) {
      // Handle network or other errors
      console.error("Error deleting data:", error);
      toast.success("Data deleted successfully");
    }
  };

  // Static-Graph--with progressbar

  const initialData = {
    labels: Array.from({ length: staticvalue.length }, (_, index) =>
      (index + 1).toString()
    ),
    datasets: [
      {
        name: "Sales of the week",
        data: staticvalue.map((value) => parseFloat(value)),
      },
    ],
  };
  // console.log(initialData,"INI")
  const [isChartVisible, setChartVisibility] = useState(false);
  const [sdata, setsData] = useState(initialData);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 6 }); // Initial visible range
  const [progressbar, setProgressbar] = useState(0); // Progress for the range input

  const handleButtonClick = () => {
    const maxProgressValue = initialData.labels.length - 6; // Assuming the range is 6
    setProgressbar(maxProgressValue);
    updateVisibleRange(0, maxProgressValue + 6); // Assuming updateVisibleRange is a function to update the visible range
    setChartVisibility(true);
  };

  const handleProgressChange = (event) => {
    const progressValue = parseInt(event.target.value, 10);
    const newStart = progressValue;
    const newEnd = Math.min(initialData.labels.length - 1, progressValue + 6);
    updateVisibleRange(newStart, newEnd);
    setProgressbar(progressValue);
  };

  const updateVisibleRange = (start, end) => {
    setVisibleRange({ start, end });
    const newData = {
      labels: initialData.labels.slice(start, end + 1),
      datasets: [
        {
          name: initialData.datasets[0].name,
          data: initialData.datasets[0].data.slice(start, end + 1),
        },
      ],
    };
    setsData(newData);
  };

  // Call updateVisibleRange initially to set the initial visible data
  useEffect(() => {
    updateVisibleRange(0, 6);
  }, []);

  // WEBGL
  // const Model = ({ url, position, shouldRotate, setTargetRotation }) => {
  //   const gltf = useLoader(GLTFLoader, url);
  //   const modelRef = useRef();

  //   useEffect(() => {
  //     if (modelRef.current && shouldRotate) {
  //       // Set the initial rotation to the target rotation
  //       modelRef.current.rotation.set(
  //         targetRotation[0],
  //         targetRotation[1],
  //         targetRotation[2]
  //       );
  //     }
  //   }, [shouldRotate, targetRotation]);

  //   useFrame(() => {
  //     if (modelRef.current && shouldRotate) {
  //       const { rotation } = modelRef.current;

  //       if (rotation) {
  //         modelRef.current.rotation.x = MathUtils.lerp(
  //           rotation.x !== undefined ? rotation.x : 0,
  //           targetRotation[0],
  //           0.02 // Adjust the lerp factor for smoother motion
  //         );
  //         modelRef.current.rotation.y = MathUtils.lerp(
  //           rotation.y !== undefined ? rotation.y : 0,
  //           targetRotation[1],
  //           0.02
  //         );
  //         modelRef.current.rotation.z = MathUtils.lerp(
  //           rotation.z !== undefined ? rotation.z : 0,
  //           targetRotation[2],
  //           0.02
  //         );
  //       }
  //     }
  //   });

  //   return (
  //     <group ref={modelRef} position={position}>
  //       <primitive object={gltf.scene} scale={4} />
  //     </group>
  //   );
  // };

  const models = [
    { url: "./legmodel.glb", position: [-0.2, 7, 7.9], shouldRotate: true },
    { url: "./Thigh.glb", position: [-1.4, 3, 2.8], shouldRotate: false },
    { url: "./Meter.glb", position: [-1.3, 3, 3], shouldRotate: false },
  ];

  const [targetRotation, setTargetRotation] = useState([0, 0, 0]);

  // for finding the cycles

  const [angles, setangles] = useState([]);
  const [times, settimes] = useState([]);
  let isSecondValueReceived = false;
  let temps = 0;
  let isFlexion = false;
  const [flexionCycles, setFlexionCycles] = useState(0);
  const [extensionCycles, setExtensionCycles] = useState(0);
  const [totalCycles, setTotalCycles] = useState(0);

  function processNewAngle(newAngle, newTime) {
    highlightcounter += 1;
    sethighlightCount(highlightcounter);
    let currentAngle = newAngle;
    let testcount = cycleCount;

    if (isSecondValueReceived) {
      // console.log(newAngle, "newAngle");
      if (
        temps > currentAngle &&
        !isFlexion &&
        currentAngle != null &&
        temps != null
      ) {
        // Sign change to extension
        isFlexion = true;
        temps = currentAngle;
        cycleCount++;
        flexionCycle++;
        // tempRow.push(createObject);
        // highlightArray.push(tempRow)
        // tempRow.length=0
        // console.log(highlightArray, "tempRow");
        // tempRow.push(createObject);
        // console.log(tempRow, "tempRow");
      } else if (
        temps < currentAngle &&
        isFlexion &&
        currentAngle != null &&
        temps != null
      ) {
        // Sign change to flexion
        isFlexion = false;
        temps = currentAngle;
        cycleCount++;
        extensionCycle++;
        // tempRow.push(createObject);
        // highlightArray.push(tempRow)
        // tempRow.length=0
        // console.log(highlightArray, "tempRow");
        // tempRow.push(createObject);
        // console.log(tempRow, "tempRow");
      }
      // if (testcount == cycleCount) {
      //   tempRow.push(createObject);
      //   console.log(tempRow, "tempRow");
      // }
      temps = newAngle;
      // Add the new angle to the array
      angles.push(currentAngle);
      times.push(newTime);
      // Log the current state
      setFlexionCycles(flexionCycle);
      setExtensionCycles(extensionCycle);
      setTotalCycles(cycleCount);
    } else {
      // console.log(createObject,"newangle")
      // tempRow.push(createObject);
      // console.log(tempRow, "firstvalue");
      // Set the initial values for the first time
      temps = newAngle;
      angles.push(currentAngle);
      times.push(newTime);
      isFlexion = currentAngle < newAngle;
      isSecondValueReceived = true;
    }
  }

  let tempRow = [];
  const [highlightArray, sethighlightArray] = useState([]);

  function processObjectArray(ObjectElements) {
    let tempRow = [];
    let highlightArray = [];
    console.log("Inside Fucntion", ObjectElements);
    for (let i = 0; i < ObjectElements.length - 1; i++) {
      let change = ObjectElements[i].val - ObjectElements[i + 1].val;
      tempRow.push(ObjectElements[i]);
      if (i + 1 === ObjectElements.length - 1) {
        tempRow.push(ObjectElements[i + 1]);
        // highlightArray.push(tempRow);
        // console.log("final push highlightArray",highlightArray)
      }

      if (change === 0) {
        continue;
      }

      if (
        prevSignChange !== null &&
        Math.sign(change) !== Math.sign(prevSignChange) &&
        ObjectElements[i].val != null
      ) {
        cycleCount++;
        // highlightArray.push(tempRow);
        // console.log("highlightArray",highlightArray)
        tempRow = [ObjectElements[i]];
        highlightArray.push(tempRow);
        // console.log("tempRow", tempRow);

        if (Math.sign(change) === -1) {
          if (minFlexionAngle === null && ObjectElements[i].val != null) {
            flexionCycle++;
            minFlexionAngle = initialAngle;
            let maxFlexionAngle = ObjectElements[i].val;
            minExtensionAngle = ObjectElements[i + 1].val;
            // Calculate flexion velocity
            initialTime = ObjectElements[i + 1].index;
          } else {
            flexionCycle++;
            let maxFlexionAngle = ObjectElements[i].val;
            minExtensionAngle = ObjectElements[i + 1].val;
            // Calculate flexion velocity
            initialTime = ObjectElements[i + 1].index;
          }
        } else {
          if (minExtensionAngle === null && ObjectElements[i].val != null) {
            extensionCycle++;
            minExtensionAngle = initialAngle;
            let maxExtensionAngle = ObjectElements[i].val;
            minFlexionAngle = ObjectElements[i + 1].val;
            // Calculate extension velocity
            initialTime = ObjectElements[i + 1].index;
          } else if (ObjectElements[i].val) {
            extensionCycle++;
            let maxExtensionAngle = ObjectElements[i].val;
            minFlexionAngle = ObjectElements[i + 1].val;
            // Calculate extension velocity
            initialTime = ObjectElements[i + 1].index;
          }
        }
      }

      prevSignChange = change;
    }
    highlightArray.push([{ index: 0, val: 0 }]);
    sethighlightArray(highlightArray);
    // console.log(highlightArray,"highlight")
    // console.log("ObjectElements",ObjectElements)
    // console.log(flexionVelocities, "extensionVelocities");
    // console.log(extensionVelocities, "extensionVelocities");
    return {
      flexionCycle: flexionCycle,
      extensionCycle: extensionCycle,
    };
  }
  // Real Functionality from python

  let initialAngle = angles[0];
  let initialTime = times[0];
  let cycleCount = 1;
  let prevSignChange = null;
  let flexionCycle = 0;
  let extensionCycle = 0;
  let flexionVelocities = [];
  let extensionVelocities = [];
  let minFlexionAngle = null;
  let minExtensionAngle = null;

  function ChartObject(val, index) {
    const newObj = {
      index: index,
      val: val,
    };
    return newObj;
  }

  let ObjectElements = [];

  const analyzeJointData = (array, fulltime) => {
    let time = [];
    for (let i = 0; i < fulltime; i++) {
      time[i] = i;
    }
    console.log(array, "ANGLES");
    console.log(time, "Times");
    // handleExerciseSelection(useExercise, array);
    for (let i = 0; i < array.length; i++) {
      // console.log(array.length, "ANGLES");
      let change = array[i] - array[i + 1];
      const createObject = ChartObject(array[i], time[i]);
      // console.log(createObject,"create")
      ObjectElements.push(createObject);
      if (change === 0) {
        continue;
      }

      if (
        prevSignChange !== null &&
        Math.sign(change) !== Math.sign(prevSignChange) &&
        array[i] != null
      ) {
        cycleCount++;

        if (Math.sign(change) === -1) {
          if (minFlexionAngle === null && array[i] != null) {
            flexionCycle++;
            minFlexionAngle = initialAngle;
            let maxFlexionAngle = array[i];
            minExtensionAngle = array[i + 1];
            // Calculate flexion velocity
            let flexionVelocity =
              (-1 * (maxFlexionAngle - minFlexionAngle)) /
              (time[i] - initialTime);
            flexionVelocities.push(flexionVelocity);
            initialTime = time[i + 1];
          } else {
            flexionCycle++;
            let maxFlexionAngle = array[i];
            minExtensionAngle = array[i + 1];
            // Calculate flexion velocity
            let flexionVelocity =
              (-1 * (maxFlexionAngle - minFlexionAngle)) /
              (time[i] - initialTime);
            flexionVelocities.push(flexionVelocity);
            initialTime = time[i + 1];
          }
        } else {
          if (minExtensionAngle === null && array[i] != null) {
            extensionCycle++;
            minExtensionAngle = initialAngle;
            let maxExtensionAngle = array[i];
            minFlexionAngle = array[i + 1];
            // Calculate extension velocity
            let extensionVelocity =
              (maxExtensionAngle - minExtensionAngle) / (time[i] - initialTime);
            extensionVelocities.push(extensionVelocity);
            initialTime = time[i + 1];
          } else if (array[i] != null) {
            extensionCycle++;
            let maxExtensionAngle = array[i];
            minFlexionAngle = array[i + 1];
            // Calculate extension velocity
            let extensionVelocity =
              (maxExtensionAngle - minExtensionAngle) / (time[i] - initialTime);
            extensionVelocities.push(extensionVelocity);
            initialTime = time[i + 1];
          }
        }
      }

      prevSignChange = change;
    }
    // console.log("ObjectElements", ObjectElements);
    // console.log(flexionVelocities, "extensionVelocities");
    // console.log(ObjectElements, "ObjectElements");
    processObjectArray(ObjectElements);
    return {
      flexionVelocities: flexionVelocities,
      extensionVelocities: extensionVelocities,
    };
  };

  // Highlighted graph

  const [showRedLine, setShowRedLine] = useState(false);
  const [numDropdowns, setNumDropdowns] = useState(1);

  const handleNumDropdownsChange = (number) => {
    const newValue = parseInt(number, 10);
    setNumDropdowns(isNaN(newValue) ? 1 : newValue);
  };

  let PlotArray = [];
  function GraphPlot(specificArray, size) {
    // console.log("specificArray", specificArray);
    // console.log("size", size);
    for (let i = 0; i < size; i++) {
      PlotArray.push({
        index: i,
        val: null,
      });
    }
    // console.log(PlotArray.length,"length")
    let ExtraArray = [];
    // console.log("size", size);
    for (let i = 0; i < specificArray.length; i++) {
      ExtraArray.push(specificArray[i].index);
    }
    // console.log("ExtraArray", ExtraArray);
    let k = 0;
    let Index = specificArray[k].index;
    let EndIndex = specificArray[specificArray.length - 1].index;
    for (let i = 0; i < PlotArray.length; i++) {
      if (ExtraArray.includes(PlotArray[i].index) && k < specificArray.length) {
        PlotArray[i].val = specificArray[k].val;
        k += 1;
      }
    }
    // console.log("PlotArray", PlotArray);
  }

  const handleHighlightedGraph = () => {
    // console.log("RedLineGraphData", RedLineGraphData);
    setShowRedLine((prev) => !prev);
  };

  // Card Generator

  const totalCards = totalCycles;
  const cardsPerPage = 50;

  const [startIndex, setStartIndex] = useState(0);
  const [CardAngle, setCardAngle] = useState([]);
  const [CardTime, setCardTime] = useState([]);

  function findMinMaxAngles(arr) {
    if (!arr || arr.length === 0) {
      return { minAngle: null, maxAngle: null };
    }

    let minAngle = arr[0];
    let maxAngle = arr[0];

    for (let i = 1; i < arr.length; i++) {
      if (arr[i] < minAngle) {
        minAngle = arr[i];
      } else if (arr[i] > maxAngle) {
        maxAngle = arr[i];
      }
    }

    return { minAngle, maxAngle };
  }

  const pain = [];

  const generateParagraph = (index) => {
    const indices = [];
    const values = [];
    highlightArray[index].forEach((entry) => {
      indices.push(entry.index);
      values.push(entry.val);
    });

    const minandmaxangle = findMinMaxAngles(values);
    const velocityforPain =
      parseInt(
        Math.abs(
          (minandmaxangle.maxAngle - minandmaxangle.minAngle) /
            indices[indices.length - 1] -
            indices[0]
        ).toFixed(2)
      ) +
      parseInt(
        Math.abs(
          (minandmaxangle.maxAngle + minandmaxangle.minAngle) /
            indices[indices.length - 1] -
            indices[0]
        ).toFixed(2)
      );
    if (velocityforPain < 10) {
      pain.push(1);
    } else if (velocityforPain > 10 && velocityforPain < 20) {
      pain.push(2);
    } else if (velocityforPain > 20 && velocityforPain < 30) {
      pain.push(3);
    } else if (velocityforPain > 30 && velocityforPain < 40) {
      pain.push(4);
    } else if (velocityforPain > 40 && velocityforPain < 50) {
      pain.push(5);
    } else if (velocityforPain > 50 && velocityforPain < 60) {
      pain.push(6);
    } else if (velocityforPain > 60 && velocityforPain < 70) {
      pain.push(7);
    } else if (velocityforPain > 70 && velocityforPain < 80) {
      pain.push(8);
    } else if (velocityforPain > 80 && velocityforPain < 90) {
      pain.push(9);
    } else if (velocityforPain > 90 && velocityforPain < 100) {
      pain.push(10);
    } else if (velocityforPain > 100 && velocityforPain < 110) {
      pain.push(11);
    } else if (velocityforPain > 110 && velocityforPain < 120) {
      pain.push(12);
    } else if (velocityforPain > 120 && velocityforPain < 130) {
      pain.push(13);
    } else if (velocityforPain > 130 && velocityforPain < 140) {
      pain.push(14);
    } else if (velocityforPain > 140 && velocityforPain < 150) {
      pain.push(15);
    } else if (velocityforPain > 150 && velocityforPain < 160) {
      pain.push(16);
    } else if (velocityforPain > 160 && velocityforPain < 170) {
      pain.push(17);
    } else if (velocityforPain > 170 && velocityforPain < 180) {
      pain.push(18);
    } else {
      pain.push(19);
    }
    return `
    <div style="text-align: center; font-size: 3rem; padding: 0.5rem;">
        ${pain[index]}<sub class="text-base">Pain</sub>
    </div>
    Minimum Angle: ${minandmaxangle.minAngle}<br>
    Maximum Angle: ${minandmaxangle.maxAngle}<br>
    Flexion Velocity: ${Math.abs(
      (minandmaxangle.maxAngle - minandmaxangle.minAngle) /
        indices[indices.length - 1] -
        indices[0]
    ).toFixed(2)}<br>
    Extension Velocity: ${Math.abs(
      (minandmaxangle.maxAngle + minandmaxangle.minAngle) /
        indices[indices.length - 1] -
        indices[0]
    ).toFixed(2)}<br>
    Velocity: ${velocityforPain}<br>
    ROM: ${minandmaxangle.maxAngle - minandmaxangle.minAngle}<br>
`;
  };

  const resetCards = () => {
    // Reset state variables related to cards
    setStartIndex(0);
    setCardAngle([]);
    setCardTime([]);
  };

  const handleCardClick = (cardIndex) => {
    console.log(highlightArray);
    GraphPlot(highlightArray[parseInt(cardIndex, 10)], elapsedTime + 1);
    handleHighlightedGraph();
    setShowRedLine(true);
    setRedLineGraphData(PlotArray);
  };

  const generateCards = () => {
    const cards = [];
    const endIndex = Math.min(startIndex + cardsPerPage, totalCards);
    // console.log(highlightArray)
    for (let i = startIndex; i < endIndex && i < totalCards; i++) {
      const paragraph = generateParagraph(i);

      cards.push(
        <div key={i} className="card" onClick={() => handleCardClick(i)}>
          <Card
            key={i}
            color={pain[i] > 10 ? "red" : "green"}
            variant="gradient"
            className="border-black w-full max-w-[15rem] p-2 ml-1  mr-2 inline-block hover:scale-105 ease-in-out duration-300"
          >
            <CardHeader
              floated={false}
              shadow={false}
              color="transparent"
              className="m-0 mb-1 rounded-none border-b border-white/10 pb-2 text-center "
            >
              <Typography
                variant="small"
                color="black"
                className="font-bold uppercase"
              >
                CYCLE {i + 1}
              </Typography>
              {/* <Typography
                variant="h1"
                color="black"
                className="mt-2 flex justify-center gap-1 text-4xl font-bold"
              >
                {pain[i]} <span className="self-end text-base">Pain</span>
              </Typography> */}
            </CardHeader>
            <CardBody className="pt-0 pb-2">
              <ul className="flex flex-col">
                <li className="flex items-center justify-between">
                  <Typography
                    dangerouslySetInnerHTML={{ __html: paragraph }}
                    color="black"
                    className="text-base font-medium font-bold"
                  ></Typography>
                </li>
              </ul>
            </CardBody>
          </Card>
        </div>
      );
    }
    return cards;
  };

  const handleWheel = (event) => {
    if (event.deltaY > 0) {
      handleNextClick();
    } else {
      handlePrevClick();
    }
  };

  const handleNextClick = () => {
    setStartIndex((prevIndex) =>
      Math.min(prevIndex + cardsPerPage, totalCards - cardsPerPage)
    );
  };

  const handlePrevClick = () => {
    setStartIndex((prevIndex) => Math.max(0, prevIndex - cardsPerPage));
  };

  // new design

  // const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [isrenderscreen, setIsrenderscreen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [isChecked, setIsChecked] = useState(true);
  const [isLegChecked, setIsLegChecked] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  // const [isPlaying, setIsPlaying] = useState(false);
  // const [key, setKey] = useState(0);
  const [selectedMinute, setSelectedMinute] = useState("");
  const [selectedSecond, setSelectedSecond] = useState("");
  // const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  // const [isrenderscreen, setIsrenderscreen] = useState(true);

  // const timeIntervals = ["1", "1.5", "2"];

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
    if (selectedMinute * 60 + selectedSecond) {
      // Toggle the isPlaying state
      setIsPlaying(!isPlaying);
      togglePlay();
      toggleChart();
    } else {
      // If no time interval is selected, you can choose to handle it accordingly
      // For example, show a message to the user or disable the button
      toast.error("Please select a time interval!");
    }
  };
  // const handleTimerStop = () => {
  //   setIsPlaying(false);
  //   // setIsRunning(false); // Restart the timer
  //   setKey((prevKey) => prevKey + 1);
  // };
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

  const [useExercise, setuseExercise] = useState("");

  const [diagnoArray, setdiagnoArray] = useState([]);
  const [tempDiagnoarray, settempDiagnoarray] = useState([]);

  let tempedRow = [];
  const [highlightedArray, sethighlightedArray] = useState([]);

  function PainandRomArray(ObjectElements) {
    let tempedRow = [];
    let highlightedArray = [];
    console.log("Inside Fucntion", ObjectElements);
    for (let i = 0; i < ObjectElements.length - 1; i++) {
      let change = ObjectElements[i].val - ObjectElements[i + 1].val;
      tempedRow.push(ObjectElements[i]);
      if (i + 1 === ObjectElements.length - 1) {
        tempedRow.push(ObjectElements[i + 1]);
        highlightedArray.push(tempedRow);
        // console.log("final push highlightedArray",highlightedArray)
      }

      if (change === 0) {
        continue;
      }

      if (
        prevSignChange !== null &&
        Math.sign(change) !== Math.sign(prevSignChange) &&
        ObjectElements[i].val != null
      ) {
        cycleCount++;
        // highlightedArray.push(tempedRow);
        // console.log("highlightedArray",highlightedArray)
        tempedRow = [ObjectElements[i]];
        highlightedArray.push(tempedRow);
        // console.log("tempedRow", tempedRow);

        if (Math.sign(change) === -1) {
          if (minFlexionAngle === null && ObjectElements[i].val != null) {
            flexionCycle++;
            minFlexionAngle = initialAngle;
            let maxFlexionAngle = ObjectElements[i].val;
            minExtensionAngle = ObjectElements[i + 1].val;
            // Calculate flexion velocity
            initialTime = ObjectElements[i + 1].index;
          } else {
            flexionCycle++;
            let maxFlexionAngle = ObjectElements[i].val;
            minExtensionAngle = ObjectElements[i + 1].val;
            // Calculate flexion velocity
            initialTime = ObjectElements[i + 1].index;
          }
        } else {
          if (minExtensionAngle === null && ObjectElements[i].val != null) {
            extensionCycle++;
            minExtensionAngle = initialAngle;
            let maxExtensionAngle = ObjectElements[i].val;
            minFlexionAngle = ObjectElements[i + 1].val;
            // Calculate extension velocity
            initialTime = ObjectElements[i + 1].index;
          } else if (ObjectElements[i].val) {
            extensionCycle++;
            let maxExtensionAngle = ObjectElements[i].val;
            minFlexionAngle = ObjectElements[i + 1].val;
            // Calculate extension velocity
            initialTime = ObjectElements[i + 1].index;
          }
        }
      }

      prevSignChange = change;
    }
    highlightedArray.push([{ index: 0, val: 0 }]);
    sethighlightedArray(highlightedArray);
    // console.log(highlightedArray,"highlight")
    // console.log("ObjectElements",ObjectElements)
    // console.log(flexionVelocities, "extensionVelocities");
    // console.log(extensionVelocities, "extensionVelocities");
    return {
      highlightedArray: highlightedArray,
      // flexionCycle: flexionCycle,
      // extensionCycle: extensionCycle,
    };
  }

  function handleHighlightArray(highlightedArray) {
    const pain = [];
    console.log(highlightedArray, "HI");
    // Loop through each array in updatedHighlightArray
    highlightedArray.forEach((innerArray) => {
      const indices = [];
      const values = [];

      // Process each object in the inner array
      innerArray.forEach((entry) => {
        indices.push(entry.index);
        values.push(entry.val);
      });

      // Calculate velocity and pain level for this inner array
      const minandmaxangle = findMinMaxAngles(values);
      const velocityforPain =
        parseInt(
          Math.abs(
            (minandmaxangle.maxAngle - minandmaxangle.minAngle) /
              indices[indices.length - 1] -
              indices[0]
          ).toFixed(2)
        ) +
        parseInt(
          Math.abs(
            (minandmaxangle.maxAngle + minandmaxangle.minAngle) /
              indices[indices.length - 1] -
              indices[0]
          ).toFixed(2)
        );

      // Calculate pain level based on velocityforPain
      if (velocityforPain < 10) {
        pain.push(1);
      } else if (velocityforPain > 10 && velocityforPain < 20) {
        pain.push(2);
      } else if (velocityforPain > 20 && velocityforPain < 30) {
        pain.push(3);
      } else if (velocityforPain > 30 && velocityforPain < 40) {
        pain.push(4);
      } else if (velocityforPain > 40 && velocityforPain < 50) {
        pain.push(5);
      } else if (velocityforPain > 50 && velocityforPain < 60) {
        pain.push(6);
      } else if (velocityforPain > 60 && velocityforPain < 70) {
        pain.push(7);
      } else if (velocityforPain > 70 && velocityforPain < 80) {
        pain.push(8);
      } else if (velocityforPain > 80 && velocityforPain < 90) {
        pain.push(9);
      } else if (velocityforPain > 90 && velocityforPain < 100) {
        pain.push(10);
      } else if (velocityforPain > 100 && velocityforPain < 110) {
        pain.push(11);
      } else if (velocityforPain > 110 && velocityforPain < 120) {
        pain.push(12);
      } else if (velocityforPain > 120 && velocityforPain < 130) {
        pain.push(13);
      } else if (velocityforPain > 130 && velocityforPain < 140) {
        pain.push(14);
      } else if (velocityforPain > 140 && velocityforPain < 150) {
        pain.push(15);
      } else if (velocityforPain > 150 && velocityforPain < 160) {
        pain.push(16);
      } else if (velocityforPain > 160 && velocityforPain < 170) {
        pain.push(17);
      } else if (velocityforPain > 170 && velocityforPain < 180) {
        pain.push(18);
      } else {
        pain.push(19);
      }
    });

    return pain;
  }

  function handleExerciseSelection(chosenExercise, simple) {
    console.log(`${chosenExercise} is chosen.`);
    setuseExercise(chosenExercise);
    console.log(simple, "simple");

    if (simple && simple.length > 0) {
      const simpleObjects = simple.map((value, index) =>
        ChartObject(value, index)
      );
      // console.log(simpleObjects)
      const updatedHighlightArray = PainandRomArray(simpleObjects);
      sethighlightedArray(updatedHighlightArray);
      console.log(updatedHighlightArray.highlightedArray);
      const painLevels = handleHighlightArray(
        updatedHighlightArray.highlightedArray
      );
      console.log(painLevels);
      const exerciseObject = {
        name: chosenExercise,
        values: simple,
        pain: painLevels,
        rom: maxAngles - minAngles,
      };

      // Remove duplicates from tempDiagnoarray
      const updatedDiagnoArray = diagnoArray.filter(
        (exercise) => exercise.name !== chosenExercise
      );
      const updatedTempDiagnoarray = tempDiagnoarray.filter(
        (exercise) => exercise.name !== chosenExercise
      );

      // Add the new exercise to tempDiagnoarray
      settempDiagnoarray([...updatedTempDiagnoarray, exerciseObject]);

      // Update diagnoArray with the updated array
      setdiagnoArray(updatedDiagnoArray);
    }
  }
  const [combinedArray, setCombinedArray] = useState([]);

  useEffect(() => {
    setCombinedArray(combinedArray);
  }, [combinedArray]);

  // const isExerciseDataValid =
  //   runningArray?.length > 0 &&
  //   squatsArray?.length > 0 &&
  //   pushupsArray?.length > 0 &&
  //   pullupsArray?.length > 0 &&
  //   leghipArray?.length > 0;

  const handledisplay = (count, exe, flag) => {
    loadModel(exe);
    setrep(count);
    setexerc(exe);
    setisdisplay(flag);
    loadModel(exe);
    console.log(exe, "exerc");
    setuseExercise(exe);
  };

  const [modelname, setmodelname] =useState("")

  const loadModel = async (exe) => {
    const s3 = new AWS.S3();
    console.log( "Model",s3);
    
    
    const params = {
      Bucket: "blenderbuck",
      Key: exe +".glb", // Replace with your actual model file name
    };
    

    try {
      console.log("Inside fetch");
      const data = await s3.getObject(params).promise();
      const loader = new GLTFLoader();
      const dLoader = new DRACOLoader();
      dLoader.setDecoderPath(
        "https://www.gstatic.com/draco/versioned/decoders/1.5.7/"
      );
      dLoader.setDecoderConfig({ type: "js" });
      loader.setDRACOLoader(dLoader);
      const glbData = await loader.loadAsync(
        URL.createObjectURL(new Blob([data.Body]))
      );
      console.log("Parsed GLB Data:", glbData); // Log parsed data
      // setModel(glbData.scene);
      setmodelname(exe);
      setGlbData(URL.createObjectURL(new Blob([data.Body])));
    } catch (error) {
      console.error("Error fetching or parsing model:", error);
    }
  };

  const handleCompleteSubmit = () => {
    // Combine the contents of diagnoArray and tempDiagnoarray
    const combinedArray = [...diagnoArray, ...tempDiagnoarray];

    // Update diagnoArray with combinedArray
    setdiagnoArray(combinedArray);

    // Reset tempDiagnoarray
    settempDiagnoarray([]);

    // Store combinedArray in state
    setCombinedArray(combinedArray);
    // console.log("diagnarray after submit", combinedArray);
    updateExerciseData(combinedArray);
  };

  const updateExerciseData = async (combinedArray) => {
    const updatedExercises = combinedArray.map((exercise) => ({
      name: exercise.name,
      values: exercise.values,
      pain: exercise.pain, // Omit pain array as per the existing structure
      rom: exercise.rom, // Omit rom value as per the existing structure
    }));
    console.log("updatedExercises", updatedExercises);
    // Create the exerciseData object with the updated exercises
    const exerciseData = {
      data: updatedExercises,
    };
    const new_flag = 5;
    try {
      const response = await fetch(
        `https://api-backup-vap2.onrender.com/update-exercise-info/${patient_id}/${new_flag}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(exerciseData),
        }
      );

      if (response.ok) {
        console.log("Exercise data updated successfully");
        toast.success("Report sent to Doctor");
        // Handle success as needed
      } else {
        console.error("Failed to update exercise data");
        // Handle error as needed
      }
    } catch (error) {
      console.error("Error updating exercise data:", error);
      // Handle error as needed
    }
  };

  // AWS CODE

  const [glbData, setGlbData] = useState(null);

  // useEffect(() => {
  //   const loadModel = async () => {
  //     const s3 = new AWS.S3();
  //     console.log(s3, "Model");
  //     const params = {
  //       Bucket: "blenderbuck",
  //       Key: "ProneModelsLegMechanic.glb", // Replace with your actual model file name
  //     };

  //     try {
  //       console.log("Inside fetch");
  //       const data = await s3.getObject(params).promise();
  //       const loader = new GLTFLoader();
  //       const glbData = await loader.loadAsync(
  //         URL.createObjectURL(new Blob([data.Body]))
  //       );
  //       console.log("Parsed GLB Data:", glbData); // Log parsed data
  //       // setModel(glbData.scene);
  //       setGlbData(URL.createObjectURL(new Blob([data.Body])));
  //     } catch (error) {
  //       console.error("Error fetching or parsing model:", error);
  //     }
  //   };
  //   loadModel();
  // }, []);

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

  const sadata = [
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

  return (
    <div
      className={`w-full h-full bg-cover bg-center ${
        screenWidth < 1105 ? "flex flex-col gap-4 pt-4" : "flex flex-col gap-4"
      }`}
      style={{ backgroundImage: `url(${exerbg})` }}
    >
      <div
        className={` w-full   ${
          screenWidth < 1105
            ? "flex flex-col h-full gap-4"
            : "flex flex-row h-2/3 gap-4 px-2"
        }`}
      >
        {true && (
          <div
            className={`h-full  flex flex-col px-2 ${
              screenWidth < 1105 ? "w-full" : "w-3/5"
            }`}
          >
            <div className={`w-full h-1/6`}>
              <Typography
                variant="h3"
                color="white"
                className="flex text-start items-center h-full justify-center font-poppins"
              >
                {exerc}
              </Typography>
            </div>
            <div className="w-full h-5/6 pr-6">
              <div
                className={`w-full h-full `}
                // style={{
                //   backgroundColor: "rgba(255, 255, 255, 0.15)",
                //   backdropFilter: "blur(20px)",
                //   borderRadius: "1rem",
                //   border: "1px solid rgba(255, 255, 255, 0.18)",
                //   boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                // }}
              >
                <div className={`w-full h-full rounded-3x flex flex-row gap-8 relative`}>
                  <div
                    className={`w-4/5 h-full bg-transparent`}
                  >
                    <div className="w-full h-full">
                      <div className="w-full h-full">
                        <Canvas
                        camera={{
                          position: [-8,5, -7], // Adjusted camera position
                          fov: 6,
                          near: 0.1,
                          far: 1000,
                        }}
                      >
                        <Suspense fallback={null}>
                          {glbData && modelname && (
                            <>
                              <ModelRender
                                rotat={rotationX}
                                model={glbData}
                                
                                name={modelname}
                                
                              />
                              {/* <OrbitControls /> */}
                            </>
                          )}
                          <directionalLight
                            position={[-60, 40, -30]}
                            intensity={10}
                          />
                        </Suspense>
                      </Canvas>
                        </div>
                        
                    </div>
                  </div>
                  <div className={`w-1/5`}></div>
                  {shouldAutoplay && (
                        <video
                        className="absolute w-72 h-52 object-cover bottom-0 right-0"
                        // Use if condition to render autoplay attribute
                        autoPlay
                        // controls
                        // poster="/videos/poster-image.jpg"
                        >
                        <source src={RightLegBend} type="video/mp4" />
                      </video>
                      )}
                </div>
              </div>
            </div>
          </div>
        )}
        <div
          className={` h-full  flex flex-col px-2 ${
            screenWidth < 1105 ? "w-full gap-2" : "w-2/5"
          }`}
        >
          <div
            className={`w-full h-1/6   items-center ${
              screenWidth < 1535 && screenWidth >= 500
                ? "flex flex-row gap-4"
                : screenWidth < 500
                ? "flex flex-col gap-2"
                : "flex flex-row gap-4"
            }`}
          >
            <div
              className={`h-full flex items-center gap-4 ${
                screenWidth < 500 ? "w-full" : "w-1/2"
              }`}
            >
              <div className={`flex justify-center items-center`}>
                <button class="relative group rounded-full">
                  <ArrowLeftIcon
                    className={`w-7 h-7`}
                    onClick={onBack}
                    color="white"
                  />
                </button>
              </div>
              <div className={`w-full h-full flex items-center`}>
                <Typography
                  variant="h4"
                  color="white"
                  className="flex text-start font-poppins"
                >
                  Endurance
                </Typography>
              </div>
            </div>
            <div
              className={`h-full flex items-center  justify-end pr-2 ${
                screenWidth < 500 ? "w-full" : "w-1/2"
              }`}
            >
              <Typography
                className="text-white font-poppins font-medium bg-red-200 px-2.5 py-1 rounded-2xl flex flex-row gap-2 items-center"
                style={{
                  backgroundColor: "transparent",
                  backdropFilter: "blur(10px)",
                  borderRadius: "1rem",
                  border: "1px solid rgba(255, 255, 255, 0.18)",
                  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                }}
              >
                Exercises <ChevronDownIcon className="w-4 h-4" />
              </Typography>
            </div>
          </div>
          <div className="w-full h-5/6 rounded-3xl pl-3">
            <div
              className={`w-full h-full py-4 `}
              style={{
                backgroundColor: "transparent",
                backdropFilter: "blur(10px)",
                borderRadius: "1rem",
                border: "1px solid rgba(255, 255, 255, 0.18)",
                boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
              }}
            >
              <div className="w-full h-full py-4 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-pixelf bg-cover">
                {exer.map((item, index) => (
                  <div className={`w-full h-20 flex flex-row py-2`} key={index}>
                    <div
                      className={`w-1/6 h-full flex items-center justify-center`}
                    >
                      <Typography
                        variant="h4"
                        color="white"
                        className="flex text-start px-5 font-poppins"
                      >
                        {index + 1}
                      </Typography>
                    </div>
                    <div className={`w-4/6 h-full  flex flex-row`}>
                      <div className={`w-1/2 h-full `}>
                        <img src="" alt="" className={`w-full h-full px-4`} />
                      </div>
                      <div className={`w-1/2 h-full  flex flex-col`}>
                        <Typography
                          variant="h6"
                          color="white"
                          className="flex text-start w-full h-1/2 items-center font-poppins"
                        >
                          {item.name}
                        </Typography>
                        <Typography
                          variant="h6"
                          color="white"
                          className="flex text-start w-full h-1/2 items-center font-poppins"
                        >
                          Set - {item.rep}
                        </Typography>
                      </div>
                    </div>
                    <div
                      className={`w-1/6 h-full  flex justify-center items-center`}
                    >
                      <PlayCircleIcon
                        color="white"
                        className={`w-9 h-9 cursor-pointer`}
                        onClick={() => handledisplay(item.rep, item.name, true)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={` w-full gap-6 pt-2 pb-4 px-2 ${
          screenWidth < 900 ? "h-full flex flex-col" : "h-1/3 flex flex-row"
        }`}
      >
        <div
          className={`  rounded-2xl ${
            screenWidth < 900 ? "w-full h-60" : "w-2/6 pl-2 h-full"
          }`}
        >
          <div
            className={`w-full h-full`}
            style={{
              backgroundColor: "transparent",
              backdropFilter: "blur(20px)",
              borderRadius: "1rem",
              border: "1px solid rgba(255, 255, 255, 0.18)",
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
            }}
          >
            <div className="w-full h-full flex flex-col justify-start items-start">
              <div className="w-full h-1/6 flex justify-start flex-col pl-4 pt-2">
                <Typography
                  variant="h5"
                  color="white"
                  className=" flex  gap-1 text-base font-semibold font-poppins items-center justify-start"
                >
                  ROM Indicator
                </Typography>
                {/* <Typography
                  variant="h6"
                  color="white"
                  className=" flex gap-1 text-sm font-mediumb text-gray-300 font-poppins items-center justify-start"
                >
                  48% More than last month
                </Typography> */}
              </div>

              <div className="w-full h-4/6 pt-4 flex-col flex justify-center items-center">
                <CircularProgressbar
                  value={((maxAngles - minAngles) / 200) * 100} // Adjust value proportionally to be out of 200
                  text={`${maxAngles - minAngles}`} // Display the value out of 200
                  circleRatio={0.75}
                  styles={buildStyles({
                    rotation: 1 / 2 + 1 / 8,
                    trailColor: "#eee",
                    pathColor: "cyan",
                    textColor: "white",
                    textSize: "22px",
                  })}
                  className="font-poppins"
                />
              </div>
              <div className="w-full h-1/6 flex flex-col items-center justify-center">
                <button
                  className="text-2xl font-semibold flex flex-row gap-8 text-white"
                  onClick={handleCompleteSubmit}
                >
                  Submit <PaperAirplaneIcon className="w-8 h-8" color="white" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`  ${screenWidth < 900 ? "w-full h-60" : "w-3/6 h-full"}`}
          style={{
            backgroundColor: "transparent",
            backdropFilter: "blur(20px)",
            borderRadius: "1rem",
            border: "1px solid rgba(255, 255, 255, 0.18)",
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
          }}
        >
          <div className={`w-full h-1/6 px-2 flex items-center`}>
            <Typography variant="h5" color="white" className="flex text-start">
              Performance
            </Typography>
          </div>
          <div className={`w-full h-4/6`} ref={chartRef}>
            <div className="w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  width={500}
                  height={400}
                  data={data}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                  className="font-poppins"
                >
                  <defs>
                    <linearGradient
                      id="colorSandalYellow"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#FFE194" stopOpacity={0.9} />
                      <stop offset="95%" stopColor="#FFE194" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <Area
                    data={data}
                    dataKey="val"
                    stroke="#FF9900"
                    strokeWidth={4}
                    fill="url(#colorSandalYellow)"
                    // isAnimationActive={false}
                  />

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

                  {/* <Line
                    data={data}
                    dataKey="val"
                    dot={{ fill: "black", r: 5 }}
                    strokeDasharray="25 10"
                    stroke="#ffffff"
                    strokeWidth={2.5}
                    stackId="2"
                    isAnimationActive={false}
                  /> */}
                  {/* {showRedLine && (
                    <Line
                      data={RedLineGraphData}
                      type="monotone"
                      dataKey="val"
                      dot={{ fill: "yellow", r: 5 }}
                      strokeDasharray="25 10"
                      stroke="red"
                      stackId="2"
                      strokeWidth={2.5}
                      isAnimationActive={false}
                    />
                  )} */}
                  <XAxis
                    dataKey="index"
                    type="category"
                    allowDuplicatedCategory={false}
                    axisLine={false}
                    tick={{ fill: "white" }}
                  >
                    {/* <Label
                      dy={10}
                      value="Time"
                      domain={[1, elapsedTime + 20]}
                      position="insideBottom"
                      style={{ textAnchor: "middle", fill: "white" }} // Change fill to white
                      tick={{ fill: "white" }} // Change fill to white
                      ticks={[1, 20, 40, 60, 80, 100, 120]}
                    /> */}
                  </XAxis>
                  <YAxis axisLine={false} tick={{ fill: "white" }}>
                    {/* <Label
                      angle={-90}
                      value="Angle"
                      position="insideLeft"
                      style={{ textAnchor: "middle" }}
                      tick={{ fill: "black" }}
                    /> */}
                  </YAxis>
                  {/* <CartesianGrid
                    strokearray="1"
                    horizontal="true"
                    vertical=""
                  /> */}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className={`w-full h-1/6 px-2 flex flex-row items-center`}>
            <div className={`w-1/2 flex flex-row gap-4`}>
              <button
                className=" text-black font-bold py-2 px-3 rounded-full transition-all duration-300 ease-in-out"
                onClick={handlePlayPauseClick}
              >
                {isPlaying ? (
                  <PauseIcon className="w-8 h-8" color="white" />
                ) : (
                  <PlayIcon className="w-8 h-8" color="white" />
                )}
              </button>
              {!isPlaying && (
                <div className="w-full flex justify-center items-center gap-4">
                  <div className="flex flex-row items-end gap-1 font-poppins">
                    <input
                      type="number"
                      value={selectedMinute}
                      onChange={handleMinuteChange}
                      className=" text-black text-sm font-bold border rounded-md  w-12 h-6 text-center"
                      placeholder="00"
                    />
                    <span className="w-full h-full text-center text-black font-bold text-[10px] flex justify-end items-end font-poppins text-white">
                      min
                    </span>
                  </div>
                  <div className="flex flex-row items-end gap-1 font-poppins">
                    <input
                      type="number"
                      value={selectedSecond}
                      onChange={handleSecondChange}
                      className=" text-black text-sm font-bold border rounded-md w-12 h-6 text-center font-poppins"
                      placeholder="00"
                    />
                    <span className="w-full text-center text-black font-bold text-[10px] text-white">
                      sec
                    </span>
                  </div>
                </div>
              )}

              {isPlaying && (
                <div className="w-full flex justify-center items-center">
                  <CountdownCircleTimer
                    key={key}
                    isPlaying={isPlaying}
                    duration={selectedMinute * 60 + selectedSecond} // 2 minutes
                    colors={[["#ffffff"]]}
                    size={10}
                    strokeWidth={0}
                    onComplete={() => {
                      setIsPlaying(false);
                      handleTimerStop();
                      stopTimer();
                      return [false, 0]; // Stop the timer and reset to 0
                    }}
                  >
                    {({ remainingTime }) => (
                      <div className="font-semibold text-lg font-poppins">
                        {`${Math.floor(remainingTime / 60)
                          .toString()
                          .padStart(2, "0")}:${(remainingTime % 60)
                          .toString()
                          .padStart(2, "0")}`}
                      </div>
                    )}
                  </CountdownCircleTimer>
                </div>
              )}
            </div>
            <div className={`w-1/2 flex flex-row gap-4 justify-end pr-8`}>
              <button
                className=" text-black font-bold  rounded-full"
                onClick={() => {
                  // Add logic for reset action here
                  setData([]);
                  setShowRedLine(false);
                  // generateCards();
                  setSelectedMinute("");
                  setSelectedSecond("");
                  setKey((prevKey) => prevKey + 1);
                  setRotationX(0);
                }}
              >
                <ArrowPathIcon className="h-8 w-8  inline" color="white" />
              </button>

              <button
                className=" text-black font-bold  rounded-full"
                onClick={handleDownload}
                disabled={isPlaying}
              >
                <ArrowDownTrayIcon className="h-8 w-8  inline" color="white" />
              </button>
            </div>
          </div>
        </div>
        <div
          className={` ${
            screenWidth < 900 ? "w-full  h-60" : "w-3/6 pr-2  h-full"
          }`}
        >
          <div
            className={`w-full h-full`}
            style={{
              backgroundColor: "transparent",
              backdropFilter: "blur(20px)",
              borderRadius: "1rem",
              border: "1px solid rgba(255, 255, 255, 0.18)",
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
            }}
          >
            <Card color="transparent" className="w-full h-full px-5 pt-2 pb-4">
              <div className={`w-full h-6 flex justify-start`}>
                <Typography
                  variant="h5"
                  color="white"
                  className=" flex justify-start gap-1 font-semibold font-poppins"
                >
                  Comparison Scores
                </Typography>
              </div>
              <div className={`w-full h-5/6`}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    width={500}
                    height={400}
                    data={sadata}
                    margin={{
                      top: 5,
                      right: 0,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <defs>
                      <linearGradient
                        id="colorGreen"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#58AB63"
                          stopOpacity={0.9}
                        />
                        <stop
                          offset="95%"
                          stopColor="#58AB63"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorMilkPink"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#F3B1BB"
                          stopOpacity={0.9}
                        />
                        <stop
                          offset="95%"
                          stopColor="#F3B1BB"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    {/* <XAxis dataKey="name" />
                    <YAxis mirror={true}/> */}
                    <Tooltip />
                    <Area
                      dataKey="uv"
                      stackId="1"
                      stroke="#FF00FF"
                      fill="url(#colorMilkPink)"
                    />
                    <Area
                      type="monotone"
                      dataKey="pv"
                      stackId="1"
                      stroke="#00FF00"
                      fill="url(#colorGreen)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className={`w-full h-1/6 flex flex-row`}>
                <div className={`w-1/2 h-full flex flex-col`}>
                  <Typography
                    variant="h5"
                    color="white"
                    className=" flex flex-row gap-1 text-sm font-semibold font-poppins items-center justify-center"
                  >
                    <div className={`w-2 h-2 bg-green-500 rounded-full`} /> Last
                    Month
                  </Typography>
                  <Typography
                    variant="h6"
                    color="white"
                    className=" flex justify-center gap-1 font-semibold font-poppins"
                  >
                    247
                  </Typography>
                </div>
                <div className={`w-1/2 h-full flex flex-col`}>
                  <Typography
                    variant="h5"
                    color="white"
                    className=" flex flex-row  gap-1 text-sm font-semibold font-poppins items-center justify-center"
                  >
                    <div className={`w-2 h-2 bg-pink-200 rounded-full`} /> This
                    Month
                  </Typography>
                  <Typography
                    variant="h6"
                    color="white"
                    className=" flex justify-center gap-1 font-semibold font-poppins"
                  >
                    147
                  </Typography>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
      <div style={{ display: "none" }}>
        <Page size="A4" style={styles.page} ref={componentRef}>
          {highlightArray.map(
            (data, index) =>
              index >= 0 &&
              index < highlightArray.length - 1 && (
                <View key={index} style={styles.graphContainer}>
                  <Text style={styles.graphTitle}>Graph {index + 1}</Text>
                  <View style={styles.graphView}>
                    <LineChart
                      width={460}
                      height={250}
                      data={data}
                      margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                    >
                      <XAxis dataKey="name" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip />
                      <Line type="monotone" dataKey="val" stroke="#8884d8" />
                    </LineChart>
                  </View>
                  <br></br>
                  <div className="border-black">
                    {generateContentforPdf(index - 1)}
                  </div>
                </View>
              )
          )}
        </Page>
      </div>
      {!isPlaying && (
        <div className="w-full" style={{ display: "none" }}>
          {highlightArray.length > 0 && (
            <div
              style={{
                overflowX: "auto",
                whiteSpace: "nowrap",
                display: "flex",
              }}
              className="py-2 gap-4 ml-4"
            >
              {generateCards()}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Exercise;
