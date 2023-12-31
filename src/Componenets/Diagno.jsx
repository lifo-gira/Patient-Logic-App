import React, { Suspense, useEffect, useRef, useState } from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import classNames from "classnames";
import Fit from "../assets/fit.jpg";
import Profile from "../assets/profile.jpg";
import Logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
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
import { ToastContainer, toast } from "react-toastify";
import html2canvas from "html2canvas";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import RecordRTC from "recordrtc";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MathUtils } from "three";
// Your code using GLTFLoader goes here

import { OrbitControls } from "@react-three/drei";

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
  const [minAngle, setMinAngle] = useState(180);
  const [maxAngle, setMaxAngle] = useState(0);
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
  // console.log(metricArray, "metricArray");

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

    if (counter >= 0 && counter < metricArray.length) {
      const metricItem = metricArray[counter];
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
        if (newAngle < minAngle) {
          setMinAngle(newAngle);
          setMinAnglePoint(newDataPoint); // Set the point for the minimum angle
        }
        if (newAngle > maxAngle) {
          setMaxAngle(newAngle);
          setMaxAnglePoint(newDataPoint); // Set the point for the maximum angle
        }
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
  const [imageSrc, setImageSrc] = useState(null);

  const downloadAsPdf = async () => {
    try {
      const chartContainer = chartRef.current;

      const canvas = await html2canvas(chartContainer, {
        scale: 2,
      });

      const imgData = canvas.toDataURL("image/jpeg");
      setImageSrc(imgData);
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

  useEffect(() => {
    // Trigger PDF generation when imageSrc is updated
    if (imageSrc !== null) {
      generatePdf();
    }
  }, [imageSrc]);

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
  };

  const handleShowNames = () => {
    setShowNames(!showNames);
  };

  const [isActive, setIsActive] = useState(false);

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  const generatePdf = () => {
    const offScreenDiv = document.createElement("div");
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
    </div>
  `;

    offScreenDiv.innerHTML = template;

    html2pdf(offScreenDiv, {
      margin: 10,
      filename: "details.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    });
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
    // startRecording();
    setIsStopButtonClicked(false);
    setIsPlaying(true);
    setKey((prevKey) => prevKey + 1);
    setCounter(-1);
    elapsedTime = -1;
    updateChart();

    // Create a new WebSocket connection when starting the chart
    const newSocket = new WebSocket(
      `wss:/api-backup-vap2.onrender.com/ws/${userId}`
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
      // console.log(newData, "newData");
      const seriesCount = newData.series;
      // seriesCount = Updated_data.length
      for (let i = 0; i < seriesCount.length; i += 20) {
        const slice = seriesCount.slice(i, i + seriesCount.length);
        // console.log(slice);
        stackedMetricsArray.push(...slice);
        console.log(stackedMetricsArray, "STACKED");
        const mappedSlice = slice.map((val, index) => ({
          index: i + index,
          val: parseFloat(val),
        }));

        // console.log(mappedSlice)
        metricArray.push(...mappedSlice);
        // console.log(metricArray, "metrics");
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
        console.log(staticvalue, "VALUE");
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
    const jointAnalysisData = analyzeJointData(angles, times);
    handleNumDropdownsChange(totalCycles);
    jointExtensionVelocity.push(jointAnalysisData.extensionVelocities[0]);
    jointFlexionVelocity.push(jointAnalysisData.flexionVelocities[0]);
    setjointExtensionVelocityValue(jointExtensionVelocity[0]);
    setjointFlexionVelocityValue(jointFlexionVelocity[0]);

    console.log(jointExtensionVelocityValue, "jointExtensionVelocityValue");
    console.log(jointFlexionVelocityValue, "jointFlexionVelocityValue");

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
    let currentAngle = newAngle;
    let testcount = cycleCount;

    if (isSecondValueReceived) {
      console.log(newAngle, "newAngle");
      if (temps > currentAngle && !isFlexion) {
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
      } else if (temps < currentAngle && isFlexion) {
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
  let [highlightArray, sethighlightArray] = useState([]);

  function processObjectArray(ObjectElements) {
    console.log("Inside Fucntion");
    for (let i = 0; i < ObjectElements.length - 1; i++) {
      let change = ObjectElements[i].val - ObjectElements[i + 1].val;
      tempRow.push(ObjectElements[i]);
      if (i + 1 === ObjectElements.length - 1) {
        tempRow.push(ObjectElements[i + 1]);
        highlightArray.push(tempRow);
        // console.log("final push highlightArray",highlightArray)
      }

      if (change === 0) {
        continue;
      }

      if (
        prevSignChange !== null &&
        Math.sign(change) !== Math.sign(prevSignChange)
      ) {
        cycleCount++;
        highlightArray.push(tempRow);
        // console.log("highlightArray",highlightArray)
        tempRow = [ObjectElements[i]];
        // console.log("tempRow",tempRow)

        if (Math.sign(change) === -1) {
          if (minFlexionAngle === null) {
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
          if (minExtensionAngle === null) {
            extensionCycle++;
            minExtensionAngle = initialAngle;
            let maxExtensionAngle = ObjectElements[i].val;
            minFlexionAngle = ObjectElements[i + 1].val;
            // Calculate extension velocity
            initialTime = ObjectElements[i + 1].index;
          } else {
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
    // console.log("ObjectElements",ObjectElements)
    // console.log(flexionVelocities, "extensionVelocities");
    // console.log(extensionVelocities, "extensionVelocities");
    return {
      // flexionVelocities: flexionVelocities,
      // extensionVelocities: extensionVelocities,
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

  const analyzeJointData = (array, time) => {
    // console.log(array, "ANGLES");
    // console.log(time, "Times");

    for (let i = 0; i < array.length - 1; i++) {
      let change = array[i] - array[i + 1];
      const createObject = ChartObject(array[i], time[i]);
      ObjectElements.push(createObject);

      if (change === 0) {
        continue;
      }

      if (
        prevSignChange !== null &&
        Math.sign(change) !== Math.sign(prevSignChange)
      ) {
        cycleCount++;

        if (Math.sign(change) === -1) {
          if (minFlexionAngle === null) {
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
          if (minExtensionAngle === null) {
            extensionCycle++;
            minExtensionAngle = initialAngle;
            let maxExtensionAngle = array[i];
            minFlexionAngle = array[i + 1];
            // Calculate extension velocity
            let extensionVelocity =
              (maxExtensionAngle - minExtensionAngle) / (time[i] - initialTime);
            extensionVelocities.push(extensionVelocity);
            initialTime = time[i + 1];
          } else {
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
    console.log("ObjectElements", ObjectElements);
    // console.log(flexionVelocities, "extensionVelocities");
    // console.log(extensionVelocities, "extensionVelocities");
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

  const redLineData = [
    { index: 1, val: null },
    { index: 2, val: null },
    { index: 3, val: 30 },
    { index: 4, val: 40 },
    { index: 5, val: 50 },
    { index: 6, val: null },
    { index: 7, val: null },
    { index: 8, val: null },
    { index: 9, val: null },
    { index: 10, val: null },
    { index: 11, val: null },
  ];

  let PlotArray = [];
  function GraphPlot(specificArray, size) {
    console.log("INSIDE GraphPlot", specificArray, size);
    for (let i = 0; i < size; i++) {
      PlotArray.push({
        index: i,
        val: null,
      });
    }
    // console.log(PlotArray.length,"length")
    let ExtraArray = [];
    for (let i = 0; i < specificArray.length; i++) {
      ExtraArray.push(specificArray[i].index);
    }
    let k = 0;
    let Index = specificArray[k].index;
    let EndIndex = specificArray[specificArray.length - 1].index;
    for (let i = 0; i < PlotArray.length; i++) {
      if (ExtraArray.includes(PlotArray[i].index) && k < specificArray.length) {
        PlotArray[i].val = specificArray[k].val;
        k += 1;
      }
    }
    // console.log("PlotArray",PlotArray)
  }

  const handleHighlightedGraph = () => {
    console.log("RedLineGraphData", RedLineGraphData);
    setShowRedLine((prev) => !prev);
  };

  const handleOptionChange = (event) => {
    handleHighlightedGraph();
    const selectedOption = event.target.value;

    // Do something with the selected option, for example, log it
    console.log("Selected option:", selectedOption);

    // Update showRedLine state based on the selected option
    setShowRedLine(true); // Set to false to hide the red line

    // You can add more logic or state updates here based on the selected option
    GraphPlot(highlightArray[parseInt(selectedOption, 10)], angles.length - 1);
    setRedLineGraphData(PlotArray);
    console.log("RedLineGraphData", RedLineGraphData);
  };

  return (
    <>
      <header class="fixed w-full">
        <nav class="bg-gray-100 border-gray-500 py-1 dark:bg-gray-900">
          <div class="flex flex-wrap items-center justify-between max-w-screen-xl px-4 mx-auto">
            <a href="#" class="flex items-center">
              <img src={Logo} class="h-6 mr-3 sm:h-9" alt="Landwind Logo" />
            </a>
            <div class="flex items-center lg:order-2">
              <div className="relative">
                <button
                  id="avatarButton"
                  type="button"
                  onClick={() => setDropdownVisible(!isDropdownVisible)}
                  className="w-10 h-10 rounded-full cursor-pointer"
                >
                  <img
                    src={Profile}
                    alt="User dropdown"
                    className="object-cover w-full h-full rounded-full"
                  />
                </button>
                {isDropdownVisible && (
                  <div
                    id="userDropdown"
                    className="absolute top-12 right-0 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
                  >
                    <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                      <div>{}</div>
                      <div className="font-medium truncate">
                        bonnie@gmail.com
                      </div>
                    </div>
                    <ul
                      className="py-2 text-sm text-gray-700 dark:text-gray-200 cursor-pointer"
                      aria-labelledby="avatarButton"
                    >
                      <li
                        onClick={() => setDropdownVisible(!isDropdownVisible)}
                      >
                        <a
                          onClick={() => {
                            setDropdownVisible(!isDropdownVisible);
                            localStorage.setItem("isLoggedIn", false);
                            localStorage.setItem("user", null);
                            console.clear();
                            navigate("/");
                          }}
                          className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                          Dashboard
                        </a>
                      </li>
                    </ul>
                    {/* <ul
                      className="py-2 text-sm text-gray-700 dark:text-gray-200 cursor-pointer"
                      aria-labelledby="avatarButton"
                    >
                      <li
                        onClick={() => setDropdownVisible(!isDropdownVisible)}
                      >
                        <a
                          onClick={() => {
                            setDropdownVisible(!isDropdownVisible);
                            // console.clear();
                            navigate("/static");
                          }}
                          className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer"
                        >
                          Static Graph
                        </a>
                      </li>
                    </ul> */}
                    <div className="py-1">
                      <a
                        onClick={() => {
                          setDropdownVisible(!isDropdownVisible);
                          localStorage.setItem("isLoggedIn", false);
                          localStorage.setItem("user", null);
                          console.clear();
                          navigate("/login");
                        }}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white cursor-pointer"
                      >
                        Sign out
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>
      <div className="flex flex-col justify-center items-center bg-gradient-to-r from-cyan-100 to-cyan-500 ">
        <ToastContainer
          position="top-right"
          autoClose={7000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />

        <ToastContainer />

        {/* First Section */}
        <div className="w-full p-10 flex flex-col gap-5 md:flex-row mt-8">
          {/* Left Side (Image Frame) */}
          <div className="w-80 h-72 bg-cyan-200 rounded-2xl shadow-2xl mb-4 md:mb-0">
            <img
              src={Fit}
              alt="fit"
              className="w-full h-full object-cover rounded-3xl p-3"
            />
          </div>

          {/* Right Side (Heading and Paragraph) */}
          <div className="md:ml-8">
            <h1 className="text-5xl font-semibold font-sans">MOVEMENT</h1>
            <br />
            <p className="text-black text-2xl font-sans">
              Keep your head straight and your neck relaxed.
              <br /> Relax your shoulders and keep them back and down.
              <br /> Bend your arms at 90 angle and keep your hands relaxed.
              <br /> Lean forward slightly without bending the waist.
              <br /> Avoid Lifting your knees too high.
            </p>
          </div>
          <div
            style={{
              position: "relative",
              width: "50vw",
              height: "40vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Canvas
              camera={{ position: [-180, 10, 20], fov: 6 }}
              style={{ width: "40vw", height: "40vh" }}
            >
              {models.map((model, index) => (
                <Model
                  key={index}
                  url={model.url}
                  position={model.position}
                  shouldRotate={model.shouldRotate}
                  setTargetRotation={targetRotation}
                />
              ))}
              <directionalLight position={[10, 10, 0]} intensity={1.5} />
              <directionalLight position={[-10, 10, 5]} intensity={1} />
              <directionalLight position={[-10, 20, 0]} intensity={1.5} />
              <directionalLight position={[0, -10, 0]} intensity={0.25} />

              <OrbitControls
                enableZoom={false} // Disable zooming
                enablePan={false} // Disable panning
                enableRotate={false}
              />
            </Canvas>
          </div>
        </div>

        {/* Toggle Button */}
        {/* <button
        className={`mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg`}
        onClick={togglePlay}
      >
        {isPlaying ? 'Pause' : 'Play'}
      </button> */}

        <div
          onClick={() => setisLeg(!isLeg)}
          className={classNames(
            "flex w-20 h-10 bg-gray-600 mt-4 rounded-full transition-all duration-500 cursor-pointer",
            { "bg-green-500": isLeg }
          )}
        >
          <span
            className={classNames(
              "h-10 w-10 text-3xl font-extrabold text-center my-auto bg-white rounded-full transition-all duration-500 shadow-lg cursor-pointer",
              { "ml-10": isLeg }
            )}
          >
            {isLeg ? "R" : "L"}
          </span>
        </div>

        {/* Glass Morphic Section */}
        <div className="w-3/4 h-[105rem] my-8 relative border-1 bg-opacity-30 bg-white shadow-xl backdrop-blur-3xl backdrop-brightness-90 rounded-3xl">
          {/* Toggle Button (Top Left) */}
          <button
            className={`m-2 flex items-center justify-center w-20 h-20 rounded-full bg-blue-500 text-white ${
              isPlaying ? "bg-red-500" : "bg-green-500"
            }`}
            onClick={handleClick}
            // disabled={isStartButtonDisabled}
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>

          {/* Bluetooth Connection (Top Right) */}
          <div className="absolute top-4 right-4 flex items-center">
            <div
              className={`w-4 h-4 rounded-full mr-2 ${
                isBluetoothConnected ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            <span>{isBluetoothConnected ? "Connected" : "Disconnected"}</span>
          </div>
          <div className="mb-4">
            <label
              htmlFor="timeInterval"
              className="block text-gray-700 font-bold"
            >
              Select Time Interval (min):
            </label>
            <select
              id="timeInterval"
              name="timeInterval"
              value={selectedTime}
              onChange={handleTimeChange}
              className="block w-full mt-2 p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-500"
            >
              <option value="">Select an interval</option>
              {timeIntervals.map((interval, index) => (
                <option key={index} value={interval}>
                  {interval}
                </option>
              ))}
            </select>
                  
          </div>

          {/* Graph Import Area (Below) */}
          <div className="mt-0 mx-4">
            {/* Add your graph import area here */}
            {/* Example: <input type="file" accept=".png, .jpg, .jpeg" /> */}

            <div className="w-full p-2 flex flex-col items-center">
              {/* Same as */}
              <div className="p-0">
                <div className="w-full h-64">
                  <CountdownCircleTimer
                    key={key}
                    isPlaying={isPlaying}
                    duration={selectedTime * 60} // 2 minutes
                    colors={[["#3c005a"]]}
                    size={230}
                    strokeWidth={8}
                    onComplete={() => {
                      setIsPlaying(false);
                      handleTimerStop();
                      return [false, 0]; // Stop the timer and reset to 0
                    }}
                  >
                    {({ remainingTime }) => (
                      <div className="text-4xl">
                        {`${Math.floor(remainingTime / 60)
                          .toString()
                          .padStart(2, "0")}:${(remainingTime % 60)
                          .toString()
                          .padStart(2, "0")}`}
                      </div>
                    )}
                  </CountdownCircleTimer>
                </div>
                          
              </div>
              <div
                className="flex flex-col items-center justify-start pr-5 rounded w-full h-[900px]"
                ref={chartRef}
              >
                <button onClick={handleHighlightedGraph}>
                  {showRedLine ? "Hide Red Line" : "Show Red Line"}
                </button>

                <label className="block mb-2">
                  Select an Option:
                  <select
                    className="border border-gray-300 p-2 w-full"
                    onChange={handleOptionChange}
                  >
                    <option value="" disabled selected>
                      Select an option
                    </option>
                    {Array.from({ length: numDropdowns }, (_, index) => (
                      <option key={index} value={`${index + 1}`}>
                        Option {index + 1}
                      </option>
                    ))}
                  </select>
                </label>

                <ResponsiveContainer width="100%" height="80%">
                  <LineChart className={"mx-auto"}>
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
                    <XAxis
                      dataKey="index"
                      type="category"
                      allowDuplicatedCategory={false}
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
                    <YAxis>
                      <Label
                        angle={-90}
                        value="Angle"
                        position="insideLeft"
                        style={{ textAnchor: "middle" }}
                        tick={{ fill: "black" }}
                      />
                    </YAxis>
                    <Line
                      data={data}
                      dataKey="val"
                      fill="black"
                      type="monotone"
                      dot={{ fill: "yellow", r: 5 }}
                      strokeWidth={3}
                      stackId="2"
                      stroke="purple"
                      isAnimationActive={false}
                    />
                    {showRedLine && (
                      <Line
                        data={RedLineGraphData}
                        dataKey="val"
                        fill="red"
                        type="monotone"
                        dot={{ fill: "yellow", r: 5 }}
                        strokeWidth={3}
                        stackId="2"
                        stroke="red"
                        isAnimationActive={false}
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center">
                <button
                  onClick={generatePdf}
                  className={`
      w-full h-12 text-xl p-4 py-2 mt-[-6rem]
      bg-gradient-to-r from-purple-500 to-blue-500
      hover:from-purple-600 hover:to-blue-600
      text-white font-bold mx-auto rounded-2xl
      border-2 border-white
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
      transform hover:scale-105 transition-transform duration-300 ease-in-out
    `}
                  disabled={isPlaying}
                >
                  {isPlaying ? "Cannot Download Chart" : "Download Chart"}
                </button>
                <center>
                  <form onSubmit={handleSubmit}>
                    <div>
                      <div style={{ display: "none" }}>
                        <label>Start Date:</label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={handleStartDateChange}
                        />
                      </div>
                    </div>
                    <div style={{ display: "none" }}>
                      <label>End Date:</label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={handleEndDateChange}
                      />
                    </div>
                    <div style={{ display: "none" }}>
                      <label>Start Time:</label>
                      <input
                        type="text"
                        value={startTime}
                        onChange={handleStartTimeChange}
                      />
                    </div>
                    <div style={{ display: "none" }}>
                      <label>End Time:</label>
                      <input
                        type="text"
                        value={endTime}
                        onChange={handleEndTimeChange}
                      />
                    </div>
                    <div>
                      <button
                        className={`
      w-full h-12 text-xl p-4 py-2 mt-[-6rem]
      bg-gradient-to-r from-purple-500 to-blue-500
      hover:from-purple-600 hover:to-blue-600
      text-white font-bold mx-auto rounded-2xl
      border-2 border-white
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
      transform hover:scale-105 transition-transform duration-300 ease-in-out
    `}
                        type="submit"
                      >
                        Delete Chart
                      </button>
                    </div>
                  </form>
                </center>
              </div>
              <br></br>
              {prevAngle !== null && currentAngle !== null && (
                <div className="flex justify-center mt-4">
                  <div className="mr-4">
                    <strong>Previous Angle:</strong> {prevAngle.toFixed(2)}°
                  </div>
                  <div>
                    <strong>Current Angle:</strong> {currentAngle.toFixed(2)}°
                  </div>
                </div>
              )}
              <div className="flex justify-center mt-4">
                <div className="mr-4">
                  <strong>Minimum Angle:</strong> {minAngle.toFixed(2)}°
                </div>
                <div>
                  <strong>Maximum Angle:</strong> {maxAngle.toFixed(2)}°
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-4 mb-4">
                  <span className="text-gray-600 bold">
                    <h1>Status:</h1>
                  </span>
                  <label
                    className={`relative inline-block w-10 h-6 ${
                      isActive ? "bg-blue-500" : "bg-gray-300"
                    } rounded-full cursor-pointer transition-all duration-300`}
                  >
                    <input
                      type="checkbox"
                      className="opacity-0 w-0 h-0"
                      checked={isActive}
                      onChange={handleToggle}
                    />
                    <span
                      className={`absolute left-0 inline-block w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                        isActive ? "translate-x-full" : ""
                      }`}
                    ></span>
                  </label>
                  <span className="text-sm" id="statusText">
                    <h1>{isActive ? "Active" : "Passive"}</h1>
                  </span>
                </div>
                <h2>
                  <b>Cycle Information:</b>
                </h2>
                <p>
                  <b>Flexion Cycles: {flexionCycles}</b>
                </p>
                <p>
                  <b>Extension Cycles: {extensionCycles}</b>
                </p>
                <p>
                  <b>Total Cycles: {totalCycles}</b>
                </p>
                <p>
                  <b>Flexion Velocities: {jointFlexionVelocityValue}</b>
                </p>
                <p>
                  <b>Extension Velocities: {jointExtensionVelocityValue}</b>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <Live/> */}
      <center>
        {!isPlaying && (
          <>
            <button
              className={`
        w-half h-12 text-xl p-4 py-2 mt-[-6rem]
        bg-gradient-to-r from-purple-500 to-blue-500
        hover:from-purple-600 hover:to-blue-600
        text-white font-bold mx-auto rounded-2xl
        border-2 border-white
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        transform hover:scale-105 transition-transform duration-300 ease-in-out
      `}
              onClick={() => {
                handleButtonClick();
                setIsChartButtonClicked(true);
              }}
              disabled={!isStopButtonClicked}
            >
              {isChartButtonClicked ? "Chart Shown" : "Show Chart"}
            </button>

            {isChartVisible && (
              <div className="w-[800px] h-[400px]">
                <br></br>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={sdata.labels.map((label, index) => ({
                      name: label,
                      [sdata.datasets[0].name]: sdata.datasets[0].data[index],
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey={sdata.datasets[0].name}
                      stroke="aqua"
                      fill="aqua"
                    />
                  </LineChart>
                </ResponsiveContainer>
                <div className="text-center">
                  <input
                    type="range"
                    min="0"
                    max={initialData.labels.length - 6}
                    value={progressbar}
                    onChange={handleProgressChange}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </center>
    </>
  );
};

export default Diagno;
