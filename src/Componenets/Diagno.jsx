import React, { Suspense, useEffect, useRef, useState } from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import classNames from "classnames";
import Fit from "../assets/fit.jpg";
import Profile from "../assets/profile.jpg";
import Logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import html2pdf from "html2pdf.js";
import {
  CartesianGrid,
  Label,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Scatter,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import html2canvas from "html2canvas";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import RecordRTC from "recordrtc";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MathUtils } from "three";
// Your code using GLTFLoader goes here
import { OrbitControls } from "@react-three/drei";
import Profilebar from "./Profilebar";
import Progresstimeline from "./Progresstimeline";
import Maingraph from "./Maingraph";
import Maingraphinfo from "./Maingraphinfo";

import {
  Drawer,
  Button,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Chip,
  Checkbox,
} from "@material-tailwind/react";

import {
  PlayIcon,
  PauseIcon,
  ArrowDownTrayIcon,
  ArrowPathIcon,
  ClockIcon,
  ArrowRightStartOnRectangleIcon,
  ArrowLongRightIcon,
  ArrowLongLeftIcon,
} from "@heroicons/react/24/solid";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "@material-tailwind/react";
import CycleInfo from "./Cycleinfo";
import Flashscreen from "../additionals/Flashscreen";

import { ToastContainer, toast } from "react-toastify";

// import Profilebar from

const Diagno = () => {
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
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
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
  const userId = user.user_id;
  const patient_id = user._id;
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

  const generateNewDataPoint = () => {
    const newIndex = elapsedTime + 1;

    if (counter >= -1 && counter < metricArray.length) {
      // console.log(metricArray,"metric")
      const metricItem = metricArray[counter - 1];
      const legvalue = parseFloat(metricItem.val);
      const rotationY = legvalue * (Math.PI / 180);
      setTargetRotation([rotationY, 0, 0]);
      if (metricItem && typeof metricItem === "object" && "val" in metricItem) {
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
  // const cardRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  // const [CardImage, setCardImage] = useState(null);
  const [ComponentImage, setComponentImage] = useState(null);

  const downloadAsPdf = async () => {
    try {
      const chartContainer = chartRef.current;
      // const cardContainer = cardRef.current;
      const componentContainer = componentRef.current;

      const canvas = await html2canvas(chartContainer, {
        scale: 2,
      });

      // const Cardcanvas = await html2canvas(cardContainer, {
      //   scale: 2,
      // });

      const componentcanvas = await html2canvas(componentContainer, {
        scale: 2,
      });
      const imgData = canvas.toDataURL("image/jpeg");
      // const imgCard = Cardcanvas.toDataURL("image/jpeg");
      const imgComponent = componentcanvas.toDataURL("image/jpeg");
      setImageSrc(imgData);
      // setCardImage(imgCard);
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

  useEffect(() => {
    // Trigger PDF generation when imageSrc is updated
    if (imageSrc !== null) {
      handleDownload();
    }
  }, [imageSrc]);

  const handleDownload = () => {
    try {
      setShowRedLine(false);
      downloadAsPdf();
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
          <img src="${imageSrc}" alt="Graph Image" style="width: 600px; height: 400px;" />
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

      // Assuming content is a DOM element
      combinedContent.appendChild(content.cloneNode(true));

      // Log combined content for debugging
      // console.log("Combined Content:", combinedContent.innerHTML);

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
    if (selectedItems != "") {
      setisDisabled(true);
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
          console.log(stackedMetricsArray, "STACKED");
          const mappedSlice = slice.map((val, index) => ({
            index: i + index,
            val: parseFloat(val),
          }));

          // console.log(mappedSlice)
          metricArray.push(...mappedSlice);
          // console.log(metricArrayLength, "metrics");
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
    } else {
      toast.warning("Select atleast one exercise to proceed", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
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
    setTargetRotation([0, 0, 0]);
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
  const Model = ({ url, position, shouldRotate, setTargetRotation }) => {
    const gltf = useLoader(GLTFLoader, url);
    const modelRef = useRef();

    useEffect(() => {
      if (modelRef.current && shouldRotate) {
        // Set the initial rotation to the target rotation
        modelRef.current.rotation.set(
          targetRotation[0],
          targetRotation[1],
          targetRotation[2]
        );
      }
    }, [shouldRotate, targetRotation]);

    useFrame(() => {
      if (modelRef.current && shouldRotate) {
        const { rotation } = modelRef.current;

        if (rotation) {
          modelRef.current.rotation.x = MathUtils.lerp(
            rotation.x !== undefined ? rotation.x : 0,
            targetRotation[0],
            0.02 // Adjust the lerp factor for smoother motion
          );
          modelRef.current.rotation.y = MathUtils.lerp(
            rotation.y !== undefined ? rotation.y : 0,
            targetRotation[1],
            0.02
          );
          modelRef.current.rotation.z = MathUtils.lerp(
            rotation.z !== undefined ? rotation.z : 0,
            targetRotation[2],
            0.02
          );
        }
      }
    });

    return (
      <group ref={modelRef} position={position}>
        <primitive object={gltf.scene} scale={4} />
      </group>
    );
  };

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
        console.log("tempRow", tempRow);

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
    console.log(highlightArray);
    for (let i = startIndex; i < endIndex  && i < totalCards ; i++) {
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

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
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
    if (selectedItems != "") {
      if (selectedMinute * 60 + selectedSecond) {
        // Toggle the isPlaying state
        setIsPlaying(!isPlaying);
        togglePlay();
        toggleChart();
      } else {

        toast.warning("Please select a time interval!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }else{
      toast.warning("Select atleast one exercise to proceed", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
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

  const [diagnoArray, setdiagnoArray] = useState([]);
  const [tempDiagnoarray, settempDiagnoarray] = useState([]);

  const [useExercise, setuseExercise] = useState("");

  function handleExerciseSelection(chosenExercise, simple) {
    console.log(`${chosenExercise} is chosen.`);
    setuseExercise(chosenExercise);
    console.log(simple, "simple");
    console.log(highlightArray);

    if (simple && simple.length > 0) {
      const exerciseObject = {
        name: chosenExercise,
        values: simple,
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

  const [showFlashscreen, setShowFlashscreen] = useState(false);

  const updateExerciseData = async (combinedArray) => {
    console.log("diagnarray after submit",combinedArray)
    const updatedExercises = combinedArray.map((exercise) => ({
      name: exercise.name,
      values: exercise.values,
      pain: [], // Omit pain array as per the existing structure
      rom: 10, // Omit rom value as per the existing structure
    }));
    console.log("updatedExercises", updatedExercises);
    // Create the exerciseData object with the updated exercises
    const exerciseData = {
      data: updatedExercises,
    };
    const new_flag = -1;
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/update-exercise-info/${patient_id}/${new_flag}`,
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

        setShowFlashscreen(true); // Display the Flashscreen component

        setTimeout(() => {
          setShowFlashscreen(false); // Hide the Flashscreen component after 5 seconds
          // Navigate to the finalreport page here if needed
          navigate("/finalreport");
        }, 7000);
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

  const [open, setOpen] = React.useState(false);
  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);
  const [isDisabled, setisDisabled] = useState(false);

  const [selectedItems, setSelectedItems] = useState([]);
  const [errorflag, seterrorflag] = useState(false);
  const handleItemSelect = (itemName) => {
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.includes(itemName)) {
        return prevSelectedItems.filter((item) => item !== itemName); // If item is already selected, remove it
      } else {
        return [...prevSelectedItems, itemName]; // If item is not selected, add it
      }
    });
  };

  const displayexercise = () => {
    if (selectedItems != "") {
      closeDrawer();
      seterrorflag(false);
    } else {
      seterrorflag(true);
    }
    console.log("Exercise", selectedItems);
  };

  return (
    <>
      <Drawer open={open} onClose={closeDrawer} className={`mt-20 rounded-r-lg`}>
        <div className="mb-2 flex items-center justify-between p-4">
          <Typography variant="h5" color="blue-gray" className={`font-poppins`}>
            Exercise Categories
          </Typography>
          <IconButton variant="text" color="blue-gray" onClick={closeDrawer}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </IconButton>
        </div>
        <List>
          <ListItem>
            <ListItemPrefix className="mr-3">
              <Checkbox
                id="Endurance"
                ripple={false}
                className="hover:before:opacity-0"
                containerProps={{
                  className: "p-0 my-auto",
                }}
                color="teal"
                checked={selectedItems.includes("Endurance")}
                onChange={() => handleItemSelect("Endurance")}
              />
            </ListItemPrefix>
            <Typography
              color="blue-gray"
              className={`font-poppins font-medium`}
            >
              Endurance
            </Typography>
          </ListItem>
          <ListItem>
            <ListItemPrefix className="mr-3">
              <Checkbox
                id="Endurance"
                ripple={false}
                className="hover:before:opacity-0"
                containerProps={{
                  className: "p-0 my-auto",
                }}
                color="teal"
                checked={selectedItems.includes("Strength")}
                onChange={() => handleItemSelect("Strength")}
              />
            </ListItemPrefix>
            <Typography
              color="blue-gray"
              className={`font-poppins font-medium`}
            >
              Strength
            </Typography>
          </ListItem>
          <ListItem>
            <ListItemPrefix className="mr-3">
              <Checkbox
                id="Endurance"
                ripple={false}
                className="hover:before:opacity-0"
                containerProps={{
                  className: "p-0 my-auto",
                }}
                color="teal"
                checked={selectedItems.includes("Flexibility")}
                onChange={() => handleItemSelect("Flexibility")}
              />
            </ListItemPrefix>
            <Typography
              color="blue-gray"
              className={`font-poppins font-medium`}
            >
              Flexibility
            </Typography>
          </ListItem>
          <ListItem>
            <ListItemPrefix className="mr-3">
              <Checkbox
                id="Endurance"
                ripple={false}
                className="hover:before:opacity-0"
                containerProps={{
                  className: "p-0 my-auto",
                }}
                color="teal"
                checked={selectedItems.includes("Balance")}
                onChange={() => handleItemSelect("Balance")}
              />
            </ListItemPrefix>
            <Typography
              color="blue-gray"
              className={`font-poppins font-medium`}
            >
              Balance
            </Typography>
          </ListItem>
          {errorflag && (
            <ListItem className={`p-0`}>
              <Typography
                color="blue-gray"
                className={`font-poppins font-medium text-sm text-red-400`}
              >
                *Select atleast one category to proceed
              </Typography>
            </ListItem>
          )}
        </List>
        <div className={`w-full flex justify-center items-center`}>
          <Button
            className="my-1 font-poppins"
            size="sm"
            onClick={displayexercise}
          >
            Proceed
          </Button>
        </div>
      </Drawer>
      <div>
        <Profilebar />
        <div className="flex flex-row items-center justify-center">
          {!showFlashscreen && (
            <div
              className={`w-1/6 font-poppins text-lg font-semibold text-center items-end flex flex-row justify-center gap-2 cursor-pointer ${
                isDisabled ? "opacity-50 pointer-events-none" : ""
              }`}
              onClick={isDisabled ? null : openDrawer}
            >
              <ArrowLongLeftIcon className="w-7 h-7" /> Select Categories
            </div>
          )}
          {!showFlashscreen && (
            <div className={`w-4/6`}>
              <Progresstimeline onStepClick={handleExerciseSelection} onExercise={selectedItems}/>
            </div>
          )}
          {showFlashscreen && <Flashscreen />}
          {!showFlashscreen && (
            <div className={`w-1/6 flex justify-center items-center`}>
              <button
                className="my-2 bg-gray-500 text-white px-4 py-2 rounded-md"
                onClick={handleCompleteSubmit}
                // disabled={!isExerciseDataValid}
              >
                Submit
              </button>
            </div>
          )}
        </div>
        <ToastContainer />

        <div
          className={
            screenWidth < 1242 && screenWidth >= 720
              ? "w-full px-4"
              : screenWidth < 720 && screenWidth >= 595
              ? "w-full px-4"
              : screenWidth < 595
              ? "w-full px-4"
              : "flex justify-center"
          }
        >
          <div className={screenWidth >= 1242 ? "w-3/4 pl-12" : "w-full"}>
            <div className="mt-8">
              <div>
                {(screenWidth >= 595 ? isrenderscreen : !isrenderscreen) && (
                  <div className={"w-full"}>
                    <div className="flex justify-center items-center flex-col sm:flex-row">
                      <div className="w-full sm:w-1/3 pl-7 mb-2 sm:mb-0 ">
                        <div className="flex justify-start items-center">
                          <label className="themeSwitcherTwo relative inline-flex cursor-pointer select-none items-center">
                            <input
                              type="checkbox"
                              checked={isActive}
                              onChange={handleToggle}
                              className="sr-only"
                            />
                            <span className="label flex items-center text-xs font-semibold text-black">
                              PASSIVE
                            </span>
                            <span
                              className={`slider mx-3 flex h-5 w-[40px] items-center rounded-full p-1 duration-200 ${
                                isActive ? "bg-[#d74848]" : "bg-[#CCCCCE]"
                              }`}
                            >
                              <span
                                className={`dot h-3 w-3 rounded-full bg-white duration-200 ${
                                  isActive ? "translate-x-[20px]" : ""
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
                              isBluetoothConnected
                                ? "bg-green-500 animate-flash"
                                : "bg-gray-400"
                            } text-black text-xs font-semibold rounded-full justify-center `}
                            onClick={handleDeviceStatus}
                          >
                            {isBluetoothConnected
                              ? "CONNECTED"
                              : "DISCONNECTED"}
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
                            setData([]);
                            setShowRedLine(false);
                            generateCards();
                            setSelectedMinute("");
                            setSelectedSecond("");
                            setKey((prevKey) => prevKey + 1);
                          }}
                        >
                          <ArrowPathIcon className="h-6 w-6  inline" />
                        </button>

                        <button
                          className=" text-black font-bold  rounded-full"
                          onClick={handleDownload}
                          disabled={isPlaying}
                        >
                          <ArrowDownTrayIcon className="h-6 w-6  inline" />
                        </button>
                      </div>
                    </div>

                    <div className="flex mt-2 border-dashed border-gray-300 border-4 rounded-3xl">
                      <div
                        className="flex flex-col justify-center items-center w-full pt-4"
                        ref={chartRef}
                      >
                        <div className="w-full pl-6 font-bold text-2xl">
                          Levels Report
                        </div>
                        <div className="w-full">
                          <div className="flex flex-col items-center justify-start rounded w-full h-[400px]">
                            <ResponsiveContainer
                              width="100%"
                              height="100%"
                              className={"pr-4"}
                            >
                              <LineChart>
                                <Tooltip
                                  cursor={false}
                                  wrapperStyle={{
                                    backgroundColor: "transparent",
                                    padding: "5px",
                                    borderRadius: 4,
                                    overflow: "hidden",
                                    fill: "black",
                                    boxShadow:
                                      "rgba(0, 0, 0, 0.24) 0px 3px 8px",
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
                                  data={data}
                                  type="monotone"
                                  dataKey="val"
                                  dot={{ fill: "yellow", r: 5 }}
                                  strokeDasharray="25 10"
                                  stroke="#8884d8"
                                  strokeWidth={2.5}
                                  stackId="2"
                                  isAnimationActive={false}
                                />
                                {showRedLine && (
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
                                )}
                                <XAxis
                                  dataKey="index"
                                  type="category"
                                  allowDuplicatedCategory={false}
                                  axisLine={false}
                                >
                                  <Label
                                    dy={10}
                                    value="Time"
                                    domain={[1, elapsedTime + 20]}
                                    position="insideBottom"
                                    style={{ textAnchor: "middle" }}
                                    tick={{ fill: "black" }}
                                    ticks={[1, 20, 40, 60, 80, 100, 120]}
                                  />
                                </XAxis>
                                <YAxis axisLine={false}>
                                  <Label
                                    angle={-90}
                                    value="Angle"
                                    position="insideLeft"
                                    style={{ textAnchor: "middle" }}
                                    tick={{ fill: "black" }}
                                  />
                                </YAxis>
                                <CartesianGrid
                                  strokearray="1"
                                  horizontal="true"
                                  vertical=""
                                />
                              </LineChart>
                            </ResponsiveContainer>
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
                          checked={isActive}
                          onChange={handleToggle}
                          className="sr-only"
                        />
                        <span className="label flex items-center text-xs font-semibold text-black">
                          PASSIVE
                        </span>
                        <span
                          className={`slider mx-3 flex h-5 w-[40px] items-center rounded-full p-1 duration-200 ${
                            isActive ? "bg-[#d74848]" : "bg-[#CCCCCE]"
                          }`}
                        >
                          <span
                            className={`dot h-3 w-3 rounded-full bg-white duration-200 ${
                              isActive ? "translate-x-[20px]" : ""
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
                          isBluetoothConnected
                            ? "bg-green-500 animate-flash"
                            : "bg-gray-400"
                        } text-black text-xs font-semibold rounded-full justify-center `}
                        onClick={handleDeviceStatus}
                      >
                        {isBluetoothConnected ? "CONNECTED" : "DISCONNECTED"}
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
                        onClick={handleDownload}
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
                  </div>
                )}
              </div>
            </div>
          </div>

          <div
            className={
              screenWidth >= 1242 ? "w-1/4 px-5 self-end" : "w-full mt-4"
            }
          >
            <div className="">
              <div>
                {(screenWidth >= 1242 ? isrenderscreen : !isrenderscreen) && (
                  <Card
                    color="gray"
                    variant="gradient"
                    className="w-full  px-6"
                  >
                    <CardHeader
                      floated={false}
                      shadow={false}
                      color="transparent"
                      className=" mb-4 rounded-none border-b border-white/10 pb-1 mt-0 text-center"
                    >
                      <Typography
                        variant="h1"
                        color="white"
                        className="mt-6 flex justify-center gap-1 text-7xl font-normal"
                      >
                        <ClockIcon className="lg:h-7 lg:w-7 md:h-5 md:w-5" />
                        {elapsedTime}
                        <p className="text-lg flex items-end">sec</p>
                      </Typography>
                    </CardHeader>
                    <CardBody className="p-0">
                      <ul className="flex flex-col gap-3.5">
                        <li className="flex justify-center items-center gap-4">
                          <Typography className="font-normal text-2xl">
                            {isActive ? "Active" : "Passive"}
                          </Typography>
                          <Typography className="font-normal text-2xl">
                            /
                          </Typography>
                          <Typography className="font-normal text-2xl">
                            {!isLegChecked ? "Left Leg" : "Right Leg"}
                          </Typography>
                        </li>
                        <li className="flex items-center gap-4 justify-between">
                          <Typography className="font-normal">
                            Maximum Angle
                          </Typography>
                          <Typography className="font-normal">
                            {maxAngles}°
                          </Typography>
                        </li>
                        <li className="flex items-center gap-4 justify-between">
                          <Typography className="font-normal">
                            Minimum Angle
                          </Typography>
                          <Typography className="font-normal">
                            {minAngles}°
                          </Typography>
                        </li>
                        <li className="flex items-center gap-4 justify-between">
                          <Typography className="font-normal">
                            Flexion Cycle
                          </Typography>
                          <Typography className="font-normal">
                            {flexionCycles}
                          </Typography>
                        </li>
                        <li className="flex items-center gap-4 justify-between">
                          <Typography className="font-normal">
                            Extension Cycle
                          </Typography>
                          <Typography className="font-normal">
                            {extensionCycles}
                          </Typography>
                        </li>
                        <li className="flex items-center gap-4 justify-between">
                          <Typography className="font-normal">
                            Velocity
                          </Typography>
                          <Typography className="font-normal">
                            {(maxAngles + minAngles) / 2}
                          </Typography>
                        </li>
                        <li className="flex items-center gap-4 justify-between">
                          <Typography className="font-normal">ROM</Typography>
                          <Typography className="font-normal">
                            {maxAngles - minAngles}
                          </Typography>
                        </li>
                      </ul>
                    </CardBody>
                    <CardFooter className="pt-4 w-full">
                      <div className="w-full flex gap-3">
                        <Typography className="font-bold">Note:</Typography>
                        <Typography>Angles in degrees</Typography>
                      </div>
                    </CardFooter>
                  </Card>
                )}

                {(screenWidth < 1242 ? isrenderscreen : !isrenderscreen) && (
                  <Card color="gray" variant="gradient" className="w-full px-6">
                    <div
                      className={`grid grid-rows-3 gap-2 ${
                        screenWidth >= 1205
                          ? "grid-cols-5"
                          : screenWidth < 1205 && screenWidth >= 845
                          ? "grid-cols-3"
                          : screenWidth < 845 && screenWidth >= 595
                          ? "grid-cols-2"
                          : "grid-cols-1"
                      }`}
                    >
                      {/* Merged cell spanning 2 rows in the 1st column */}
                      <div className="col-span-1 row-span-2 flex justify-center items-center">
                        <CardHeader
                          floated={false}
                          shadow={false}
                          color="transparent"
                          className="mx-auto rounded-none border-b border-white/10 pb-2 mt-0 text-center"
                        >
                          <Typography
                            variant="h1"
                            color="white"
                            className={` flex justify-center gap-1 font-normal ${
                              screenWidth >= 845 ? "text-7xl" : "text-6xl"
                            }`}
                          >
                            <ClockIcon
                              className={`${
                                screenWidth >= 845 ? "w-7 h-7" : "w-6 h-6"
                              }`}
                            />
                            120
                            <p
                              className={`flex items-end ${
                                screenWidth >= 845 ? "text-lg" : "text-base"
                              }`}
                            >
                              sec
                            </p>
                          </Typography>
                        </CardHeader>
                        {/* Card Body and Footer content goes here */}
                      </div>

                      {/* Columns 2 to 5 for CardBody content */}
                      {/* {info.map((data, index) => (
                        <div key={index} className="col-span-1">

                          <CardBody>
                            <ul className="flex flex-col">
                              <li className="flex justify-between items-center w-full">
                                <Typography className="font-normal text-base sm:text-lg">
                                  {data.key}
                                </Typography>

                                <Typography className="font-normal text-base sm:text-lg">
                                  {data.value}
                                </Typography>
                              </li>
                            </ul>
                          </CardBody>
                        </div>
                      ))} */}

                      {/* Centered CardFooter in the 3rd row */}
                      <div className="col-span-1 row-span-1 flex items-center justify-center">
                        <CardFooter>
                          <div className="flex gap-3">
                            <Typography className="font-bold text-base sm:text-lg">
                              Note:
                            </Typography>
                            <Typography className="text-base sm:text-lg">
                              Angles in degrees
                            </Typography>
                          </div>
                        </CardFooter>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
        {!isPlaying && (
          <div className="w-full">
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
      {/* <div style={{ display: 'none' }}> */}
      <div style={{ display: "none" }}>
        <Page size="A4" style={styles.page} ref={componentRef}>
          {highlightArray.map(
            (data, index) =>
              index >= 1 && (
                <View key={index} style={styles.graphContainer}>
                  <Text style={styles.graphTitle}>Graph ${index}</Text>
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

      {/* </div> */}
    </>
  );
};

export default Diagno;
