import React, { useState, useEffect, useRef } from "react";
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
  PhoneIcon,
} from "@heroicons/react/24/solid";
import { ZIM } from "zego-zim-web";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import Dashboard from "./HomePage";
import Exercise from "./Exercise";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [screenheight, setScreenHeight] = useState(window.innerHeight);
  const [isside, setisside] = useState(true);
  const navigate = useNavigate();
  var storedData = localStorage.getItem("user");
  // Parse the stored data from JSON
  var parsedData = JSON.parse(storedData);

  // Access the user_id property
  var userId = parsedData.user_id;
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
  const openDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(!isClicked);
  };
  const menuItems = ["Dashboard", "Exercise", "Analysis", "Suggestion"];
  const [activeMenuItem, setActiveMenuItem] = useState(menuItems[0]);
  const [open, setOpen] = useState(1); // Track the selected item
  const handleItemClick = (itemNumber) => {
    setOpen(itemNumber);
    setActiveMenuItem(menuItems[itemNumber - 1]);
  };

  const handleMenuItemClick = (i) => {
    setActiveMenuItem(menuItems[i]);
  };

  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const socket = new WebSocket("wss://api-backup-vap2.onrender.com/patients");

    socket.onmessage = (event) => {
      // Handle the WebSocket message
      console.log("WebSocket message received:", event.data);

      try {
        const messageData = JSON.parse(event.data);
        console.log(messageData, "HI");
        // Check if the flag is 1 in the received message
        console.log();
        if (messageData.flag === 2) {
          // Increment the notification count when a new WebSocket message is received with flag 1
          setNotificationCount((prevCount) => prevCount + 1);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };
    // Example client-side code
    return () => {
      socket.close();
    };
  }, []);

  const handleRefresh = () => {
    window.location.reload();
    setNotificationCount(0);
  };

  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown((prevState) => !prevState);
  };

  var storedData = localStorage.getItem("user");
  var parsedData = JSON.parse(storedData);
  var user_Id = parsedData._id;
  var user_Name = parsedData.user_id;
  const [documentId, setDocumentId] = useState(null);
  const [doctorId, setdoctorId] = useState(null);
  const [doctorName, setdoctorName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState({
    userName: "",
    userId: "",
  });
  const zeroCloudInstance = useRef(null);

  useEffect(() => {
    const fetchPatientInfo = async () => {
      try {
        const response = await fetch(
          `https://api-backup-vap2.onrender.com/patient-info/${user_Id}`
        );
        const data = await response.json();

        if (response.ok) {
          setDocumentId(data._id);
          setdoctorId(data.doctor_id)
          setdoctorName(data.doctor_assigned)
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
  }, []);

  useEffect(() => {
    if (documentId && doctorId && doctorName) {
      init();
    }
  }, [documentId,doctorId,doctorName]);

  const init = async () => {
    setUserInfo({
      user_Name,
      user_Id,
    });
    const appID = 1455965454;
    const serverSecret = "c49644efc7346cc2a7a899aed401ad76";
    const KitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      documentId,
      user_Id,
      user_Name
    );
    zeroCloudInstance.current = ZegoUIKitPrebuilt.create(KitToken);
    zeroCloudInstance.current.addPlugins({ ZIM });
  };

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized) {
      handleVideoCallButtonClick();
      setInitialized(true);
    }
  }, [initialized]);

  const handleVideoCallButtonClick = () => {
    
    // Video call logic
    const appID = 1455965454;
    const serverSecret = "c49644efc7346cc2a7a899aed401ad76";
    const KitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      documentId,
      user_Id,
      user_Name
    );

    // Initialize ZegoCloudInstance and send call invitation
    const zeroCloudInstance = ZegoUIKitPrebuilt.create(KitToken);
    zeroCloudInstance.addPlugins({ ZIM });

    // Send video call invitation
    zeroCloudInstance
      .sendCallInvitation({
        callees: [{ userID: doctorId, userName: doctorName }],
        callType: ZegoUIKitPrebuilt.InvitationTypeVideoCall,
        timeout: 60,
      })
      .then((res) => {
        console.warn(res);
        if (res.errorInvitees.length) {
          alert("The user does not exist or is offline.");
        }
        return null;
      })
      .catch((err) => {
        console.error(err);
        return null;
      });
  };

  return (
    <div
      className={`w-full flex flex-row ${
        screenWidth < 1000 ||
        (activeMenuItem === "Exercise" && screenWidth < 1105)
          ? "h-full"
          : "h-screen"
      }`}
    >
      {!isside && activeMenuItem != "Exercise" && (
        <div
          className={`w-full md:w-1/6 lg:w-1/5 xl:w-1/6 bg-black h-screen overflow-y-auto font-poppins`}
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
              <div>
                <Typography variant="h5" color="blue-gray" className="font-poppins ">
                  {userId}
                </Typography>
                <Typography variant="h7" color="blue-gray" className="font-poppins ">
                  Patient ID: 123456
                </Typography>
              </div>
            </div>
            <List
              className={` bg-white font-poppins ${
                screenWidth < 1535 ? "" : " w-full pl-8 pr-0"
              }`}
            >
              <ListItem
                className={`rounded-none focus:bg-gradient-to-r from-white to-cyan-200 ${
                  screenWidth < 1535 ? "w-2/3 px-4" : " w-full p-3"
                } ${open ===1 && activeMenuItem != "Report"?"bg-gradient-to-r from-white to-cyan-200":"bg-transparent"}`}
                selected={open === 1}
                onClick={() => handleItemClick(1)}
              >
                <ListItemPrefix>
                  <Squares2X2Icon className="h-5 w-5" />
                </ListItemPrefix>
                <Typography color="blue-gray" className="mr-auto font-normal">
                  Dashboard
                </Typography>
              </ListItem>

              <ListItem
                className={`rounded-none focus:bg-gradient-to-r from-white to-cyan-200 ${
                  screenWidth < 1535 ? "w-2/3 px-4" : " w-full p-3"
                } ${open ===2?"bg-gradient-to-r from-white to-cyan-200":"bg-transparent"}`}
                selected={open === 2}
                onClick={() => handleItemClick(2)}
              >
                <ListItemPrefix>
                  <AdjustmentsHorizontalIcon className="h-5 w-5" />
                </ListItemPrefix>
                <Typography color="blue-gray" className="mr-auto font-normal">
                  Exercise
                </Typography>
              </ListItem>

              <ListItem
                className={`rounded-none focus:bg-gradient-to-r from-white to-cyan-200 ${
                  screenWidth < 1535 ? "w-2/3 px-4" : " w-full p-3"
                } ${open ===3?"bg-gradient-to-r from-white to-cyan-200":"bg-transparent"}`}
                selected={open === 3}
                onClick={() => handleItemClick(3)}
              >
                <ListItemPrefix>
                  <ChartBarIcon className="h-5 w-5" />
                </ListItemPrefix>
                Analysis
              </ListItem>
              <ListItem
                className={`rounded-none focus:bg-gradient-to-r from-white to-cyan-200 ${
                  screenWidth < 1535 ? "w-2/3 px-4" : " w-full p-3"
                } ${open ===4?"bg-gradient-to-r from-white to-cyan-200":"bg-transparent"}` }
                selected={open === 4}
                onClick={() => handleItemClick(4)}
              >
                <ListItemPrefix>
                  <ChatBubbleLeftRightIcon className="h-5 w-5" />
                </ListItemPrefix>
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
      {isside && activeMenuItem != "Exercise" && (
        <div>
          <Drawer
            open={isDrawerOpen}
            overlay={false}
            className={`
            ${screenheight > 670 ? "mt-20" : "mt-20"}`}
          >
            <Card className="h-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5 rounded-none font-poppins">
              <div className="mb-2 flex flex-col items-center gap-2 p-0">
                <div className="flex items-center gap-1 rounded-full">
                  <Avatar
                    variant="circular"
                    alt="tania andrew"
                    className="border-[3px] border-white-900"
                    src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
                  />
                </div>
                <div>
                  <Typography variant="h5" color="blue-gray"className="font-poppins">
                    Anirudh P Menon
                  </Typography>
                  <Typography variant="h7" color="blue-gray">
                    Patient ID: 123456
                  </Typography>
                </div>
              </div>
              <List
              className={` bg-white ${
                screenWidth < 1535 ? "" : " w-full pl-8 pr-0"
              }`}
            >
              <ListItem
                className={`rounded-none focus:bg-gradient-to-r from-white to-cyan-200 ${
                  screenWidth < 1535 ? "w-2/3 px-4" : " w-full p-3"
                } ${open ===1 && activeMenuItem != "Report"?"bg-gradient-to-r from-white to-cyan-200":"bg-transparent"}`}
                selected={open === 1}
                onClick={() => handleItemClick(1)}
              >
                <ListItemPrefix>
                  <Squares2X2Icon className="h-5 w-5" />
                </ListItemPrefix>
                <Typography color="blue-gray" className="mr-auto font-normal">
                  Dashboard
                </Typography>
              </ListItem>

              <ListItem
                className={`rounded-none focus:bg-gradient-to-r from-white to-cyan-200 ${
                  screenWidth < 1535 ? "w-2/3 px-4" : " w-full p-3"
                } ${open ===2?"bg-gradient-to-r from-white to-cyan-200":"bg-transparent"}`}
                selected={open === 2}
                onClick={() => handleItemClick(2)}
              >
                <ListItemPrefix>
                  <AdjustmentsHorizontalIcon className="h-5 w-5" />
                </ListItemPrefix>
                <Typography color="blue-gray" className="mr-auto font-normal">
                  Exercise
                </Typography>
              </ListItem>

              <ListItem
                className={`rounded-none focus:bg-gradient-to-r from-white to-cyan-200 ${
                  screenWidth < 1535 ? "w-2/3 px-4" : " w-full p-3"
                } ${open ===3?"bg-gradient-to-r from-white to-cyan-200":"bg-transparent"}`}
                selected={open === 3}
                onClick={() => handleItemClick(3)}
              >
                <ListItemPrefix>
                  <ChartBarIcon className="h-5 w-5" />
                </ListItemPrefix>
                Analysis
              </ListItem>
              <ListItem
                className={`rounded-none focus:bg-gradient-to-r from-white to-cyan-200 ${
                  screenWidth < 1535 ? "w-2/3 px-4" : " w-full p-3"
                } ${open ===4?"bg-gradient-to-r from-white to-cyan-200":"bg-transparent"}` }
                selected={open === 4}
                onClick={() => handleItemClick(4)}
              >
                <ListItemPrefix>
                  <ChatBubbleLeftRightIcon className="h-5 w-5" />
                </ListItemPrefix>
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
        className={` bg-gray-200 flex flex-col h-full ${
          screenWidth < 1535 || activeMenuItem === "Exercise"
            ? "w-full"
            : "w-5/6"
        }`}
      >
        {activeMenuItem != "Exercise" && (
          <div
            className={`w-full h-20 bg-gradient-to-b from-blue-gray-500 to-gray-600 flex flex-row items-center  ${
              screenWidth < 460 ? "pl-4 gap-4" : "pl-12 gap-8"
            }`}
          >
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
                screenWidth < 600 ? "w-4/6 gap-2" : "gap-20 w-3/4"
              }`}
            >
              <div class={`${screenWidth < 600 ? "w-full" : "w-2/3"}`}>
                <div class="relative flex items-center w-full h-12 rounded-2xl focus-within:shadow-lg bg-white overflow-hidden">
                  <div class="grid place-items-center h-full w-12 text-gray-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>

                  <input
                    class="peer h-full w-full outline-none text-sm text-gray-700 pr-2"
                    type="text"
                    id="search"
                    placeholder="Search something.."
                  />
                </div>
              </div>

              <div className="relative inline-flex items-center">
                <button
                  type="button"
                  className="relative inline-flex items-center p-3 text-sm font-medium text-center text-white bg-transparent rounded-lg cursor-pointer"
                  onClick={toggleDropdown}
                >
                  <BellIcon className="w-8 h-8 cursor-pointer" />
                  {notificationCount > 0 && (
                    <div className="absolute inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-0 -end-0 dark:border-gray-900">
                      {notificationCount}
                    </div>
                  )}
                </button>
                {showDropdown && (
                  <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 py-2 w-56 bg-white rounded-lg shadow-xl z-10">
                    <p
                      className={`text-gray-700 px-4 py-2 ${
                        notificationCount > 0 ? "cursor-pointer" : ""
                      }`}
                      onClick={notificationCount > 0 ? handleRefresh : null}
                    >
                      {notificationCount > 0
                        ? `New Exercises made. Click to refresh.`
                        : "No new messages"}
                    </p>
                  </div>
                )}
                <PhoneIcon className="w-7 h-7" onClick={handleVideoCallButtonClick}/>
              </div>
            </div>
          </div>
        )}
        <div
          className={`w-full ${
            activeMenuItem === "Exercise" &&
            screenWidth >= 900 &&
            screenheight > 1024
              ? "h-screen"
              : activeMenuItem === "Exercise" &&
                (screenWidth < 900 || screenheight <= 1024)
              ? "h-full"
              : screenWidth < 1000
              ? "h-full"
              : "h-5/6 mt-10"
          }`}
        >
          {activeMenuItem === "Dashboard" && <Dashboard />}
          {activeMenuItem === "Exercise" && (
            <Exercise
              onBack={() => {
                handleItemClick(1);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
